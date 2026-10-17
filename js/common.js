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

  window.MathPractice.getStudentBestRecords = async function getStudentBestRecords() {
    const student = window.MathPractice.getStudent();
    const endpoint = window.MathPractice.config.appsScriptWebAppUrl.trim();
    if (!student) throw new Error("Identitas siswa tidak ditemukan. Simpan identitas untuk melihat rekor.");
    if (!endpoint) throw new Error("URL Google Apps Script belum diisi. Tambahkan URL /exec pada js/common.js.");

    const lookupUrl = new URL(endpoint);
    lookupUrl.searchParams.set("action", "student_records");
    lookupUrl.searchParams.set("student_id", student.student_id);
    const response = await fetch(lookupUrl.toString(), { method: "GET", redirect: "follow", credentials: "omit" });
    if (!response.ok) throw new Error("Server tidak dapat memuat rekor saat ini.");

    const responseData = await response.json();
    if (!responseData || responseData.success !== true || !Array.isArray(responseData.records)) {
      throw new Error(responseData && responseData.message ? responseData.message : "Server menolak permintaan rekor.");
    }
    return responseData.records;
  };

  window.MathPractice.getSpeedLeaderboard = async function getSpeedLeaderboard(exerciseId) {
    const student = window.MathPractice.getStudent();
    const endpoint = window.MathPractice.config.appsScriptWebAppUrl.trim();
    if (!student) throw new Error("Identitas siswa tidak ditemukan. Simpan identitas sebelum melihat papan skor.");
    if (!endpoint) throw new Error("URL Google Apps Script belum diisi. Tambahkan URL /exec pada js/common.js.");

    const lookupUrl = new URL(endpoint);
    lookupUrl.searchParams.set("action", "speed_leaderboard");
    lookupUrl.searchParams.set("student_id", student.student_id);
    lookupUrl.searchParams.set("exercise_id", exerciseId);
    const response = await fetch(lookupUrl.toString(), { method: "GET", redirect: "follow", credentials: "omit" });
    if (!response.ok) throw new Error("Server tidak dapat memuat papan skor saat ini.");

    const responseData = await response.json();
    if (!responseData || responseData.success !== true || !Array.isArray(responseData.results)) {
      throw new Error(responseData && responseData.message ? responseData.message : "Server menolak permintaan papan skor.");
    }
    return responseData.results;
  };

  window.MathPractice.loadSpeedLeaderboard = async function loadSpeedLeaderboard(exerciseId) {
    const panel = document.getElementById("speed-leaderboard");
    if (!panel) return;
    const list = document.getElementById("speed-leaderboard-list");
    const status = document.getElementById("speed-leaderboard-status");
    const refreshButton = document.getElementById("speed-leaderboard-refresh");
    const requestedExerciseId = exerciseId || panel.dataset.exerciseId;
    const requestNumber = Number(panel.dataset.requestNumber || 0) + 1;
    panel.dataset.requestNumber = String(requestNumber);
    refreshButton.disabled = true;
    status.textContent = "Memuat 10 skor tertinggi di kelasmu…";
    status.dataset.state = "pending";

    try {
      const results = await window.MathPractice.getSpeedLeaderboard(requestedExerciseId);
      if (panel.dataset.requestNumber !== String(requestNumber)) return;
      list.replaceChildren(...results.map(function (result) {
        const item = document.createElement("li");
        item.className = "speed-leaderboard-row";
        const rank = document.createElement("span");
        rank.className = "speed-leaderboard-rank";
        rank.textContent = String(result.rank);
        const name = document.createElement("span");
        name.className = "speed-leaderboard-name";
        name.textContent = result.student_name;
        const score = document.createElement("span");
        score.className = "speed-leaderboard-score";
        score.append(document.createTextNode(`${result.score} poin`));
        if (result.timestamp) {
          const achievedAt = new Date(result.timestamp);
          if (!Number.isNaN(achievedAt.getTime())) {
            const time = document.createElement("time");
            time.className = "speed-leaderboard-time";
            time.dateTime = achievedAt.toISOString();
            time.textContent = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(achievedAt);
            score.append(time);
          }
        }
        item.append(rank, name, score);
        return item;
      }));
      status.textContent = results.length ? `${results.length} peserta dengan skor tertinggi di kelasmu.` : "Belum ada nilai tersimpan untuk latihan ini di kelasmu.";
      status.dataset.state = results.length ? "success" : "empty";
    } catch (error) {
      if (panel.dataset.requestNumber !== String(requestNumber)) return;
      const hasPreviousResults = list.childElementCount > 0;
      status.textContent = hasPreviousResults
        ? `Pembaruan papan skor gagal. Daftar terakhir tetap ditampilkan. ${error.message}`
        : `Papan skor belum dapat dimuat. ${error.message}`;
      status.dataset.state = "error";
    } finally {
      if (panel.dataset.requestNumber === String(requestNumber)) refreshButton.disabled = false;
    }
  };

  document.querySelectorAll("#speed-leaderboard").forEach(function (panel) {
    const refreshButton = document.getElementById("speed-leaderboard-refresh");
    if (refreshButton) refreshButton.addEventListener("click", function () {
      window.MathPractice.loadSpeedLeaderboard(panel.dataset.exerciseId);
    });
  });

  document.querySelectorAll(".result-accordion").forEach(function (accordion) {
    const summary = accordion.querySelector("summary");
    const content = accordion.querySelector(".result-accordion-content");
    if (!summary || !content || typeof content.animate !== "function") return;

    let animation = null;
    let isClosing = false;
    let interactionNumber = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resetContent() {
      content.style.height = "";
      content.style.overflow = "";
      content.style.opacity = "";
    }

    function animateContent(open) {
      const currentHeight = content.getBoundingClientRect().height;
      const fullHeight = content.scrollHeight;
      if (animation) animation.cancel();
      content.style.overflow = "hidden";

      if (reduceMotion.matches) {
        if (!open) accordion.open = false;
        resetContent();
        isClosing = false;
        animation = null;
        return;
      }

      content.style.height = `${currentHeight}px`;
      content.style.opacity = open ? "0" : "1";
      animation = content.animate(
        [
          { height: `${currentHeight}px`, opacity: open ? 0 : 1 },
          { height: `${open ? fullHeight : 0}px`, opacity: open ? 1 : 0 }
        ],
        { duration: 240, easing: "cubic-bezier(.2,.75,.25,1)" }
      );
      isClosing = !open;
      animation.onfinish = function () {
        if (!open) accordion.open = false;
        resetContent();
        isClosing = false;
        animation = null;
      };
    }

    summary.addEventListener("click", function (event) {
      const currentInteraction = ++interactionNumber;
      if (!accordion.open) {
        if (reduceMotion.matches) return;
        content.style.height = "0px";
        content.style.overflow = "hidden";
        content.style.opacity = "0";
        window.requestAnimationFrame(function () {
          if (currentInteraction === interactionNumber && accordion.open) animateContent(true);
        });
        return;
      }

      event.preventDefault();
      animateContent(isClosing);
    });
  });

  const savedStudent = window.MathPractice.getStudent();
  document.querySelectorAll("[data-student-link]").forEach(function (link) {
    if (savedStudent) link.textContent = "Ganti identitas";
  });
})();
