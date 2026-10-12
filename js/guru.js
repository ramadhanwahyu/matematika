(function () {
  "use strict";
  const api = window.MathPractice;
  const byId = (id) => document.getElementById(id);
  const loginPanel = byId("login-panel");
  const dashboard = byId("dashboard");
  const loginForm = byId("login-form");
  const filter = byId("exercise-filter");
  const body = byId("results-body");
  const dialog = byId("action-dialog");
  let token = "";
  let results = [];
  let pendingAction = null;
  let requestId = 0;
  let actionInProgress = false;

  function message(target, text, state) {
    target.textContent = text || "";
    target.dataset.state = state || "";
  }
  async function call(action, data) {
    const endpoint = api.config.appsScriptWebAppUrl.trim();
    if (!endpoint) throw new Error("URL Google Apps Script belum diisi di js/common.js.");
    const response = await fetch(endpoint, { method: "POST", body: JSON.stringify(Object.assign({ action: action, token: token }, data || {})), redirect: "follow", credentials: "omit" });
    if (!response.ok) throw new Error("Server tidak dapat memproses permintaan saat ini.");
    const payload = await response.json();
    if (!payload || payload.success !== true) throw new Error(payload && payload.message ? payload.message : "Permintaan tidak dapat diproses.");
    return payload;
  }
  function login() {
    loginPanel.classList.add("is-hidden"); dashboard.classList.remove("is-hidden");
    loadResults();
  }
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = byId("teacher-password");
    const button = loginForm.querySelector("button[type=submit]");
    const password = input.value;
    if (!password) { message(byId("login-message"), "Masukkan password guru.", "error"); input.focus(); return; }
    button.disabled = true; button.textContent = "Memeriksa…"; message(byId("login-message"), "Memeriksa password…", "pending");
    try { const result = await call("teacher_login", { password: password }); token = result.token; input.value = ""; message(byId("login-message"), "", ""); login(); }
    catch (error) { message(byId("login-message"), error.message, "error"); input.value = ""; input.focus(); }
    finally { button.disabled = false; button.textContent = "Masuk"; }
  });

  function currentExercise() { return filter.value; }
  function visibleResults() { return results.filter((item) => !currentExercise() || item.exercise_id === currentExercise()).sort((a, b) => b.score - a.score || new Date(b.timestamp) - new Date(a.timestamp)); }
  function updateSummary() {
    const shown = visibleResults();
    byId("result-count").textContent = String(results.length);
    byId("exercise-count").textContent = String(new Set(results.map((item) => item.exercise_id)).size);
    byId("average-score").textContent = shown.length ? (shown.reduce((sum, item) => sum + item.score, 0) / shown.length).toLocaleString("id-ID", { maximumFractionDigits: 1 }) : "—";
    byId("table-count").textContent = shown.length ? `Menampilkan ${shown.length} hasil` : "";
    const hasFilter = Boolean(currentExercise());
    byId("dedupe-button").disabled = !hasFilter || shown.length < 2;
    byId("clear-exercise-button").disabled = !hasFilter || shown.length === 0;
    byId("clear-all-button").disabled = results.length === 0;
  }
  function addCell(row, value, className) { const cell = document.createElement("td"); cell.textContent = value; if (className) cell.className = className; row.append(cell); return cell; }
  function render() {
    const shown = visibleResults();
    body.replaceChildren();
    shown.forEach((item) => {
      const row = document.createElement("tr");
      const student = document.createElement("td"); student.className = "teacher-student-cell";
      const name = document.createElement("strong"); name.textContent = item.student_name;
      const meta = document.createElement("span"); meta.textContent = `${item.class_name} · ${item.student_id}`;
      student.append(name, meta); row.append(student);
      addCell(row, item.exercise_name);
      addCell(row, String(item.score), "teacher-score");
      addCell(row, `${item.correct} / ${item.total}`);
      const date = new Date(item.timestamp);
      addCell(row, Number.isNaN(date.getTime()) ? item.timestamp : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date));
      const action = document.createElement("td");
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "teacher-row-delete"; remove.textContent = "Hapus"; remove.setAttribute("aria-label", `Hapus nilai ${item.student_name} untuk ${item.exercise_name}`);
      remove.addEventListener("click", () => confirmAction({ title: "Hapus satu nilai?", description: `Nilai ${item.student_name} untuk ${item.exercise_name} (${item.score}) akan dihapus permanen.`, label: "Hapus nilai", run: () => call("teacher_delete", { row: item.row, signature: item.signature }) }));
      action.append(remove); row.append(action); body.append(row);
    });
    byId("empty-state").classList.toggle("is-hidden", shown.length > 0);
    updateSummary();
  }
  function updateFilterOptions() {
    const selected = currentExercise() || filter.dataset.initialExercise || "";
    const exercises = new Map(); results.forEach((item) => exercises.set(item.exercise_id, item.exercise_name));
    filter.replaceChildren(new Option("Semua latihan", ""));
    [...exercises.entries()].sort((a, b) => a[1].localeCompare(b[1], "id")).forEach(([id, name]) => filter.add(new Option(name, id)));
    if ([...exercises.keys()].includes(selected)) filter.value = selected;
    delete filter.dataset.initialExercise;
    const url = new URL(window.location.href);
    if (filter.value) url.searchParams.set("exercise", filter.value); else url.searchParams.delete("exercise");
    history.replaceState(null, "", url);
  }
  async function loadResults() {
    const id = ++requestId;
    message(byId("dashboard-message"), "Memuat daftar nilai…", "pending");
    byId("refresh-button").disabled = true;
    try { const data = await call("teacher_list"); if (id !== requestId) return false; results = data.results || []; updateFilterOptions(); render(); message(byId("dashboard-message"), "", ""); return true; }
    catch (error) { if (id !== requestId) return false; message(byId("dashboard-message"), error.message, "error"); if (error.message.includes("Sesi guru berakhir")) logout(false); return false; }
    finally { if (id === requestId) byId("refresh-button").disabled = false; }
  }
  filter.addEventListener("change", render);
  byId("refresh-button").addEventListener("click", loadResults);
  function confirmAction(options) {
    pendingAction = options;
    byId("dialog-title").textContent = options.title;
    byId("dialog-description").textContent = options.description;
    byId("dialog-confirm").textContent = options.label || "Hapus nilai";
    byId("dialog-message").textContent = "";
    byId("typed-confirmation").classList.toggle("is-hidden", !options.typed);
    byId("confirm-text").value = "";
    if (options.typed) { byId("typed-label").textContent = `Ketik ${options.typed} untuk melanjutkan.`; byId("dialog-confirm").disabled = true; }
    else byId("dialog-confirm").disabled = false;
    dialog.showModal();
    if (options.typed) byId("confirm-text").focus(); else byId("dialog-cancel").focus();
  }
  byId("confirm-text").addEventListener("input", () => { byId("dialog-confirm").disabled = byId("confirm-text").value !== "HAPUS"; });
  dialog.addEventListener("close", () => { pendingAction = null; byId("dialog-confirm").disabled = false; byId("dialog-confirm").textContent = "Hapus nilai"; });
  dialog.addEventListener("cancel", (event) => { if (actionInProgress) event.preventDefault(); });
  byId("dialog-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (event.submitter && event.submitter.value !== "confirm") { dialog.close(); pendingAction = null; return; }
    if (!pendingAction || (pendingAction.typed && byId("confirm-text").value !== "HAPUS")) return;
    const button = byId("dialog-confirm"); button.disabled = true; byId("dialog-cancel").disabled = true; actionInProgress = true; button.textContent = "Menghapus…";
    const action = pendingAction;
    try { const result = await action.run(); const done = action.done; actionInProgress = false; pendingAction = null; dialog.close(); const refreshed = await loadResults(); if (refreshed) message(byId("dashboard-message"), done ? done(result) : `${result.deleted} nilai dihapus.`, "success"); }
    catch (error) { actionInProgress = false; message(byId("dialog-message"), error.message, "error"); button.disabled = false; byId("dialog-cancel").disabled = false; button.textContent = action.label || "Hapus nilai"; }
  });
  byId("dedupe-button").addEventListener("click", () => {
    const name = filter.options[filter.selectedIndex].text;
    confirmAction({ title: "Rapikan nilai ganda?", description: `Untuk ${name}, setiap siswa akan menyisakan satu nilai tertinggi. Nilai lainnya akan dihapus permanen.`, label: "Pertahankan nilai tertinggi", run: () => call("teacher_dedupe", { exercise_id: currentExercise() }), done: (result) => `${result.deleted} nilai lebih rendah dihapus.` });
  });
  byId("clear-exercise-button").addEventListener("click", () => {
    const name = filter.options[filter.selectedIndex].text;
    confirmAction({ title: `Hapus semua nilai ${name}?`, description: `Seluruh ${visibleResults().length} hasil pada latihan ini akan dihapus permanen.`, label: "Hapus nilai latihan", typed: "HAPUS", run: () => call("teacher_clear_exercise", { exercise_id: currentExercise() }) });
  });
  byId("clear-all-button").addEventListener("click", () => {
    confirmAction({ title: "Hapus seluruh data nilai?", description: `Tindakan ini menghapus semua ${results.length} hasil dari setiap latihan secara permanen. Untuk melanjutkan, ketik HAPUS.`, label: "Hapus semua nilai", typed: "HAPUS", run: () => call("teacher_clear_all"), done: (result) => `Seluruh nilai terhapus (${result.deleted} hasil).` });
  });
  async function logout(sendRequest) {
    const oldToken = token; token = ""; requestId++; results = [];
    if (sendRequest && oldToken) { try { await call("teacher_logout", {}); } catch (error) { /* sesi server kedaluwarsa otomatis */ } }
    dashboard.classList.add("is-hidden"); loginPanel.classList.remove("is-hidden"); loginForm.reset(); byId("teacher-password").focus();
  }
  byId("logout-button").addEventListener("click", () => logout(true));
  filter.addEventListener("change", () => {
    const url = new URL(window.location.href);
    if (filter.value) url.searchParams.set("exercise", filter.value); else url.searchParams.delete("exercise");
    history.replaceState(null, "", url);
  });
  const initialExercise = new URLSearchParams(window.location.search).get("exercise");
  if (initialExercise) { filter.dataset.initialExercise = initialExercise; }
  byId("logout-button").disabled = false;
  byId("refresh-button").disabled = false;
  byId("clear-all-button").disabled = false;
})();
