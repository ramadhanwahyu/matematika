(function () {
  "use strict";

  const exercise = { id: "barisan_geometri_un_01", name: "Suku ke-n Geometri", totalQuestions: 10 };

  // Soal nomor 35 memakai rasio 1/3 agar tetap geometri dan rasio barisannya tidak konstan.
  const questionBank = [
    { terms: [2, 4, 8], n: 8, answer: 256 },
    { terms: [3, 6, 12], n: 9, answer: 768 },
    { terms: [5, 10, 20], n: 8, answer: 640 },
    { terms: [1, 3, 9], n: 7, answer: 729 },
    { terms: [4, 12, 36], n: 6, answer: 972 },
    { terms: [7, 14, 28], n: 8, answer: 896 },
    { terms: [6, 18, 54], n: 6, answer: 486 },
    { terms: [2, 10, 50], n: 5, answer: 1250 },
    { terms: [3, -6, 12], n: 7, answer: 192 },
    { terms: [-2, 4, -8], n: 8, answer: -256 },
    { terms: [5, -10, 20], n: 7, answer: 320 },
    { terms: [-3, -9, -27], n: 6, answer: -729 },
    { terms: [4, -12, 36], n: 6, answer: -972 },
    { terms: [-1, 2, -4], n: 10, answer: -512 },
    { terms: [3, -9, 27], n: 6, answer: -729 },
    { terms: [-4, 8, -16], n: 7, answer: -256 },
    { terms: [2, -4, 8], n: 9, answer: 512 },
    { terms: [1, -3, 9], n: 8, answer: -2187 },
    { terms: [5, -15, 45], n: 5, answer: 405 },
    { terms: [2, 6, 18], n: 7, answer: 1458 },
    { terms: [4, 16, 64], n: 5, answer: 1024 },
    { terms: [-2, -8, -32], n: 6, answer: -2048 },
    { terms: [3, 12, 48], n: 5, answer: 768 },
    { terms: [-1, -5, -25], n: 6, answer: -3125 },
    { terms: [6, -18, 54], n: 5, answer: 486 },
    { terms: [-3, 6, -12], n: 8, answer: 384 },
    { terms: [10, 20, 40], n: 7, answer: 640 },
    { terms: [2, -10, 50], n: 6, answer: -6250 },
    { terms: [-2, 6, -18], n: 7, answer: -1458 },
    { terms: [4, -8, 16], n: 9, answer: 1024 },
    { terms: [-5, 10, -20], n: 6, answer: 160 },
    { terms: [1, 4, 16], n: 6, answer: 1024 },
    { terms: [-1, -2, -4], n: 9, answer: -256 },
    { terms: [3, -3, 3], n: 12, answer: -3 },
    { terms: [729, 243, 81], n: 7, answer: 1 },
    { terms: [-6, 6, -6], n: 11, answer: -6 },
    { terms: [5, 25, 125], n: 5, answer: 3125 },
    { terms: [-2, -6, -18], n: 7, answer: -1458 },
    { terms: [8, -16, 32], n: 8, answer: -1024 },
    { terms: [2, -10, 50], n: 5, answer: 1250 }
  ];

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const answerForm = document.getElementById("answer-form");
  const answerInput = document.getElementById("answer-input");
  const questionProgress = document.getElementById("question-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionExpression = document.getElementById("question-expression");
  const termPrompt = document.getElementById("term-prompt");
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
    window.location.replace("../student.html?next=latihan/suku-ke-n-geometri.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function showValidation(message) {
    answerMessage.textContent = message;
    answerInput.setAttribute("aria-invalid", "true");
    answerInput.focus();
  }

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    questionProgress.textContent = `Soal ${currentQuestionIndex + 1} dari ${exercise.totalQuestions}`;
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.textContent = `${question.terms.join(", ")}, …`;
    questionExpression.setAttribute("aria-label", `Barisan: ${question.terms.join(", ")}, dan seterusnya`);
    termPrompt.textContent = `Tentukan suku ke-${question.n}.`;
    answerForm.reset();
    answerMessage.textContent = "";
    answerInput.removeAttribute("aria-invalid");
    answerInput.focus();
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
    updateSubmissionStatus(submission, "Menyimpan nilai…", "pending", false);
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
    expression.textContent = `${item.question.terms.join(", ")}, …; tentukan suku ke-${item.question.n}`;
    topLine.append(number, status);
    reviewItem.append(topLine, expression);
    const answers = document.createElement("div");
    answers.className = "result-review-answers";
    const yourAnswer = document.createElement("p");
    yourAnswer.className = "result-review-correction";
    yourAnswer.textContent = `Jawabanmu: ${item.answer}`;
    answers.append(yourAnswer);
    if (!item.isCorrect) {
      const correctAnswer = document.createElement("p");
      correctAnswer.className = "result-review-correction";
      correctAnswer.textContent = `Jawaban benar: ${item.question.answer}`;
      answers.append(correctAnswer);
    }
    reviewItem.append(answers);
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
    answerInput.removeAttribute("aria-invalid");
    const answerText = answerInput.value.trim();
    if (!/^-?\d+$/.test(answerText)) {
      showValidation("Masukkan jawaban berupa bilangan bulat, termasuk tanda minus jika diperlukan.");
      return;
    }
    const answer = Number(answerText);
    if (!Number.isSafeInteger(answer) || Math.abs(answer) > 10000) {
      showValidation("Masukkan bilangan bulat antara −10.000 sampai 10.000.");
      return;
    }
    const question = sessionQuestions[currentQuestionIndex];
    const isCorrect = answer === question.answer;
    answerHistory.push({ question: question, answer: answer, isCorrect: isCorrect });
    if (isCorrect) correctAnswers += 1;
    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) finishExercise();
    else renderQuestion();
  });

  window.MathPractice.startGeometricSequenceExercise = startExercise;
  window.MathPractice.retryGeometricSequenceResult = saveCurrentResult;
})();
