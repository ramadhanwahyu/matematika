(function () {
  "use strict";

  const exercise = {
    id: "penjumlahan_pecahan_01",
    name: "Penjumlahan Pecahan",
    totalQuestions: 10
  };

  // Kumpulan soal disimpan terpisah dari alur kuis supaya mudah ditambah atau diganti.
  const questionBank = [
    [2, 3, 1, 4], [1, 2, 2, 3], [3, 4, 2, 5], [1, 3, 3, 8], [5, 6, 1, 4], [2, 5, 3, 7],
    [3, 8, 1, 6], [4, 9, 2, 3], [5, 12, 1, 8], [7, 10, 2, 15], [1, 4, 5, 6], [2, 7, 3, 14],
    [3, 5, 4, 9], [5, 8, 3, 10], [7, 12, 5, 18], [1, 6, 7, 15], [4, 7, 5, 14], [2, 9, 5, 12],
    [3, 10, 7, 8], [5, 9, 4, 15], [7, 16, 3, 20], [11, 12, 1, 8], [2, 11, 3, 4], [5, 14, 2, 21],
    [1, 8, 5, 12], [3, 7, 2, 9], [5, 6, 4, 15], [7, 9, 1, 6], [1, 5, 7, 10], [11, 15, 2, 9],
    [4, 11, 5, 22], [5, 12, 7, 18], [3, 16, 5, 24], [2, 13, 3, 26], [5, 7, 1, 14], [7, 8, 2, 9]
  ].map(function ([numeratorA, denominatorA, numeratorB, denominatorB]) {
    return { numeratorA, denominatorA, numeratorB, denominatorB };
  });

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const answerForm = document.getElementById("answer-form");
  const numeratorInput = document.getElementById("numerator-input");
  const denominatorInput = document.getElementById("denominator-input");
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionExpression = document.getElementById("question-expression");
  const answerMessage = document.getElementById("answer-message");
  const saveStatus = document.getElementById("save-status");
  const retrySaveButton = document.getElementById("retry-save-button");
  const studentSummary = document.getElementById("student-summary");

  let sessionQuestions = [];
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let hasFinishedSession = false;
  let currentSubmission = null;

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/penjumlahan-pecahan.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function createSessionQuestions() {
    return window.MathPractice.shuffle(questionBank).slice(0, exercise.totalQuestions);
  }

  function formatFraction(numerator, denominator) {
    return `${numerator}/${denominator}`;
  }

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    const currentNumber = currentQuestionIndex + 1;
    questionProgress.textContent = `Soal ${currentNumber} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = "Jawab dengan teliti";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.textContent = `${formatFraction(question.numeratorA, question.denominatorA)} + ${formatFraction(question.numeratorB, question.denominatorB)}`;
    answerForm.reset();
    clearValidation();
    numeratorInput.focus();
  }

  function clearValidation() {
    answerMessage.textContent = "";
    numeratorInput.removeAttribute("aria-invalid");
    denominatorInput.removeAttribute("aria-invalid");
  }

  function showValidation(message, field) {
    answerMessage.textContent = message;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  function readAnswer() {
    const numeratorText = numeratorInput.value.trim();
    const denominatorText = denominatorInput.value.trim();
    const wholeNumberPattern = /^\d+$/;

    if (!numeratorText || !denominatorText) {
      showValidation("Isi pembilang dan penyebut terlebih dahulu.", !numeratorText ? numeratorInput : denominatorInput);
      return null;
    }
    if (!wholeNumberPattern.test(numeratorText) || !wholeNumberPattern.test(denominatorText)) {
      showValidation("Gunakan bilangan bulat positif atau 0, tanpa tanda atau desimal.", !wholeNumberPattern.test(numeratorText) ? numeratorInput : denominatorInput);
      return null;
    }

    const numerator = BigInt(numeratorText);
    const denominator = BigInt(denominatorText);
    const maximumInput = 10000n;
    if (numerator > maximumInput || denominator > maximumInput) {
      showValidation("Masukkan angka sampai 10.000 agar jawaban dapat diperiksa.", numerator > maximumInput ? numeratorInput : denominatorInput);
      return null;
    }
    if (denominator === 0n) {
      showValidation("Penyebut tidak boleh bernilai 0.", denominatorInput);
      return null;
    }
    return { numerator, denominator };
  }

  function isEquivalentFraction(answer, question) {
    const correctNumerator = BigInt(question.numeratorA * question.denominatorB + question.numeratorB * question.denominatorA);
    const correctDenominator = BigInt(question.denominatorA * question.denominatorB);
    return answer.numerator * correctDenominator === correctNumerator * answer.denominator;
  }

  function setSaveStatus(message, state, canRetry) {
    saveStatus.textContent = message;
    saveStatus.dataset.state = state;
    retrySaveButton.classList.toggle("is-hidden", !canRetry);
    retrySaveButton.disabled = !canRetry;
  }

  function updateSubmissionStatus(submission, message, state, canRetry) {
    if (currentSubmission === submission) {
      setSaveStatus(message, state, canRetry);
    }
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

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    const incorrectAnswers = exercise.totalQuestions - correctAnswers;
    const score = Math.min(100, Math.round((correctAnswers / exercise.totalQuestions) * 100));
    const result = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      correct: correctAnswers,
      incorrect: incorrectAnswers,
      total: exercise.totalQuestions,
      score: score
    };
    currentSubmission = { result: result, isSaving: false, isSaved: false };

    document.getElementById("final-score").textContent = score;
    document.getElementById("correct-count").textContent = correctAnswers;
    document.getElementById("incorrect-count").textContent = incorrectAnswers;
    document.getElementById("total-count").textContent = exercise.totalQuestions;
    document.getElementById("result-summary").textContent = `Kamu menjawab ${correctAnswers} dari ${exercise.totalQuestions} soal dengan benar.`;
    progressBar.style.width = "100%";

    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function startExercise() {
    sessionQuestions = createSessionQuestions();
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
    clearValidation();
    const answer = readAnswer();
    if (!answer) return;

    if (isEquivalentFraction(answer, sessionQuestions[currentQuestionIndex])) {
      correctAnswers += 1;
    }

    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) {
      finishExercise();
      return;
    }
    renderQuestion();
  });

  // Diekspos untuk tombol halaman dan dapat dipakai kembali saat latihan ini dikembangkan.
  window.MathPractice.startFractionExercise = startExercise;
  window.MathPractice.retryFractionResult = saveCurrentResult;
})();
