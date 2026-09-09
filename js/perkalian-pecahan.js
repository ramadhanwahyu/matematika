(function () {
  "use strict";

  const exercise = {
    id: "perkalian_pecahan_01",
    name: "Perkalian Pecahan",
    totalQuestions: 10
  };

  const twoFractionBank = [
    [[1, 2], [2, 3]], [[2, 3], [3, 4]], [[3, 5], [5, 6]], [[4, 7], [7, 8]], [[2, 5], [3, 4]],
    [[3, 4], [2, 9]], [[5, 6], [3, 10]], [[7, 8], [4, 7]], [[3, 7], [7, 9]], [[5, 8], [4, 9]],
    [[2, 9], [3, 5]], [[7, 10], [5, 7]], [[4, 9], [3, 8]], [[5, 12], [6, 7]], [[7, 12], [9, 10]]
  ].map(function (factors) {
    return { type: "two", factors: factors.map(createFactor) };
  });

  const threeFractionBank = [
    [[1, 2], [2, 3], [3, 4]], [[2, 3], [3, 5], [5, 8]], [[3, 4], [2, 3], [5, 6]], [[4, 5], [5, 6], [3, 8]], [[2, 7], [7, 9], [3, 4]],
    [[5, 6], [3, 10], [4, 5]], [[3, 8], [4, 9], [6, 7]], [[7, 10], [5, 7], [2, 3]], [[2, 5], [3, 4], [5, 6]], [[5, 12], [6, 7], [7, 10]],
    [[4, 9], [3, 8], [6, 5]], [[7, 8], [4, 7], [2, 3]], [[3, 10], [5, 6], [4, 9]], [[5, 9], [3, 5], [6, 7]], [[7, 12], [3, 7], [8, 9]]
  ].map(function (factors) {
    return { type: "three", factors: factors.map(createFactor) };
  });

  function createFactor(pair) {
    return { numerator: pair[0], denominator: pair[1] };
  }

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
  const questionPrompt = document.getElementById("question-prompt");
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
    window.location.replace("../student.html?next=latihan/perkalian-pecahan.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function createSessionQuestions() {
    const twoFractionQuestions = window.MathPractice.shuffle(twoFractionBank).slice(0, 5);
    const threeFractionQuestions = window.MathPractice.shuffle(threeFractionBank).slice(0, 5);
    return twoFractionQuestions.concat(threeFractionQuestions);
  }

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

  function createFractionExpression(factors) {
    const expression = document.createDocumentFragment();
    factors.forEach(function (factor, index) {
      if (index > 0) expression.append(document.createTextNode("×"));
      expression.append(createFractionElement(factor.numerator, factor.denominator));
    });
    return expression;
  }

  function createQuestionLabel(question) {
    return question.factors.map(function (factor) {
      return `${factor.numerator} per ${factor.denominator}`;
    }).join(" dikali ");
  }

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    const currentNumber = currentQuestionIndex + 1;
    questionProgress.textContent = `Soal ${currentNumber} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = question.type === "two" ? "Perkalian 2 pecahan" : "Perkalian 3 pecahan";
    questionPrompt.textContent = question.type === "two" ? "Hitung hasil perkalian dua pecahan berikut." : "Hitung hasil perkalian tiga pecahan berikut.";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.replaceChildren(createFractionExpression(question.factors));
    questionExpression.setAttribute("aria-label", createQuestionLabel(question));
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
    field.setAttribute("aria-invalid", "true");
    field.focus();
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
    return { numerator: numerator, denominator: denominator };
  }

  function getCorrectFraction(question) {
    const product = question.factors.reduce(function (result, factor) {
      return {
        numerator: result.numerator * BigInt(factor.numerator),
        denominator: result.denominator * BigInt(factor.denominator)
      };
    }, { numerator: 1n, denominator: 1n });
    const divisor = greatestCommonDivisor(product.numerator, product.denominator);
    return { numerator: product.numerator / divisor, denominator: product.denominator / divisor };
  }

  function greatestCommonDivisor(firstNumber, secondNumber) {
    let first = firstNumber;
    let second = secondNumber;
    while (second !== 0n) {
      const remainder = first % second;
      first = second;
      second = remainder;
    }
    return first;
  }

  function isEquivalentFraction(answer, question) {
    const correct = getCorrectFraction(question);
    return answer.numerator * correct.denominator === correct.numerator * answer.denominator;
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

  function createReviewAnswer(label, fraction) {
    const answerGroup = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerValue = document.createElement("span");

    answerGroup.className = "result-review-answer";
    answerLabel.textContent = label;
    answerValue.className = "fraction-review-answer";
    answerValue.append(createFractionElement(fraction.numerator, fraction.denominator));
    answerGroup.append(answerLabel, answerValue);
    return answerGroup;
  }

  function createReviewItem(item, index) {
    const reviewItem = document.createElement("article");
    const topLine = document.createElement("div");
    const questionNumber = document.createElement("p");
    const status = document.createElement("p");
    const expression = document.createElement("div");
    const answers = document.createElement("div");

    reviewItem.className = "result-review-item";
    reviewItem.dataset.state = item.isCorrect ? "correct" : "incorrect";
    topLine.className = "result-review-item-topline";
    questionNumber.className = "result-review-number";
    questionNumber.textContent = `Soal ${index + 1}`;
    status.className = "result-review-status";
    status.textContent = item.isCorrect ? "Benar" : "Perlu ditinjau";
    expression.className = "result-review-expression fraction-review-expression";
    expression.append(createFractionExpression(item.question.factors));
    expression.setAttribute("aria-label", createQuestionLabel(item.question));
    answers.className = "result-review-answers";
    answers.append(createReviewAnswer("Jawabanmu", item.answer));
    if (!item.isCorrect) answers.append(createReviewAnswer("Jawaban benar", getCorrectFraction(item.question)));

    topLine.append(questionNumber, status);
    reviewItem.append(topLine, expression, answers);
    return reviewItem;
  }

  function renderResultReview() {
    resultReviewList.replaceChildren(...answerHistory.map(createReviewItem));
  }

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    const incorrectAnswers = exercise.totalQuestions - correctAnswers;
    const score = Math.min(100, correctAnswers * 10);
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
    renderResultReview();

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
    clearValidation();
    const answer = readAnswer();
    if (!answer) return;

    const question = sessionQuestions[currentQuestionIndex];
    const isCorrect = isEquivalentFraction(answer, question);
    answerHistory.push({ question: question, answer: answer, isCorrect: isCorrect });
    if (isCorrect) correctAnswers += 1;

    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) {
      finishExercise();
      return;
    }
    renderQuestion();
  });

  window.MathPractice.startFractionMultiplicationExercise = startExercise;
  window.MathPractice.retryFractionMultiplicationResult = saveCurrentResult;
})();
