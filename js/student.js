(function () {
  "use strict";

  const studentForm = document.getElementById("student-form");
  const studentIdInput = document.getElementById("student-id-input");
  const nameInput = document.getElementById("student-name-input");
  const classNameInput = document.getElementById("class-name-input");
  const formMessage = document.getElementById("student-form-message");
  const clearStudentButton = document.getElementById("clear-student-button");
  const studentIdPattern = /^[A-Za-z0-9_-]+$/;
  const requestedDestination = new URLSearchParams(window.location.search).get("next");

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

  const savedStudent = window.MathPractice.getStudent();
  if (savedStudent) {
    if (requestedDestination) {
      window.location.replace(getSafeDestination());
      return;
    }
    fillStudentForm(savedStudent);
  }

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const studentId = studentIdInput.value.trim();
    const name = nameInput.value.trim();
    const className = classNameInput.value.trim();

    if (!studentId || !name || !className) {
      showMessage("Isi ID siswa, nama, dan kelas terlebih dahulu.", !studentId ? studentIdInput : (!name ? nameInput : classNameInput));
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
    formMessage.textContent = "Identitas tersimpan telah dihapus dari perangkat ini.";
    formMessage.dataset.state = "success";
    clearStudentButton.classList.add("is-hidden");
    studentIdInput.focus();
  };
})();
