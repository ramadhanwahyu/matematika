(function () {
  "use strict";

  const exercise = { id: "barisan_aritmetika_un_01", name: "Suku ke-n Barisan Aritmetika", totalQuestions: 10 };
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const answerForm = document.getElementById("answer-form");
  const answerInput = document.getElementById("answer-input");
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
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
    window.location.replace("../student.html?next=latihan/suku-ke-n-barisan.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function randomInteger(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

  function createQuestion() {
    const firstTerm = randomInteger(-20, 20);
    const differenceMagnitude = randomInteger(2, 10);
    const difference = Math.random() < 0.5 ? differenceMagnitude : -differenceMagnitude;
    const n = randomInteger(10, 100);
    const terms = [firstTerm, firstTerm + difference, firstTerm + difference * 2, firstTerm + difference * 3];
    return { firstTerm: firstTerm, difference: difference, n: n, terms: terms, answer: firstTerm + (n - 1) * difference };
  }

  function createSessionQuestions() {
    const questions = [];
    const usedKeys = new Set();
    while (questions.length < exercise.totalQuestions) {
      const question = createQuestion();
      const key = `${question.firstTerm}|${question.difference}|${question.n}`;
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        questions.push(question);
      }
    }
    return questions;
  }

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    questionProgress.textContent = `Soal ${currentQuestionIndex + 1} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = "Cari polanya";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.textContent = `${question.terms.join(", ")}, …`;
    questionExpression.setAttribute("aria-label", `Barisan: ${question.terms.join(", ")}, suku berikutnya belum diisi`);
    termPrompt.textContent = `Tentukan nilai suku ke-${question.n}.`;
    answerForm.reset();
    answerMessage.textContent = "";
    answerInput.removeAttribute("aria-invalid");
    answerInput.focus();
  }

  function readAnswer() {
    const answerText = answerInput.value.trim();
    if (!answerText) {
      showValidation("Isi nilai suku ke-n terlebih dahulu.");
      return null;
    }
    if (!/^-?\d+$/.test(answerText)) {
      showValidation("Gunakan bilangan bulat, termasuk tanda minus jika diperlukan.");
      return null;
    }
    const answer = Number(answerText);
    if (!Number.isSafeInteger(answer) || Math.abs(answer) > 100000) {
      showValidation("Masukkan bilangan bulat sampai 100.000.");
      return null;
    }
    return answer;
  }

  function showValidation(message) {
    answerMessage.textContent = message;
    answerInput.setAttribute("aria-invalid", "true");
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
    expression.textContent = `${item.question.terms.join(", ")}, … | Suku ke-${item.question.n} = ${item.answer}`;
    topLine.append(number, status);
    reviewItem.append(topLine, expression);
    if (!item.isCorrect) {
      const correction = document.createElement("p");
      correction.className = "result-review-correction";
      correction.textContent = `Jawaban benar: ${item.question.answer}`;
      reviewItem.append(correction);
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
    sessionQuestions = createSessionQuestions();
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
    const answer = readAnswer();
    if (answer === null) return;
    const question = sessionQuestions[currentQuestionIndex];
    const isCorrect = answer === question.answer;
    answerHistory.push({ question: question, answer: answer, isCorrect: isCorrect });
    if (isCorrect) correctAnswers += 1;
    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) {
      finishExercise();
      return;
    }
    renderQuestion();
  });

  window.MathPractice.startArithmeticNthTermExercise = startExercise;
  window.MathPractice.retryArithmeticNthTermResult = saveCurrentResult;
})();
