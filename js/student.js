(function () {
  "use strict";

  const studentForm = document.getElementById("student-form");
  const studentIdInput = document.getElementById("student-id-input");
  const nameInput = document.getElementById("student-name-input");
  const classNameInput = document.getElementById("class-name-input");
  const formMessage = document.getElementById("student-form-message");
  const clearStudentButton = document.getElementById("clear-student-button");
  const searchStudentButton = document.getElementById("search-student-button");
  const lookupStatus = document.getElementById("lookup-status");
  const studentIdPattern = /^[A-Za-z0-9_-]+$/;
  const requestedDestination = new URLSearchParams(window.location.search).get("next");
  let matchedStudentId = "";
  let isSearching = false;
  let searchRequestNumber = 0;

  function getSafeDestination() {
    if (!requestedDestination || requestedDestination.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(requestedDestination)) {
      return "index.html";
    }
    return requestedDestination;
  }

  function showMessage(message, field) {
    formMessage.textContent = message;
    formMessage.dataset.state = "error";
    [studentIdInput, nameInput, classNameInput].forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  function fillStudentForm(student) {
    studentIdInput.value = student.student_id;
    nameInput.value = student.name;
    classNameInput.value = student.class_name;
    clearStudentButton.classList.remove("is-hidden");
  }

  function clearFoundStudent() {
    nameInput.value = "";
    classNameInput.value = "";
    matchedStudentId = "";
  }

  function setLookupStatus(message, state) {
    lookupStatus.textContent = message;
    lookupStatus.dataset.state = state;
  }

  async function searchStudent() {
    const studentId = studentIdInput.value.trim();
    if (!studentId || !studentIdPattern.test(studentId)) {
      showMessage("Masukkan ID siswa yang valid terlebih dahulu.", studentIdInput);
      return;
    }
    if (isSearching) return;

    const currentRequest = searchRequestNumber + 1;
    searchRequestNumber = currentRequest;
    isSearching = true;
    searchStudentButton.disabled = true;
    searchStudentButton.textContent = "Mencari...";
    setLookupStatus("Mencari data siswa...", "pending");
    formMessage.textContent = "";

    try {
      const student = await window.MathPractice.findStudentById(studentId);
      if (currentRequest !== searchRequestNumber) return;

      if (!student) {
        clearFoundStudent();
        setLookupStatus("ID siswa tidak ditemukan. Periksa kembali ID yang dimasukkan.", "error");
        return;
      }

      studentIdInput.value = student.student_id;
      nameInput.value = student.name;
      classNameInput.value = student.class_name;
      matchedStudentId = student.student_id;
      setLookupStatus("Data siswa ditemukan. Nama dan kelas sudah terisi.", "success");
    } catch (error) {
      if (currentRequest !== searchRequestNumber) return;
      clearFoundStudent();
      setLookupStatus(`Data siswa belum dapat dicari. ${error.message}`, "error");
    } finally {
      if (currentRequest === searchRequestNumber) {
        isSearching = false;
        searchStudentButton.disabled = false;
        searchStudentButton.textContent = "Cari";
      }
    }
  }

  const savedStudent = window.MathPractice.getStudent();
  if (savedStudent) {
    fillStudentForm(savedStudent);
    matchedStudentId = savedStudent.student_id;
    setLookupStatus("Identitas tersimpan siap digunakan. Cari ID lagi jika ingin memperbarui data dari sheet.", "success");
  }

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const studentId = studentIdInput.value.trim();
    const name = nameInput.value.trim();
    const className = classNameInput.value.trim();

    if (!studentId || !name || !className || matchedStudentId !== studentId) {
      showMessage("Cari ID siswa terlebih dahulu, lalu lanjutkan setelah nama dan kelas terisi.", studentIdInput);
      return;
    }
    if (!studentIdPattern.test(studentId)) {
      showMessage("ID siswa hanya boleh berisi huruf, angka, tanda hubung, atau garis bawah.", studentIdInput);
      return;
    }

    try {
      window.MathPractice.saveStudent({ student_id: studentId, name: name, class_name: className });
      window.location.assign(getSafeDestination());
    } catch (error) {
      showMessage(error.message);
    }
  });

  window.MathPractice.clearSavedStudent = function clearSavedStudent() {
    window.MathPractice.clearStudent();
    studentForm.reset();
    clearFoundStudent();
    setLookupStatus("", "idle");
    formMessage.textContent = "Identitas tersimpan telah dihapus dari perangkat ini.";
    formMessage.dataset.state = "success";
    clearStudentButton.classList.add("is-hidden");
    studentIdInput.focus();
  };

  studentIdInput.addEventListener("input", function () {
    searchRequestNumber += 1;
    isSearching = false;
    searchStudentButton.disabled = false;
    searchStudentButton.textContent = "Cari";
    clearFoundStudent();
    setLookupStatus("", "idle");
  });

  window.MathPractice.searchStudentById = searchStudent;
})();
