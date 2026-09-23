(function () {
  "use strict";

  const exercise = { id: "menyamakan_pecahan_01", name: "Menyamakan Pecahan", totalQuestions: 10 };
  const questionBank = [
    [2, 3, 6, 9, "numerator"], [1, 4, 3, 12, "numerator"], [3, 5, 9, 15, "numerator"], [5, 6, 15, 18, "numerator"], [2, 7, 6, 21, "numerator"],
    [3, 8, 9, 24, "numerator"], [5, 9, 15, 27, "numerator"], [7, 10, 21, 30, "numerator"], [1, 6, 4, 24, "numerator"], [5, 12, 15, 36, "numerator"],
    [4, 5, 16, 20, "numerator"], [3, 10, 12, 40, "numerator"], [7, 12, 14, 24, "numerator"], [2, 9, 8, 36, "numerator"], [5, 8, 20, 32, "numerator"],
    [1, 7, 5, 35, "numerator"], [4, 11, 12, 33, "numerator"], [11, 12, 44, 48, "numerator"], [3, 4, 15, 20, "numerator"], [2, 11, 8, 44, "numerator"],
    [3, 4, 15, 20, "denominator"], [2, 3, 14, 21, "denominator"], [5, 6, 20, 24, "denominator"], [1, 5, 6, 30, "denominator"], [3, 7, 12, 28, "denominator"],
    [4, 9, 12, 27, "denominator"], [5, 8, 15, 24, "denominator"], [2, 11, 6, 33, "denominator"], [7, 12, 21, 36, "denominator"], [3, 10, 9, 30, "denominator"],
    [7, 28, 1, 4, "numerator"], [12, 18, 2, 3, "numerator"], [15, 20, 3, 4, "numerator"], [18, 24, 3, 4, "numerator"], [16, 24, 2, 3, "numerator"],
    [10, 30, 1, 3, "numerator"], [21, 35, 3, 5, "numerator"], [8, 20, 2, 5, "numerator"], [12, 16, 3, 4, "numerator"], [18, 27, 2, 3, "numerator"]
  ].map(function (data) {
    return { numerator: data[0], denominator: data[1], targetNumerator: data[2], targetDenominator: data[3], missing: data[4] };
  });

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const answerForm = document.getElementById("answer-form");
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionExpression = document.getElementById("question-expression");
  const targetNumerator = document.getElementById("target-numerator");
  const targetDenominator = document.getElementById("target-denominator");
  const answerMessage = document.getElementById("answer-message");
  const resultReviewList = document.getElementById("result-review-list");
  const saveStatus = document.getElementById("save-status");
  const retrySaveButton = document.getElementById("retry-save-button");
  const studentSummary = document.getElementById("student-summary");
  const answerInput = document.createElement("input");

  let sessionQuestions = [];
  let answerHistory = [];
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let hasFinishedSession = false;
  let currentSubmission = null;

  answerInput.id = "answer-input";
  answerInput.className = "fraction-answer-input equivalent-answer-input";
  answerInput.name = "answer";
  answerInput.type = "text";
  answerInput.inputMode = "numeric";
  answerInput.autocomplete = "off";
  answerInput.maxLength = 4;
  answerInput.setAttribute("aria-describedby", "answer-help answer-message");
  answerInput.setAttribute("aria-label", "Angka yang hilang");

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/menyamakan-pecahan.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function createFractionElement(numerator, denominator) {
    const fraction = document.createElement("span");
    const numeratorElement = document.createElement("span");
    const line = document.createElement("span");
    const denominatorElement = document.createElement("span");
    fraction.className = "math-fraction";
    numeratorElement.className = "math-fraction-numerator";
    line.className = "math-fraction-line";
    denominatorElement.className = "math-fraction-denominator";
    numeratorElement.textContent = numerator;
    denominatorElement.textContent = denominator;
    fraction.append(numeratorElement, line, denominatorElement);
    return fraction;
  }

  function createQuestionLabel(question) {
    const target = question.missing === "numerator"
      ? `kosong per ${question.targetDenominator}`
      : `${question.targetNumerator} per kosong`;
    return `${question.numerator} per ${question.denominator} sama dengan ${target}`;
  }

  function renderTargetFraction(question) {
    const filledValue = question.missing === "numerator" ? question.targetDenominator : question.targetNumerator;
    const emptyPosition = question.missing === "numerator" ? targetNumerator : targetDenominator;
    const filledPosition = question.missing === "numerator" ? targetDenominator : targetNumerator;

    emptyPosition.replaceChildren(answerInput);
    filledPosition.textContent = filledValue;
    answerInput.value = "";
    answerInput.removeAttribute("aria-invalid");
    answerInput.setAttribute("aria-label", question.missing === "numerator" ? "Pembilang yang hilang" : "Penyebut yang hilang");
  }

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    questionProgress.textContent = `Soal ${currentQuestionIndex + 1} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = question.missing === "numerator" ? "Cari pembilang" : "Cari penyebut";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.replaceChildren(createFractionElement(question.numerator, question.denominator));
    questionExpression.setAttribute("aria-label", createQuestionLabel(question));
    renderTargetFraction(question);
    answerMessage.textContent = "";
    answerInput.focus();
  }

  function readAnswer() {
    const answerText = answerInput.value.trim();
    if (!answerText) {
      showValidation("Isi angka yang hilang terlebih dahulu.");
      return null;
    }
    if (!/^\d+$/.test(answerText)) {
      showValidation("Gunakan bilangan bulat positif tanpa tanda atau desimal.");
      return null;
    }
    const answer = Number(answerText);
    if (answer < 1 || answer > 1000) {
      showValidation("Masukkan bilangan dari 1 sampai 1.000.");
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

  function createReviewAnswer(label, value) {
    const group = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerValue = document.createElement("span");
    group.className = "result-review-answer";
    answerLabel.textContent = label;
    answerValue.className = "result-review-answer-value";
    answerValue.textContent = value;
    group.append(answerLabel, answerValue);
    return group;
  }

  function createReviewItem(item, index) {
    const reviewItem = document.createElement("article");
    const topLine = document.createElement("div");
    const number = document.createElement("p");
    const status = document.createElement("p");
    const expression = document.createElement("div");
    const answers = document.createElement("div");
    const targetAnswer = item.question.missing === "numerator"
      ? createFractionElement(item.answer, item.question.targetDenominator)
      : createFractionElement(item.question.targetNumerator, item.answer);

    reviewItem.className = "result-review-item";
    reviewItem.dataset.state = item.isCorrect ? "correct" : "incorrect";
    topLine.className = "result-review-item-topline";
    number.className = "result-review-number";
    number.textContent = `Soal ${index + 1}`;
    status.className = "result-review-status";
    status.textContent = item.isCorrect ? "Benar" : "Perlu ditinjau";
    expression.className = "result-review-expression fraction-review-expression";
    expression.append(createFractionElement(item.question.numerator, item.question.denominator), document.createTextNode("="), targetAnswer);
    answers.className = "result-review-answers";
    answers.append(createReviewAnswer("Jawabanmu", item.answer));
    if (!item.isCorrect) {
      answers.append(createReviewAnswer("Jawaban benar", item.question.missing === "numerator" ? item.question.targetNumerator : item.question.targetDenominator));
    }
    topLine.append(number, status);
    reviewItem.append(topLine, expression, answers);
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
    const answer = readAnswer();
    if (answer === null) return;
    const question = sessionQuestions[currentQuestionIndex];
    const correctAnswer = question.missing === "numerator" ? question.targetNumerator : question.targetDenominator;
    const isCorrect = answer === correctAnswer;
    answerHistory.push({ question: question, answer: answer, isCorrect: isCorrect });
    if (isCorrect) correctAnswers += 1;
    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) {
      finishExercise();
      return;
    }
    renderQuestion();
  });

  window.MathPractice.startEquivalentFractionExercise = startExercise;
  window.MathPractice.retryEquivalentFractionResult = saveCurrentResult;
})();
