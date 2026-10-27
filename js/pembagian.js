(function () {
  "use strict";

  const exercise = { id: "pembagian_cepat_01", name: "Pembagian Cepat", durationSeconds: 60 };
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
  const rateLimitStatus = document.getElementById("rate-limit-status");
  const answerSubmitButton = document.getElementById("answer-submit-button");
  const saveStatus = document.getElementById("save-status");
  const retrySaveButton = document.getElementById("retry-save-button");
  const studentSummary = document.getElementById("student-summary");
  const resultReviewList = document.getElementById("result-review-list");

  let currentQuestion = null;
  let previousQuestionKey = "";
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let deadline = 0;
  let timerId = null;
  let hasFinishedSession = false;
  let currentSubmission = null;
  let answerHistory = [];
  let submissionTimestamps = [];
  let cooldownUntil = 0;
  let cooldownLevel = 0;

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/pembagian.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function createQuestion() {
    let divisor;
    let quotient;
    let dividend;
    let questionKey;
    do {
      divisor = Math.floor(Math.random() * 8) + 2;
      quotient = Math.floor(Math.random() * 8) + 2;
      dividend = divisor * quotient;
      questionKey = `${dividend}÷${divisor}`;
    } while (questionKey === previousQuestionKey);
    previousQuestionKey = questionKey;
    return { dividend: dividend, divisor: divisor, answer: quotient };
  }

  function showQuestion() {
    currentQuestion = createQuestion();
    questionExpression.textContent = `${currentQuestion.dividend} ÷ ${currentQuestion.divisor} =`;
    questionExpression.setAttribute("aria-label", `${currentQuestion.dividend} dibagi ${currentQuestion.divisor}`);
    answerForm.reset();
    answerMessage.textContent = "";
    rateLimitStatus.textContent = "";
    rateLimitStatus.classList.add("is-hidden");
    answerInput.removeAttribute("aria-invalid");
    answerInput.focus();
  }

  function updateTimer() {
    const remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerValue.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    updateCooldown(Date.now());
    if (remainingSeconds === 0) finishExercise();
  }

  function updateCooldown(now) {
    if (!cooldownUntil) return;
    const remainingSeconds = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
    if (remainingSeconds === 0) {
      cooldownUntil = 0;
      answerInput.disabled = false;
      answerSubmitButton.disabled = false;
      answerMessage.textContent = "";
      rateLimitStatus.textContent = "";
      rateLimitStatus.classList.add("is-hidden");
      answerInput.focus();
      return;
    }
    rateLimitStatus.textContent = `Kamu dapat menjawab lagi dalam ${remainingSeconds} detik.`;
  }

  function startCooldown(now) {
    // Cooldown meningkat jika batas kembali terlampaui dalam sesi yang sama, hingga 30 detik.
    cooldownLevel += 1;
    const cooldownSeconds = Math.min(10 * (2 ** (cooldownLevel - 1)), 30);
    cooldownUntil = now + cooldownSeconds * 1000;
    submissionTimestamps = [];
    answerInput.value = "";
    answerInput.disabled = true;
    answerSubmitButton.disabled = true;
    answerInput.removeAttribute("aria-invalid");
    answerMessage.textContent = "Terdeteksi kegiatan mencurigakan. Jeda sebentar sebelum melanjutkan.";
    rateLimitStatus.classList.remove("is-hidden");
    updateCooldown(now);
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
      void window.MathPractice.loadSpeedLeaderboard(exercise.id);
    }
  }

  function createReviewAnswer(label, value) {
    const answerGroup = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerValue = document.createElement("span");
    answerGroup.className = "result-review-answer";
    answerLabel.textContent = label;
    answerValue.className = "result-review-answer-value";
    answerValue.textContent = value;
    answerGroup.append(answerLabel, answerValue);
    return answerGroup;
  }

  function createReviewItem(item, index) {
    const reviewItem = document.createElement("article");
    const topLine = document.createElement("div");
    const questionNumber = document.createElement("p");
    const status = document.createElement("p");
    const expression = document.createElement("p");
    const answers = document.createElement("div");
    reviewItem.className = "result-review-item";
    reviewItem.dataset.state = item.isCorrect ? "correct" : "incorrect";
    topLine.className = "result-review-item-topline";
    questionNumber.className = "result-review-number";
    questionNumber.textContent = `Soal ${index + 1}`;
    status.className = "result-review-status";
    status.textContent = item.isCorrect ? "Benar" : "Perlu ditinjau";
    expression.className = "result-review-expression multiplication-review-expression";
    expression.textContent = `${item.dividend} ÷ ${item.divisor} =`;
    answers.className = "result-review-answers";
    answers.append(createReviewAnswer("Jawabanmu", item.studentAnswer));
    if (!item.isCorrect) answers.append(createReviewAnswer("Jawaban benar", item.correctAnswer));
    topLine.append(questionNumber, status);
    reviewItem.append(topLine, expression, answers);
    return reviewItem;
  }

  function renderResultReview() {
    if (answerHistory.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "result-review-empty";
      emptyMessage.textContent = "Belum ada soal yang dijawab pada sesi ini.";
      resultReviewList.replaceChildren(emptyMessage);
      return;
    }
    resultReviewList.replaceChildren(...answerHistory.map(createReviewItem));
  }

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    window.clearInterval(timerId);
    timerId = null;
    const totalAnswers = answerHistory.length;
    const result = { exercise_id: exercise.id, exercise_name: exercise.name, correct: correctAnswers, incorrect: incorrectAnswers, total: totalAnswers, score: correctAnswers };
    currentSubmission = { result: result, isSaving: false, isSaved: false };
    document.getElementById("final-score").textContent = correctAnswers;
    document.getElementById("correct-count").textContent = correctAnswers;
    document.getElementById("incorrect-count").textContent = incorrectAnswers;
    document.getElementById("total-count").textContent = totalAnswers;
    document.getElementById("result-summary").textContent = `Kamu memperoleh ${correctAnswers} poin dalam satu menit.`;
    renderResultReview();
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
    answerHistory = [];
    submissionTimestamps = [];
    cooldownUntil = 0;
    cooldownLevel = 0;
    answerInput.disabled = false;
    answerSubmitButton.disabled = false;
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
    const now = Date.now();
    if (cooldownUntil > now) return;
    const answerText = answerInput.value.trim();
    if (!/^\d+$/.test(answerText)) {
      answerMessage.textContent = "Masukkan jawaban berupa angka.";
      answerInput.setAttribute("aria-invalid", "true");
      answerInput.focus();
      return;
    }
    submissionTimestamps = submissionTimestamps.filter(function (timestamp) { return now - timestamp < 10000; });
    submissionTimestamps.push(now);
    if (submissionTimestamps.length >= 30) {
      startCooldown(now);
      return;
    }
    const studentAnswer = Number(answerText);
    const isCorrect = studentAnswer === currentQuestion.answer;
    answerHistory.push({ dividend: currentQuestion.dividend, divisor: currentQuestion.divisor, studentAnswer: studentAnswer, correctAnswer: currentQuestion.answer, isCorrect: isCorrect });
    if (isCorrect) {
      correctAnswers += 1;
      correctProgress.textContent = `${correctAnswers} poin`;
    } else {
      incorrectAnswers += 1;
    }
    showQuestion();
  });

  window.MathPractice.startDivisionExercise = startExercise;
  window.MathPractice.retryDivisionResult = saveCurrentResult;
})();
