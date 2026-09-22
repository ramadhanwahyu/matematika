(function () {
  "use strict";

  const exercise = {
    id: "eksponen_aljabar_01",
    name: "Eksponen dan Aljabar",
    totalQuestions: 10
  };

  function number(value) {
    return `<mn>${value}</mn>`;
  }

  function variable(name) {
    return `<mi>${name}</mi>`;
  }

  function signedNumber(value) {
    return value < 0
      ? `<mrow><mo>−</mo>${number(Math.abs(value))}</mrow>`
      : number(value);
  }

  function group(expression) {
    return `<mrow><mo>(</mo>${expression}<mo>)</mo></mrow>`;
  }

  function power(base, exponent) {
    const baseExpression = typeof base === "number" ? number(base) : base;
    const exponentExpression = typeof exponent === "number" ? signedNumber(exponent) : exponent;
    return `<msup>${baseExpression}${exponentExpression}</msup>`;
  }

  function multiply() {
    return `<mrow>${Array.from(arguments).join("<mo>×</mo>")}</mrow>`;
  }

  function divide(numerator, denominator) {
    return `<mfrac><mrow>${numerator}</mrow><mrow>${denominator}</mrow></mfrac>`;
  }

  function add(left, right) {
    return `<mrow>${left}<mo>+</mo>${right}</mrow>`;
  }

  function subtract(left, right) {
    return `<mrow>${left}<mo>−</mo>${right}</mrow>`;
  }

  function coefficient(value, name) {
    return `<mrow>${number(value)}${variable(name)}</mrow>`;
  }

  function equation(left, right) {
    return `<math display="block"><mrow>${left}<mo>=</mo>${right}</mrow></math>`;
  }

  function integerOption(value) {
    return {
      value: String(value),
      label: value < 0 ? `negatif ${Math.abs(value)}` : String(value),
      mathml: `<math><mrow>${signedNumber(value)}</mrow></math>`
    };
  }

  // Setiap soal memiliki empat nilai m yang berbeda agar hanya ada satu jawaban benar.
  const questionBank = [
    { mathml: equation(divide(number(1), power(group(power(3, variable("m"))), 3)), multiply(power(3, -2), power(3, -7))), label: "1 dibagi (3 pangkat m) pangkat 3 sama dengan 3 pangkat negatif 2 kali 3 pangkat negatif 7", answer: integerOption(3), distractors: [integerOption(2), integerOption(4), integerOption(-3)] },
    { mathml: equation(multiply(power(2, add(variable("m"), number(4))), power(2, 3)), power(2, 12)), label: "2 pangkat m tambah 4 kali 2 pangkat 3 sama dengan 2 pangkat 12", answer: integerOption(5), distractors: [integerOption(4), integerOption(6), integerOption(9)] },
    { mathml: equation(power(group(power(5, subtract(variable("m"), number(2)))), 2), power(5, 6)), label: "(5 pangkat m kurang 2) pangkat 2 sama dengan 5 pangkat 6", answer: integerOption(5), distractors: [integerOption(4), integerOption(3), integerOption(8)] },
    { mathml: equation(divide(power(7, coefficient(2, "m")), power(7, 4)), power(7, 2)), label: "7 pangkat 2m dibagi 7 pangkat 4 sama dengan 7 pangkat 2", answer: integerOption(3), distractors: [integerOption(2), integerOption(4), integerOption(-3)] },
    { mathml: equation(multiply(power(4, add(variable("m"), number(1))), power(4, -3)), power(4, 2)), label: "4 pangkat m tambah 1 kali 4 pangkat negatif 3 sama dengan 4 pangkat 2", answer: integerOption(4), distractors: [integerOption(3), integerOption(5), integerOption(0)] },
    { mathml: equation(divide(power(group(power(3, variable("m"))), 2), power(3, 4)), power(3, 8)), label: "(3 pangkat m) pangkat 2 dibagi 3 pangkat 4 sama dengan 3 pangkat 8", answer: integerOption(6), distractors: [integerOption(4), integerOption(5), integerOption(8)] },
    { mathml: equation(divide(number(1), power(2, add(variable("m"), number(1)))), power(2, -6)), label: "1 dibagi 2 pangkat m tambah 1 sama dengan 2 pangkat negatif 6", answer: integerOption(5), distractors: [integerOption(4), integerOption(6), integerOption(-5)] },
    { mathml: equation(power(group(multiply(power(6, variable("m")), power(6, 2))), 2), power(6, 12)), label: "(6 pangkat m kali 6 pangkat 2) pangkat 2 sama dengan 6 pangkat 12", answer: integerOption(4), distractors: [integerOption(3), integerOption(5), integerOption(6)] },
    { mathml: equation(divide(power(9, add(variable("m"), number(1))), power(group(power(9, 2)), 2)), power(9, 3)), label: "9 pangkat m tambah 1 dibagi (9 pangkat 2) pangkat 2 sama dengan 9 pangkat 3", answer: integerOption(6), distractors: [integerOption(5), integerOption(7), integerOption(2)] },
    { mathml: equation(multiply(power(8, coefficient(2, "m")), power(8, -3)), power(8, 5)), label: "8 pangkat 2m kali 8 pangkat negatif 3 sama dengan 8 pangkat 5", answer: integerOption(4), distractors: [integerOption(3), integerOption(5), integerOption(-4)] },
    { mathml: equation(divide(power(10, subtract(variable("m"), number(2))), power(10, -3)), power(10, 2)), label: "10 pangkat m kurang 2 dibagi 10 pangkat negatif 3 sama dengan 10 pangkat 2", answer: integerOption(1), distractors: [integerOption(0), integerOption(2), integerOption(-1)] },
    { mathml: equation(power(group(power(2, subtract(variable("m"), number(1)))), 3), power(2, 0)), label: "(2 pangkat m kurang 1) pangkat 3 sama dengan 2 pangkat 0", answer: integerOption(1), distractors: [integerOption(0), integerOption(2), integerOption(3)] },
    { mathml: equation(divide(number(1), multiply(power(5, variable("m")), power(5, 2))), power(5, -3)), label: "1 dibagi 5 pangkat m kali 5 pangkat 2 sama dengan 5 pangkat negatif 3", answer: integerOption(1), distractors: [integerOption(0), integerOption(2), integerOption(-1)] },
    { mathml: equation(power(group(divide(power(3, add(variable("m"), number(2))), power(3, 3))), 2), power(3, 0)), label: "(3 pangkat m tambah 2 dibagi 3 pangkat 3) pangkat 2 sama dengan 3 pangkat 0", answer: integerOption(1), distractors: [integerOption(0), integerOption(2), integerOption(3)] },
    { mathml: equation(multiply(power(2, add(variable("m"), number(3))), power(2, 2)), power(2, 1)), label: "2 pangkat m tambah 3 kali 2 pangkat 2 sama dengan 2 pangkat 1", answer: integerOption(-4), distractors: [integerOption(-3), integerOption(-5), integerOption(4)] },
    { mathml: equation(divide(number(1), power(7, subtract(variable("m"), number(1)))), power(7, 2)), label: "1 dibagi 7 pangkat m kurang 1 sama dengan 7 pangkat 2", answer: integerOption(-1), distractors: [integerOption(0), integerOption(1), integerOption(-2)] },
    { mathml: equation(multiply(power(4, subtract(variable("m"), number(2))), power(4, 2)), power(4, 0)), label: "4 pangkat m kurang 2 kali 4 pangkat 2 sama dengan 4 pangkat 0", answer: integerOption(0), distractors: [integerOption(1), integerOption(-1), integerOption(2)] },
    { mathml: equation(divide(power(group(power(2, add(variable("m"), number(2)))), 2), power(2, 4)), power(2, 8)), label: "(2 pangkat m tambah 2) pangkat 2 dibagi 2 pangkat 4 sama dengan 2 pangkat 8", answer: integerOption(4), distractors: [integerOption(3), integerOption(5), integerOption(6)] },
    { mathml: equation(multiply(power(3, subtract(variable("m"), number(2))), power(3, add(coefficient(2, "m"), number(1)))), power(3, 8)), label: "3 pangkat m kurang 2 kali 3 pangkat 2m tambah 1 sama dengan 3 pangkat 8", answer: integerOption(3), distractors: [integerOption(2), integerOption(4), integerOption(-3)] },
    { mathml: equation(divide(multiply(power(group(power(5, variable("m"))), 2), power(5, -4)), power(5, 2)), power(5, 2)), label: "((5 pangkat m) pangkat 2 kali 5 pangkat negatif 4) dibagi 5 pangkat 2 sama dengan 5 pangkat 2", answer: integerOption(4), distractors: [integerOption(3), integerOption(5), integerOption(2)] }
  ];

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionExpression = document.getElementById("question-expression");
  const answerOptions = document.getElementById("answer-options");
  const previousButton = document.getElementById("previous-button");
  const nextButton = document.getElementById("next-button");
  const resultReviewList = document.getElementById("result-review-list");
  const saveStatus = document.getElementById("save-status");
  const retrySaveButton = document.getElementById("retry-save-button");
  const studentSummary = document.getElementById("student-summary");

  let sessionQuestions = [];
  let sessionOptions = [];
  let sessionAnswers = [];
  let currentQuestionIndex = 0;
  let hasFinishedSession = false;
  let currentSubmission = null;

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/eksponen-aljabar.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function getQuestionOptions(question) {
    return [question.answer].concat(question.distractors);
  }

  function getOptionByValue(question, value) {
    return getQuestionOptions(question).find(function (option) {
      return option.value === value;
    });
  }

  function createOptionButton(option, index, selectedValue) {
    const button = document.createElement("button");
    const key = document.createElement("span");
    const answerValue = document.createElement("span");
    const optionLetter = String.fromCharCode(65 + index);
    const isSelected = selectedValue === option.value;

    button.className = "exponent-option";
    button.classList.toggle("is-selected", isSelected);
    button.type = "button";
    button.setAttribute("aria-label", `Pilihan ${optionLetter}: ${option.label}`);
    button.setAttribute("aria-pressed", String(isSelected));
    key.className = "exponent-option-key";
    key.textContent = optionLetter;
    answerValue.className = "exponent-option-value";
    answerValue.innerHTML = option.mathml;
    button.append(key, answerValue);
    button.addEventListener("click", function () {
      selectAnswer(option.value);
    });
    return button;
  }

  function renderQuestion(focusSelectedOption) {
    const question = sessionQuestions[currentQuestionIndex];
    const selectedValue = sessionAnswers[currentQuestionIndex];
    const currentNumber = currentQuestionIndex + 1;

    questionProgress.textContent = `Soal ${currentNumber} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = selectedValue ? "Jawaban tersimpan" : "Pilih satu jawaban";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.innerHTML = question.mathml;
    questionExpression.setAttribute("aria-label", question.label);
    answerOptions.replaceChildren(...sessionOptions[currentQuestionIndex].map(function (option, index) {
      return createOptionButton(option, index, selectedValue);
    }));
    previousButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = !selectedValue;
    nextButton.textContent = currentQuestionIndex === exercise.totalQuestions - 1 ? "Lihat hasil" : "Soal berikutnya →";

    const focusTarget = focusSelectedOption && selectedValue
      ? answerOptions.querySelector('[aria-pressed="true"]')
      : answerOptions.querySelector("button");
    focusTarget.focus();
  }

  function selectAnswer(answer) {
    if (hasFinishedSession) return;
    sessionAnswers[currentQuestionIndex] = answer;
    renderQuestion(true);
  }

  function showPreviousQuestion() {
    if (currentQuestionIndex === 0 || hasFinishedSession) return;
    currentQuestionIndex -= 1;
    renderQuestion(true);
  }

  function showNextQuestion() {
    if (!sessionAnswers[currentQuestionIndex] || hasFinishedSession) return;
    if (currentQuestionIndex === exercise.totalQuestions - 1) {
      finishExercise();
      return;
    }
    currentQuestionIndex += 1;
    renderQuestion(false);
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

  function createReviewAnswer(label, option) {
    const answerGroup = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerMath = document.createElement("span");

    answerGroup.className = "result-review-answer";
    answerLabel.textContent = label;
    answerMath.className = "result-review-answer-math";
    answerMath.innerHTML = option.mathml;
    answerGroup.append(answerLabel, answerMath);
    return answerGroup;
  }

  function createReviewItem(question, index) {
    const selectedOption = getOptionByValue(question, sessionAnswers[index]);
    const isCorrect = selectedOption.value === question.answer.value;
    const item = document.createElement("article");
    const topLine = document.createElement("div");
    const questionNumber = document.createElement("p");
    const status = document.createElement("p");
    const expression = document.createElement("div");
    const answers = document.createElement("div");

    item.className = "result-review-item";
    item.dataset.state = isCorrect ? "correct" : "incorrect";
    topLine.className = "result-review-item-topline";
    questionNumber.className = "result-review-number";
    questionNumber.textContent = `Soal ${index + 1}`;
    status.className = "result-review-status";
    status.textContent = isCorrect ? "Benar" : "Perlu ditinjau";
    expression.className = "result-review-expression";
    expression.innerHTML = question.mathml;
    expression.setAttribute("aria-label", question.label);
    answers.className = "result-review-answers";
    answers.append(createReviewAnswer("Jawabanmu", selectedOption));
    if (!isCorrect) answers.append(createReviewAnswer("Jawaban benar", question.answer));
    topLine.append(questionNumber, status);
    item.append(topLine, expression, answers);
    return item;
  }

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    const correctAnswers = sessionQuestions.reduce(function (total, question, index) {
      return total + Number(sessionAnswers[index] === question.answer.value);
    }, 0);
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
    resultReviewList.replaceChildren(...sessionQuestions.map(createReviewItem));
    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function startExercise() {
    sessionQuestions = window.MathPractice.shuffle(questionBank).slice(0, exercise.totalQuestions);
    sessionOptions = sessionQuestions.map(function (question) {
      return window.MathPractice.shuffle(getQuestionOptions(question));
    });
    sessionAnswers = Array(exercise.totalQuestions).fill("");
    currentQuestionIndex = 0;
    hasFinishedSession = false;
    currentSubmission = null;
    setSaveStatus("", "idle", false);
    window.MathPractice.showOnly(quizScreen, screens);
    renderQuestion(false);
  }

  window.MathPractice.startExponentAlgebraExercise = startExercise;
  window.MathPractice.showPreviousExponentAlgebraQuestion = showPreviousQuestion;
  window.MathPractice.showNextExponentAlgebraQuestion = showNextQuestion;
  window.MathPractice.retryExponentAlgebraResult = saveCurrentResult;
})();
