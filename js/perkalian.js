(function () {
  "use strict";

  const exercise = {
    id: "perkalian_cepat_01",
    name: "Perkalian Cepat",
    durationSeconds: 60
  };

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const answerForm = document.getElementById("answer-form");
  const answerInput = document.getElementById("answer-input");
  const questionExpression = document.getElementById("question-expression");
  const timerValue = document.getElementById("timer-value");
  const correctProgress = document.getElementById("correct-progress");
  const answerMessage = document.getElementById("answer-message");
  const saveStatus = document.getElementById("save-status");
  const retrySaveButton = document.getElementById("retry-save-button");
  const studentSummary = document.getElementById("student-summary");

  let currentQuestion = null;
  let previousQuestionKey = "";
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let deadline = 0;
  let timerId = null;
  let hasFinishedSession = false;
  let currentSubmission = null;

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/perkalian.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function createQuestion() {
    let firstFactor;
    let secondFactor;
    let questionKey;
    do {
      firstFactor = Math.floor(Math.random() * 8) + 2;
      secondFactor = Math.floor(Math.random() * 8) + 2;
      questionKey = `${firstFactor}x${secondFactor}`;
    } while (questionKey === previousQuestionKey);

    previousQuestionKey = questionKey;
    return { firstFactor: firstFactor, secondFactor: secondFactor, answer: firstFactor * secondFactor };
  }

  function showQuestion() {
    currentQuestion = createQuestion();
    questionExpression.textContent = `${currentQuestion.firstFactor} × ${currentQuestion.secondFactor} =`;
    questionExpression.setAttribute("aria-label", `${currentQuestion.firstFactor} dikali ${currentQuestion.secondFactor}`);
    answerForm.reset();
    answerMessage.textContent = "";
    answerInput.removeAttribute("aria-invalid");
    answerInput.focus();
  }

  function updateTimer() {
    const remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerValue.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (remainingSeconds === 0) {
      finishExercise();
    }
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

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    window.clearInterval(timerId);
    timerId = null;

    const totalAnswers = correctAnswers + incorrectAnswers;
    const result = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      correct: correctAnswers,
      incorrect: incorrectAnswers,
      total: totalAnswers,
      score: correctAnswers
    };
    currentSubmission = { result: result, isSaving: false, isSaved: false };

    document.getElementById("final-score").textContent = correctAnswers;
    document.getElementById("correct-count").textContent = correctAnswers;
    document.getElementById("incorrect-count").textContent = incorrectAnswers;
    document.getElementById("total-count").textContent = totalAnswers;
    document.getElementById("result-summary").textContent = `Kamu memperoleh ${correctAnswers} poin dalam satu menit.`;
    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function startExercise() {
    window.clearInterval(timerId);
    correctAnswers = 0;
    incorrectAnswers = 0;
    previousQuestionKey = "";
    hasFinishedSession = false;
    currentSubmission = null;
    correctProgress.textContent = "0 poin";
    setSaveStatus("", "idle", false);
    deadline = Date.now() + exercise.durationSeconds * 1000;
    window.MathPractice.showOnly(quizScreen, screens);
    showQuestion();
    updateTimer();
    timerId = window.setInterval(updateTimer, 250);
  }

  answerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (hasFinishedSession) return;
    if (Date.now() >= deadline) {
      finishExercise();
      return;
    }

    const answerText = answerInput.value.trim();
    if (!/^\d+$/.test(answerText)) {
      answerMessage.textContent = "Masukkan jawaban berupa angka.";
      answerInput.setAttribute("aria-invalid", "true");
      answerInput.focus();
      return;
    }

    if (Number(answerText) === currentQuestion.answer) {
      correctAnswers += 1;
      correctProgress.textContent = `${correctAnswers} poin`;
    } else {
      incorrectAnswers += 1;
    }
    showQuestion();
  });

  window.MathPractice.startMultiplicationExercise = startExercise;
  window.MathPractice.retryMultiplicationResult = saveCurrentResult;
})();
