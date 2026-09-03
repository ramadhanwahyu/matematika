/* Fungsi kecil yang dapat dipakai ulang oleh halaman latihan berikutnya. */
(function () {
  "use strict";

  window.MathPractice = window.MathPractice || {};

  // Ganti dengan URL deployment Web App yang berakhir dengan /exec setelah Apps Script siap.
  window.MathPractice.config = {
    appsScriptWebAppUrl: "https://script.google.com/macros/s/AKfycbwEVFvjYYO7TOtI-beifE-N7UyMf3eopZsEwEGL7EzNs28EjomjKykq9L43eqcOLHW1/exec"
  };

  const studentStorageKey = "mathPracticeStudent";

  function normalizeStudent(student) {
    if (!student || typeof student !== "object") return null;

    const studentId = typeof student.student_id === "string" ? student.student_id.trim() : "";
    const name = typeof student.name === "string" ? student.name.trim() : "";
    const className = typeof student.class_name === "string" ? student.class_name.trim() : "";

    if (!studentId || !name || !className) return null;
    if (!/^[A-Za-z0-9_-]+$/.test(studentId) || studentId.length > 32 || name.length > 80 || className.length > 64) {
      return null;
    }
    return { student_id: studentId, name: name, class_name: className };
  }

  window.MathPractice.saveStudent = function saveStudent(student) {
    const normalizedStudent = normalizeStudent(student);
    if (!normalizedStudent) {
      throw new Error("Isi ID siswa, nama, dan kelas terlebih dahulu.");
    }

    try {
      localStorage.setItem(studentStorageKey, JSON.stringify(normalizedStudent));
    } catch (error) {
      throw new Error("Identitas tidak dapat disimpan di perangkat ini. Periksa pengaturan browser.");
    }
    return normalizedStudent;
  };

  window.MathPractice.getStudent = function getStudent() {
    try {
      const savedStudent = localStorage.getItem(studentStorageKey);
      return savedStudent ? normalizeStudent(JSON.parse(savedStudent)) : null;
    } catch (error) {
      return null;
    }
  };

  window.MathPractice.clearStudent = function clearStudent() {
    try {
      localStorage.removeItem(studentStorageKey);
    } catch (error) {
      // Browser dapat menolak akses localStorage pada mode atau pengaturan tertentu.
    }
  };

  window.MathPractice.shuffle = function shuffle(items) {
    const shuffledItems = [...items];
    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
    }
    return shuffledItems;
  };

  window.MathPractice.showOnly = function showOnly(activeElement, allElements) {
    allElements.forEach(function (element) {
      element.classList.toggle("is-hidden", element !== activeElement);
    });
  };

  window.MathPractice.submitExerciseResult = async function submitExerciseResult(result) {
    const student = window.MathPractice.getStudent();
    const endpoint = window.MathPractice.config.appsScriptWebAppUrl.trim();

    if (!student) {
      throw new Error("Identitas siswa tidak ditemukan. Isi kembali identitas sebelum menyimpan nilai.");
    }
    if (!endpoint) {
      throw new Error("URL Google Apps Script belum diisi. Tambahkan URL /exec pada js/common.js.");
    }

    const payload = {
      student_id: student.student_id,
      student_name: student.name,
      class_name: student.class_name,
      exercise_id: result.exercise_id,
      exercise_name: result.exercise_name,
      correct: result.correct,
      incorrect: result.incorrect,
      total: result.total,
      score: result.score
    };

    // Tidak menambahkan header kustom agar POST tetap menjadi CORS simple request.
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
      redirect: "follow",
      credentials: "omit"
    });

    if (!response.ok) {
      throw new Error("Server tidak dapat menyimpan nilai saat ini.");
    }

    const responseData = await response.json();
    if (!responseData || responseData.success !== true) {
      throw new Error(responseData && responseData.message ? responseData.message : "Server menolak data hasil latihan.");
    }

    return { payload: payload, response: responseData };
  };

  window.MathPractice.findStudentById = async function findStudentById(studentId) {
    const endpoint = window.MathPractice.config.appsScriptWebAppUrl.trim();
    const cleanStudentId = typeof studentId === "string" ? studentId.trim() : "";

    if (!cleanStudentId || !/^[A-Za-z0-9_-]+$/.test(cleanStudentId)) {
      throw new Error("Masukkan ID siswa yang valid terlebih dahulu.");
    }
    if (!endpoint) {
      throw new Error("URL Google Apps Script belum diisi. Tambahkan URL /exec pada js/common.js.");
    }

    const lookupUrl = new URL(endpoint);
    lookupUrl.searchParams.set("action", "find_student");
    lookupUrl.searchParams.set("student_id", cleanStudentId);

    const response = await fetch(lookupUrl.toString(), {
      method: "GET",
      redirect: "follow",
      credentials: "omit"
    });

    if (!response.ok) {
      throw new Error("Server tidak dapat mencari ID siswa saat ini.");
    }

    const responseData = await response.json();
    if (!responseData || responseData.success !== true) {
      throw new Error(responseData && responseData.message ? responseData.message : "Server menolak pencarian ID siswa.");
    }
    return responseData.student || null;
  };
})();
