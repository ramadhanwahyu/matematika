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

  function renderRecords(records) {
    list.replaceChildren();
    records.forEach(function (record) {
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
      list.append(item);
    });
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
