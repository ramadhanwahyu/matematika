/* Shared browser helpers for authenticated Math Practice sessions. */
(function () {
  "use strict";
  window.MathPractice = window.MathPractice || {};
  window.MathPractice.config = {
    appsScriptWebAppUrl: "https://script.google.com/macros/s/AKfycbwEVFvjYYO7TOtI-beifE-N7UyMf3eopZsEwEGL7EzNs28EjomjKykq9L43eqcOLHW1/exec"
  };
  const sessionKey = "mathPracticeSession";
  function endpoint() {
    const value = window.MathPractice.config.appsScriptWebAppUrl.trim();
    if (!value) throw new Error("URL Google Apps Script belum diisi di js/common.js.");
    return value;
  }
  function storedSession() {
    try { return JSON.parse(localStorage.getItem(sessionKey) || "null"); } catch (error) { return null; }
  }
  function saveSession(session) {
    try { localStorage.setItem(sessionKey, JSON.stringify(session)); }
    catch (error) { throw new Error("Sesi tidak dapat disimpan. Periksa pengaturan browser."); }
  }
  async function post(payload, keepalive) {
    const response = await fetch(endpoint(), { method: "POST", body: JSON.stringify(payload), redirect: "follow", credentials: "omit", keepalive: Boolean(keepalive) });
    if (!response.ok) throw new Error("Server tidak dapat dihubungi saat ini.");
    const data = await response.json();
    if (!data || data.success !== true) throw new Error(data && data.message ? data.message : "Permintaan ditolak server.");
    return data;
  }
  window.MathPractice.login = async function (studentId, password) {
    const data = await post({ action: "login", student_id: studentId.trim(), password });
    saveSession({ token: data.token, student: data.student, expires_at: data.expires_at });
    return data.student;
  };
  window.MathPractice.getStudent = function () {
    const session = storedSession();
    if (!session || !session.token || !session.student || Date.parse(session.expires_at) <= Date.now()) return null;
    return session.student;
  };
  window.MathPractice.getSessionToken = function () {
    const session = storedSession();
    return window.MathPractice.getStudent() && session ? session.token : "";
  };
  window.MathPractice.clearStudent = function () { try { localStorage.removeItem(sessionKey); } catch (error) {} };
  window.MathPractice.logout = async function () {
    const token = window.MathPractice.getSessionToken();
    window.MathPractice.clearStudent();
    if (token) return post({ action: "logout", token }, true);
  };
  window.MathPractice.changePassword = function (currentPassword, newPassword) {
    return post({ action: "change_password", token: window.MathPractice.getSessionToken(), current_password: currentPassword, new_password: newPassword });
  };
  window.MathPractice.shuffle = function (items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    return shuffled;
  };
  window.MathPractice.showOnly = function (active, all) { all.forEach(function (element) { element.classList.toggle("is-hidden", element !== active); }); };
  window.MathPractice.submitExerciseResult = async function (result) {
    if (!window.MathPractice.getStudent()) throw new Error("Sesi berakhir. Masuk kembali untuk menyimpan nilai.");
    return post({ action: "save_result", token: window.MathPractice.getSessionToken(), result: result });
  };
  const student = window.MathPractice.getStudent();
  document.querySelectorAll("[data-student-link]").forEach(function (link) { link.textContent = student ? "Akun siswa" : "Masuk siswa"; });
  document.querySelectorAll("[data-active-student]").forEach(function (label) {
    if (!student) return;
    label.textContent = student.name + " \u00b7 " + student.class_name;
    label.hidden = false;
  });
  document.querySelectorAll("[data-logout]").forEach(function (button) {
    button.addEventListener("click", async function () {
      button.disabled = true;
      window.MathPractice.logout().catch(function () {});
      window.location.replace("../student.html");
    });
  });
  const summary = document.getElementById("student-summary");
  if (summary && student) {
    summary.textContent = student.name + " \u00b7 " + student.class_name;
    summary.setAttribute("aria-label", "Akun aktif: " + student.name + ", kelas " + student.class_name);
    const actions = summary.parentElement;
    const accountLink = document.createElement("a");
    accountLink.className = "back-link";
    accountLink.href = "../student.html";
    accountLink.textContent = "Akun siswa";
    const logout = document.createElement("button");
    logout.className = "text-button";
    logout.type = "button";
    logout.textContent = "Keluar";
    logout.addEventListener("click", function () {
      logout.disabled = true;
      window.MathPractice.logout().catch(function () {});
      window.location.replace("../student.html");
    });
    actions.append(accountLink, logout);
  }
  if (summary) {
    window.addEventListener("pageshow", function () {
      if (window.MathPractice.getStudent()) return;
      const parts = window.location.pathname.split("/").filter(Boolean);
      const destination = parts.length > 1 && parts[parts.length - 2] === "latihan" ? "latihan/" + parts[parts.length - 1] : parts[parts.length - 1];
      window.location.replace("../student.html?next=" + encodeURIComponent(destination));
    });
  }
})();
