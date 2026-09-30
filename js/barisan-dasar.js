(function () {
  "use strict";

  const exercise = { id: "barisan_dasar_01", name: "Barisan Dasar", totalQuestions: 10 };
  const questionBank = [
    { terms: [-18, -11, -4, 3], answers: [10, 17], rule: "Tambah 7" },
    { terms: [45, 38, 31, 24], answers: [17, 10], rule: "Kurang 7" },
    { terms: [-30, -24, -18, -12], answers: [-6, 0], rule: "Tambah 6" },
    { terms: [8, 1, -6, -13], answers: [-20, -27], rule: "Kurang 7" },
    { terms: [120, 108, 96, 84], answers: [72, 60], rule: "Kurang 12" },
    { terms: [-5, 7, 19, 31], answers: [43, 55], rule: "Tambah 12" },
    { terms: [14, 5, -4, -13], answers: [-22, -31], rule: "Kurang 9" },
    { terms: [60, 48, 36, 24, 12], answers: [0, -12], rule: "Kurang 12" },
    { terms: [-42, -35, -28, -21], answers: [-14, -7], rule: "Tambah 7" },
    { terms: [6, -2, -10, -18], answers: [-26, -34], rule: "Kurang 8" },
    { terms: [2, 4, 8, 16], answers: [32, 64], rule: "Dikali 2" },
    { terms: [3, 6, 12, 24], answers: [48, 96], rule: "Dikali 2" },
    { terms: [5, 10, 20, 40], answers: [80, 160], rule: "Dikali 2" },
    { terms: [1, 3, 9, 27], answers: [81, 243], rule: "Dikali 3" },
    { terms: [64, 32, 16, 8], answers: [4, 2], rule: "Dibagi 2" },
    { terms: [243, 81, 27, 9], answers: [3, 1], rule: "Dibagi 3" },
    { terms: [160, 80, 40, 20], answers: [10, 5], rule: "Dibagi 2" },
    { terms: [1, 3, 6, 10, 15], answers: [21, 28], rule: "Tambah 2, 3, 4, 5, lalu 6" },
    { terms: [2, 5, 9, 14, 20], answers: [27, 35], rule: "Tambah 3, 4, 5, 6, lalu 7" },
    { terms: [30, 27, 23, 18, 12], answers: [5, -3], rule: "Kurang 3, 4, 5, 6, lalu 7" },
    { terms: [4, 8, 14, 22, 32], answers: [44, 58], rule: "Tambah 4, 6, 8, 10, lalu 12" },
    { terms: [3, 7, 13, 21, 31], answers: [43, 57], rule: "Tambah 4, 6, 8, 10, lalu 12" },
    { terms: [1, 4, 9, 16], answers: [25, 36], rule: "Bilangan kuadrat" },
    { terms: [4, 9, 16, 25], answers: [36, 49], rule: "Bilangan kuadrat" },
    { terms: [9, 16, 25, 36, 49], answers: [64, 81], rule: "Bilangan kuadrat" },
    { terms: [2, 5, 4, 7, 6], answers: [9, 8], rule: "Bergantian tambah 3 dan kurang 1" },
    { terms: [2, 10, 4, 20, 6], answers: [30, 8], rule: "Dua barisan berselang-seling" },
    { terms: [1, 10, 2, 20, 3], answers: [30, 4], rule: "Dua barisan berselang-seling" },
    { terms: [4, 7, 10, 13, 16], answers: [19, 22], rule: "Tambah 3" },
    { terms: [1, 1, 2, 3, 5], answers: [8, 13], rule: "Jumlah dua suku sebelumnya" }
  ];

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const answerForm = document.getElementById("answer-form");
  const firstInput = document.getElementById("first-answer-input");
  const secondInput = document.getElementById("second-answer-input");
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionExpression = document.getElementById("question-expression");
  const answerMessage = document.getElementById("answer-message");
  const resultReviewList = document.getElementById("result-review-list");
  const saveStatus = document.getElementById("save-status");
  const retrySaveButton = document.getElementById("retry-save-button");
  const studentSummary = document.getElementById("student-summary");

  let sessionQuestions = [];
  let answerHistory = [];
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let hasFinishedSession = false;
  let currentSubmission = null;

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/barisan-dasar.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    questionProgress.textContent = `Soal ${currentQuestionIndex + 1} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = "Cari polanya";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.textContent = `${question.terms.join(", ")}, …, …`;
    questionExpression.setAttribute("aria-label", `Barisan: ${question.terms.join(", ")}, dua angka berikutnya belum diisi`);
    answerForm.reset();
    answerMessage.textContent = "";
    firstInput.removeAttribute("aria-invalid");
    secondInput.removeAttribute("aria-invalid");
    firstInput.focus();
  }

  function readAnswers() {
    const firstText = firstInput.value.trim();
    const secondText = secondInput.value.trim();
    if (!firstText || !secondText) {
      showValidation("Isi kedua angka berikutnya terlebih dahulu.", !firstText ? firstInput : secondInput);
      return null;
    }
    if (!/^-?\d+$/.test(firstText) || !/^-?\d+$/.test(secondText)) {
      showValidation("Gunakan bilangan bulat, termasuk tanda minus jika diperlukan.", !/^-?\d+$/.test(firstText) ? firstInput : secondInput);
      return null;
    }
    const first = Number(firstText);
    const second = Number(secondText);
    if (!Number.isSafeInteger(first) || !Number.isSafeInteger(second) || Math.abs(first) > 100000 || Math.abs(second) > 100000) {
      showValidation("Masukkan bilangan bulat sampai 100.000.", Math.abs(first) > 100000 ? firstInput : secondInput);
      return null;
    }
    return [first, second];
  }

  function showValidation(message, field) {
    answerMessage.textContent = message;
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }

  function setSaveStatus(message, state, canRetry) {
    saveStatus.textContent = message;
    saveStatus.dataset.state = state;
    retrySaveButton.classList.toggle("is-hidden", !canRetry);
    retrySaveButton.disabled = !canRetry;
  }

  function updateSubmissionStatus(submission, message, state, canRetry) {
    if (currentSubmission === submission) setSaveStatus(message, state, canRetry);
  }

  async function saveCurrentResult() {
    const submission = currentSubmission;
    if (!submission || submission.isSaving || submission.isSaved) return;
    submission.isSaving = true;
    updateSubmissionStatus(submission, "Menyimpan nilai...", "pending", false);
    try {
      await window.MathPractice.submitExerciseResult(submission.result);
      submission.isSaved = true;
      updateSubmissionStatus(submission, "Nilai berhasil disimpan.", "success", false);
    } catch (error) {
      updateSubmissionStatus(submission, `Nilai belum berhasil disimpan. ${error.message} Silakan coba lagi setelah diperbaiki.`, "error", true);
    } finally {
      submission.isSaving = false;
    }
  }

  function createReviewItem(item, index) {
    const reviewItem = document.createElement("article");
    const topLine = document.createElement("div");
    const number = document.createElement("p");
    const status = document.createElement("p");
    const expression = document.createElement("p");
    reviewItem.className = "result-review-item";
    reviewItem.dataset.state = item.isCorrect ? "correct" : "incorrect";
    topLine.className = "result-review-item-topline";
    number.className = "result-review-number";
    number.textContent = `Soal ${index + 1}`;
    status.className = "result-review-status";
    status.textContent = item.isCorrect ? "Benar" : "Perlu ditinjau";
    expression.className = "result-review-expression sequence-review-expression";
    expression.textContent = `${item.question.terms.join(", ")}, ${item.answer[0]}, ${item.answer[1]}`;
    topLine.append(number, status);
    reviewItem.append(topLine, expression);
    if (!item.isCorrect) {
      const correctAnswer = document.createElement("p");
      correctAnswer.className = "result-review-correction";
      correctAnswer.textContent = `Jawaban benar: ${item.question.answers[0]}, ${item.question.answers[1]}`;
      reviewItem.append(correctAnswer);
    }
    return reviewItem;
  }

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    const result = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      correct: correctAnswers,
      incorrect: exercise.totalQuestions - correctAnswers,
      total: exercise.totalQuestions,
      score: Math.min(100, correctAnswers * 10)
    };
    currentSubmission = { result: result, isSaving: false, isSaved: false };
    document.getElementById("final-score").textContent = result.score;
    document.getElementById("correct-count").textContent = result.correct;
    document.getElementById("incorrect-count").textContent = result.incorrect;
    document.getElementById("total-count").textContent = result.total;
    document.getElementById("result-summary").textContent = `Kamu menjawab ${result.correct} dari ${result.total} soal dengan benar.`;
    progressBar.style.width = "100%";
    resultReviewList.replaceChildren(...answerHistory.map(createReviewItem));
    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function startExercise() {
    sessionQuestions = window.MathPractice.shuffle(questionBank).slice(0, exercise.totalQuestions);
    answerHistory = [];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    hasFinishedSession = false;
    currentSubmission = null;
    setSaveStatus("", "idle", false);
    window.MathPractice.showOnly(quizScreen, screens);
    renderQuestion();
  }

  answerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (hasFinishedSession) return;
    answerMessage.textContent = "";
    firstInput.removeAttribute("aria-invalid");
    secondInput.removeAttribute("aria-invalid");
    const answer = readAnswers();
    if (!answer) return;
    const question = sessionQuestions[currentQuestionIndex];
    const isCorrect = answer[0] === question.answers[0] && answer[1] === question.answers[1];
    answerHistory.push({ question: question, answer: answer, isCorrect: isCorrect });
    if (isCorrect) correctAnswers += 1;
    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) {
      finishExercise();
      return;
    }
    renderQuestion();
  });

  window.MathPractice.startBasicSequenceExercise = startExercise;
  window.MathPractice.retryBasicSequenceResult = saveCurrentResult;
})();
