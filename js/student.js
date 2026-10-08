(function () {
  "use strict";
  const next = new URLSearchParams(window.location.search).get("next");
  function safeNext() {
    if (!next || next.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(next)) return "index.html";
    return next;
  }
  const loginForm = document.getElementById("login-form");
  const passwordForm = document.getElementById("password-form");
  const loginMessage = document.getElementById("login-message");
  const passwordMessage = document.getElementById("password-message");
  const account = document.getElementById("account-panel");
  const loginPanel = document.getElementById("login-panel");
  function report(node, message, state) { node.textContent = message; node.dataset.state = state; }
  function showAccount(student) {
    loginPanel.classList.add("is-hidden");
    account.classList.remove("is-hidden");
    document.getElementById("account-name").textContent = student.name;
    document.getElementById("account-class").textContent = student.class_name;
  }
  const saved = window.MathPractice.getStudent();
  if (saved) {
    if (next) window.location.replace(safeNext());
    else showAccount(saved);
  }
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const button = loginForm.querySelector("button[type=submit]");
    button.disabled = true;
    report(loginMessage, "Memeriksa akun…", "pending");
    try {
      const student = await window.MathPractice.login(loginForm.elements.student_id.value, loginForm.elements.password.value);
      report(loginMessage, "Berhasil masuk.", "success");
      window.location.assign(safeNext());
    } catch (error) { report(loginMessage, error.message, "error"); }
    finally { button.disabled = false; }
  });
  passwordForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const current = passwordForm.elements.current_password.value;
    const nextPassword = passwordForm.elements.new_password.value;
    if (nextPassword !== passwordForm.elements.confirm_password.value) { report(passwordMessage, "Kata sandi baru belum sama.", "error"); return; }
    if (nextPassword.length < 8) { report(passwordMessage, "Gunakan sedikitnya 8 karakter.", "error"); return; }
    const button = passwordForm.querySelector("button[type=submit]");
    button.disabled = true;
    report(passwordMessage, "Menyimpan kata sandi…", "pending");
    try {
      await window.MathPractice.changePassword(current, nextPassword);
      passwordForm.reset();
      report(passwordMessage, "Kata sandi berhasil diganti. Sesi lain telah dikeluarkan.", "success");
    } catch (error) { report(passwordMessage, error.message, "error"); }
    finally { button.disabled = false; }
  });
  document.getElementById("continue-button").addEventListener("click", function () { window.location.assign(safeNext()); });
  document.getElementById("logout-button").addEventListener("click", function () {
    window.MathPractice.logout().catch(function () {});
    account.classList.add("is-hidden");
    loginPanel.classList.remove("is-hidden");
    loginForm.reset();
    report(loginMessage, "Anda sudah keluar dari perangkat ini.", "success");
  });
})();
