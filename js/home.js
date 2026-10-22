(function () {
  "use strict";

  const section = document.getElementById("personal-records");
  if (!section) return;

  const list = document.getElementById("personal-records-list");
  const status = document.getElementById("personal-records-status");
  const studentLabel = document.getElementById("personal-records-student");
  const refreshButton = document.getElementById("personal-records-refresh");
  const loginLink = document.getElementById("personal-records-login");
  const openButton = document.getElementById("open-personal-records");
  const closeButton = document.getElementById("personal-records-close");
  let requestNumber = 0;
  const exerciseGroups = [
    { label: "Kecepatan Berhitung", ids: ["perkalian_cepat_01", "pembagian_cepat_01", "pembagian_lanjutan_01", "bilangan_negatif_01"] },
    { label: "Pecahan", ids: ["menyamakan_pecahan_01", "penjumlahan_pecahan_01", "perkalian_pecahan_01"] },
    { label: "Aljabar", ids: ["aljabar_dasar_level_1_01", "aljabar_dasar_01", "soal_cerita_aljabar_level_1_01", "soal_cerita_aljabar_level_2_01", "pertidaksamaan_linear_01"] },
    { label: "Barisan dan Deret", ids: ["barisan_dasar_01", "barisan_aritmetika_un_01", "barisan_aritmetika_lanjutan_01"] },
    { label: "Eksponen", ids: ["eksponen_dasar_01", "eksponen_01", "eksponen_aljabar_01"] }
  ];

  function setStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
  }

  function createRecordItem(record) {
    const item = document.createElement("li");
    item.className = "personal-record-row";

    const name = document.createElement("span");
    name.className = "personal-record-name";
    name.textContent = record.exercise_name || record.exercise_id;

    const result = document.createElement("span");
    result.className = "personal-record-value";
    result.append(document.createTextNode(String(record.score)));
    const date = formatDate(record.timestamp);
    if (date) {
      const dateLabel = document.createElement("span");
      dateLabel.className = "personal-record-date";
      dateLabel.textContent = date;
      result.append(dateLabel);
    }

    item.append(name, result);
    return item;
  }

  function renderRecords(records) {
    const recordsById = new Map(records.map(function (record) { return [record.exercise_id, record]; }));
    const placed = new Set();
    const renderedGroups = document.createDocumentFragment();

    exerciseGroups.forEach(function (group) {
      const groupRecords = group.ids.map(function (id) { return recordsById.get(id); }).filter(Boolean);
      if (!groupRecords.length) return;

      const groupSection = document.createElement("section");
      groupSection.className = "personal-record-group";
      groupSection.setAttribute("aria-label", group.label);
      const heading = document.createElement("div");
      heading.className = "personal-record-category-heading";
      const title = document.createElement("h3");
      title.textContent = group.label;
      heading.append(title);

      const groupList = document.createElement("ul");
      groupList.className = "personal-records-list";
      groupList.setAttribute("aria-label", `Rekor ${group.label}`);
      groupRecords.forEach(function (record) {
        placed.add(record.exercise_id);
        groupList.append(createRecordItem(record));
      });
      groupSection.append(heading, groupList);
      renderedGroups.append(groupSection);
    });

    const ungrouped = records.filter(function (record) { return !placed.has(record.exercise_id); })
      .sort(function (a, b) { return (a.exercise_name || a.exercise_id).localeCompare(b.exercise_name || b.exercise_id, "id"); });
    if (ungrouped.length) {
      const groupSection = document.createElement("section");
      groupSection.className = "personal-record-group";
      groupSection.setAttribute("aria-label", "Latihan lainnya");
      const heading = document.createElement("div");
      heading.className = "personal-record-category-heading";
      const title = document.createElement("h3");
      title.textContent = "Latihan lainnya";
      heading.append(title);
      const groupList = document.createElement("ul");
      groupList.className = "personal-records-list";
      ungrouped.forEach(function (record) { groupList.append(createRecordItem(record)); });
      groupSection.append(heading, groupList);
      renderedGroups.append(groupSection);
    }

    list.replaceChildren(renderedGroups);
  }

  async function loadRecords() {
    const student = window.MathPractice.getStudent();
    if (!student) {
      requestNumber += 1;
      studentLabel.textContent = "";
      list.replaceChildren();
      loginLink.classList.remove("is-hidden");
      refreshButton.disabled = true;
      setStatus("Simpan identitas siswa terlebih dahulu untuk melihat rekor pribadi.", "empty");
      return;
    }

    loginLink.classList.add("is-hidden");
    studentLabel.textContent = `${student.name} · ${student.student_id}`;
    const thisRequest = ++requestNumber;
    refreshButton.disabled = true;
    setStatus("Memuat rekor latihan…", "pending");

    try {
      const records = await window.MathPractice.getStudentBestRecords();
      if (thisRequest !== requestNumber) return;
      renderRecords(records);
      if (records.length) {
        setStatus(`${records.length} latihan dengan rekor tersimpan.`, "success");
      } else {
        setStatus("Belum ada rekor. Selesaikan latihan untuk mulai mencatat nilai tertinggimu.", "empty");
      }
    } catch (error) {
      if (thisRequest !== requestNumber) return;
      const hasPreviousRecords = list.childElementCount > 0;
      const message = hasPreviousRecords
        ? `Pembaruan gagal. Rekor terakhir yang dimuat masih ditampilkan. ${error.message}`
        : `Rekor belum dapat dimuat. ${error.message}`;
      setStatus(message, "error");
    } finally {
      if (thisRequest === requestNumber) refreshButton.disabled = false;
    }
  }

  openButton.addEventListener("click", function () {
    if (!section.open) section.showModal();
    loadRecords();
  });
  refreshButton.addEventListener("click", loadRecords);
  closeButton.addEventListener("click", function () { section.close(); });
  section.addEventListener("close", function () {
    requestNumber += 1;
    openButton.focus();
  });
  section.addEventListener("click", function (event) {
    if (event.target === section) section.close();
  });
  window.addEventListener("storage", function (event) {
    if (event.key === "mathPracticeStudent" && section.open) loadRecords();
  });
})();
