(function () {
  "use strict";
  const api = window.MathPractice;
  const byId = (id) => document.getElementById(id);
  const loginPanel = byId("login-panel");
  const dashboard = byId("dashboard");
  const loginForm = byId("login-form");
  const filter = byId("exercise-filter");
  const classFilter = byId("class-filter");
  const periodFilter = byId("period-filter");
  const bestOnlyFilter = byId("best-only-filter");
  const body = byId("results-body");
  const dialog = byId("action-dialog");
  let token = "";
  let results = [];
  let pendingAction = null;
  let requestId = 0;
  let actionInProgress = false;
  const exerciseGroups = [
    { label: "Kecepatan Berhitung", ids: ["perkalian_cepat_01", "pembagian_cepat_01", "pembagian_lanjutan_01", "bilangan_negatif_01"] },
    { label: "Pecahan", ids: ["menyamakan_pecahan_01", "penjumlahan_pecahan_01", "perkalian_pecahan_01"] },
    { label: "Aljabar", ids: ["aljabar_dasar_level_1_01", "aljabar_dasar_01", "soal_cerita_aljabar_level_1_01", "soal_cerita_aljabar_level_2_01", "pertidaksamaan_linear_01"] },
    { label: "Barisan dan Deret", ids: ["barisan_dasar_01", "barisan_aritmetika_un_01"] },
    { label: "Eksponen", ids: ["eksponen_dasar_01", "eksponen_01", "eksponen_aljabar_01"] }
  ];

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
  function exerciseResults() { return results.filter((item) => item.exercise_id === currentExercise()); }
  function filteredResults() {
    const periodHours = { "24h": 24, "7d": 24 * 7, "30d": 24 * 30 }[periodFilter.value];
    const now = Date.now();
    const cutoff = periodHours ? now - periodHours * 60 * 60 * 1000 : null;
    let items = results.filter((item) => {
      if (currentExercise() && item.exercise_id !== currentExercise()) return false;
      if (classFilter.value && item.class_name !== classFilter.value) return false;
      if (cutoff !== null) {
        const timestamp = new Date(item.timestamp).getTime();
        if (!Number.isFinite(timestamp) || timestamp < cutoff || timestamp > now) return false;
      }
      return true;
    });
    if (bestOnlyFilter.checked) {
      const best = new Map();
      items.forEach((item) => {
        const key = `${item.exercise_id}\u0000${item.student_id}`;
        const previous = best.get(key);
        if (!previous || item.score > previous.score || (item.score === previous.score && new Date(item.timestamp) > new Date(previous.timestamp))) best.set(key, item);
      });
      items = [...best.values()];
    }
    return items.sort((a, b) => b.score - a.score || new Date(b.timestamp) - new Date(a.timestamp));
  }
  function visibleResults() { return filteredResults(); }
  function updateSummary() {
    const shown = visibleResults();
    byId("result-count").textContent = String(shown.length);
    byId("exercise-count").textContent = String(new Set(shown.map((item) => item.exercise_id)).size);
    byId("average-score").textContent = shown.length ? (shown.reduce((sum, item) => sum + item.score, 0) / shown.length).toLocaleString("id-ID", { maximumFractionDigits: 1 }) : "—";
    byId("table-count").textContent = shown.length ? `Menampilkan ${shown.length} hasil` : "";
    const hasFilter = Boolean(currentExercise());
    byId("dedupe-button").disabled = !hasFilter || exerciseResults().length < 2;
    byId("clear-exercise-button").disabled = !hasFilter || exerciseResults().length === 0;
    byId("clear-all-button").disabled = results.length === 0;
  }
  function addCell(row, value, className) { const cell = document.createElement("td"); cell.textContent = value; if (className) cell.className = className; row.append(cell); return cell; }
  function render() {
    const shown = visibleResults();
    byId("scores-title").textContent = bestOnlyFilter.checked ? "Nilai terbaik tiap siswa" : "Nilai tertinggi lebih dulu";
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
    const selectedExercise = currentExercise() || filter.dataset.initialExercise || "";
    const selectedClass = classFilter.value || classFilter.dataset.initialClass || "";
    const bestOnly = bestOnlyFilter.checked || bestOnlyFilter.dataset.initialBest === "true";
    const exercises = new Map(); results.forEach((item) => exercises.set(item.exercise_id, item.exercise_name));
    const allOption = new Option("Semua latihan", "");
    filter.replaceChildren(allOption);
    const placed = new Set();
    exerciseGroups.forEach((group) => {
      const options = group.ids.filter((id) => exercises.has(id));
      if (!options.length) return;
      const optgroup = document.createElement("optgroup"); optgroup.label = group.label;
      options.forEach((id) => { optgroup.append(new Option(exercises.get(id), id)); placed.add(id); });
      filter.append(optgroup);
    });
    const ungrouped = [...exercises.entries()].filter(([id]) => !placed.has(id)).sort((a, b) => a[1].localeCompare(b[1], "id"));
    if (ungrouped.length) {
      const optgroup = document.createElement("optgroup"); optgroup.label = "Latihan lainnya";
      ungrouped.forEach(([id, name]) => optgroup.append(new Option(name, id)));
      filter.append(optgroup);
    }
    if ([...exercises.keys()].includes(selectedExercise)) filter.value = selectedExercise;
    const classes = [...new Set(results.map((item) => item.class_name).filter(Boolean))].sort((a, b) => a.localeCompare(b, "id"));
    classFilter.replaceChildren(new Option("Semua kelas", ""));
    classes.forEach((className) => classFilter.add(new Option(className, className)));
    if (classes.includes(selectedClass)) classFilter.value = selectedClass;
    bestOnlyFilter.checked = bestOnly;
    delete filter.dataset.initialExercise;
    delete classFilter.dataset.initialClass;
    delete bestOnlyFilter.dataset.initialBest;
    const url = new URL(window.location.href);
    if (filter.value) url.searchParams.set("exercise", filter.value); else url.searchParams.delete("exercise");
    if (classFilter.value) url.searchParams.set("class", classFilter.value); else url.searchParams.delete("class");
    if (periodFilter.value !== "all") url.searchParams.set("period", periodFilter.value); else url.searchParams.delete("period");
    if (bestOnlyFilter.checked) url.searchParams.set("best", "1"); else url.searchParams.delete("best");
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
  classFilter.addEventListener("change", render);
  periodFilter.addEventListener("change", render);
  bestOnlyFilter.addEventListener("change", render);
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
    confirmAction({ title: "Rapikan nilai ganda?", description: `Untuk ${name} di semua kelas, setiap siswa akan menyisakan satu nilai tertinggi. Nilai lainnya akan dihapus permanen.`, label: "Pertahankan nilai tertinggi", run: () => call("teacher_dedupe", { exercise_id: currentExercise() }), done: (result) => `${result.deleted} nilai lebih rendah dihapus.` });
  });
  byId("clear-exercise-button").addEventListener("click", () => {
    const name = filter.options[filter.selectedIndex].text;
    confirmAction({ title: `Hapus semua nilai ${name}?`, description: `Seluruh ${exerciseResults().length} hasil pada latihan ini di semua kelas akan dihapus permanen.`, label: "Hapus nilai latihan", typed: "HAPUS", run: () => call("teacher_clear_exercise", { exercise_id: currentExercise() }) });
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
  function updateFilterUrl() {
    const url = new URL(window.location.href);
    if (filter.value) url.searchParams.set("exercise", filter.value); else url.searchParams.delete("exercise");
    if (classFilter.value) url.searchParams.set("class", classFilter.value); else url.searchParams.delete("class");
    if (periodFilter.value !== "all") url.searchParams.set("period", periodFilter.value); else url.searchParams.delete("period");
    if (bestOnlyFilter.checked) url.searchParams.set("best", "1"); else url.searchParams.delete("best");
    history.replaceState(null, "", url);
  }
  filter.addEventListener("change", updateFilterUrl);
  classFilter.addEventListener("change", updateFilterUrl);
  bestOnlyFilter.addEventListener("change", updateFilterUrl);
  const initialExercise = new URLSearchParams(window.location.search).get("exercise");
  if (initialExercise) { filter.dataset.initialExercise = initialExercise; }
  const initialClass = new URLSearchParams(window.location.search).get("class");
  if (initialClass) { classFilter.dataset.initialClass = initialClass; }
  const initialPeriod = new URLSearchParams(window.location.search).get("period");
  if (["24h", "7d", "30d"].includes(initialPeriod)) periodFilter.value = initialPeriod;
  if (new URLSearchParams(window.location.search).get("best") === "1") bestOnlyFilter.dataset.initialBest = "true";
  byId("logout-button").disabled = false;
  byId("refresh-button").disabled = false;
  byId("clear-all-button").disabled = false;
})();
