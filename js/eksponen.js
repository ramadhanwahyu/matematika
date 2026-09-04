(function () {
  "use strict";

  const exercise = {
    id: "eksponen_01",
    name: "Eksponen",
    totalQuestions: 10
  };

  function number(value) {
    return `<mn>${value}</mn>`;
  }

  function exponent(value) {
    return value < 0 ? `<mrow><mo>−</mo>${number(Math.abs(value))}</mrow>` : number(value);
  }

  function power(base, value) {
    const baseExpression = typeof base === "number" ? number(base) : base;
    return `<msup>${baseExpression}${exponent(value)}</msup>`;
  }

  function group(expression) {
    return `<mrow><mo>(</mo>${expression}<mo>)</mo></mrow>`;
  }

  function multiply() {
    return `<mrow>${Array.from(arguments).join("<mo>×</mo>")}</mrow>`;
  }

  function fraction(numerator, denominator) {
    return `<math display="block"><mfrac><mrow>${numerator}</mrow><mrow>${denominator}</mrow></mfrac></math>`;
  }

  function valueOption(value) {
    return { value: String(value), label: String(value) };
  }

  function powerOption(base, exponentValue) {
    return {
      value: String(base ** exponentValue),
      label: `${base} pangkat ${exponentValue}`,
      power: { base: base, exponent: exponentValue }
    };
  }

  // Setiap soal membawa empat hasil unik: satu jawaban benar dan tiga pengalih yang masuk akal.
  const questionBank = [
    { mathml: fraction(multiply(power(2, 5), power(2, 3)), power(2, 4)), label: "(2 pangkat 5 kali 2 pangkat 3) dibagi 2 pangkat 4", answer: valueOption(16), distractors: [valueOption(8), valueOption(32), valueOption(4)] },
    { mathml: fraction(multiply(power(3, 4), power(3, 2)), power(group(power(3, 2)), 2)), label: "(3 pangkat 4 kali 3 pangkat 2) dibagi (3 pangkat 2) pangkat 2", answer: valueOption(9), distractors: [valueOption(3), valueOption(27), valueOption(1)] },
    { mathml: fraction(multiply(power(5, 3), power(5, -2)), power(5, -1)), label: "(5 pangkat 3 kali 5 pangkat negatif 2) dibagi 5 pangkat negatif 1", answer: valueOption(25), distractors: [valueOption(5), valueOption(125), valueOption(1)] },
    { mathml: fraction(multiply(power(group(power(2, 3)), 2), power(2, -2)), power(2, 3)), label: "((2 pangkat 3) pangkat 2 kali 2 pangkat negatif 2) dibagi 2 pangkat 3", answer: valueOption(2), distractors: [valueOption(4), valueOption(8), valueOption(1)] },
    { mathml: fraction(power(group(power(3, 2)), 3), group(multiply(power(3, 4), power(3, -1)))), label: "(3 pangkat 2) pangkat 3 dibagi (3 pangkat 4 kali 3 pangkat negatif 1)", answer: valueOption(27), distractors: [valueOption(9), valueOption(81), valueOption(3)] },
    { mathml: fraction(multiply(power(2, 4), power(4, 2)), power(2, 5)), label: "(2 pangkat 4 kali 4 pangkat 2) dibagi 2 pangkat 5", answer: valueOption(8), distractors: [valueOption(4), valueOption(16), valueOption(2)] },
    { mathml: fraction(multiply(power(9, 2), power(3, -1)), power(3, 2)), label: "(9 pangkat 2 kali 3 pangkat negatif 1) dibagi 3 pangkat 2", answer: valueOption(3), distractors: [valueOption(1), valueOption(9), valueOption(27)] },
    { mathml: fraction(multiply(power(8, 2), power(2, -3)), power(2, 2)), label: "(8 pangkat 2 kali 2 pangkat negatif 3) dibagi 2 pangkat 2", answer: valueOption(2), distractors: [valueOption(4), valueOption(8), valueOption(1)] },
    { mathml: fraction(multiply(power(4, 3), power(2, -2)), number(8)), label: "(4 pangkat 3 kali 2 pangkat negatif 2) dibagi 8", answer: valueOption(2), distractors: [valueOption(4), valueOption(8), valueOption(1)] },
    { mathml: fraction(multiply(number(27), power(3, 2)), power(group(power(3, 2)), 2)), label: "(27 kali 3 pangkat 2) dibagi (3 pangkat 2) pangkat 2", answer: valueOption(3), distractors: [valueOption(1), valueOption(9), valueOption(27)] },
    { mathml: fraction(multiply(power(group(power(2, 2)), 3), power(4, -1)), power(2, -1)), label: "((2 pangkat 2) pangkat 3 kali 4 pangkat negatif 1) dibagi 2 pangkat negatif 1", answer: valueOption(32), distractors: [valueOption(16), valueOption(64), valueOption(8)] },
    { mathml: fraction(multiply(power(25, 2), power(5, -3)), power(5, 0)), label: "(25 pangkat 2 kali 5 pangkat negatif 3) dibagi 5 pangkat 0", answer: valueOption(5), distractors: [valueOption(1), valueOption(25), valueOption(125)] },
    { mathml: fraction(multiply(power(group(power(3, 3)), 2), power(9, -1)), power(3, 2)), label: "((3 pangkat 3) pangkat 2 kali 9 pangkat negatif 1) dibagi 3 pangkat 2", answer: valueOption(9), distractors: [valueOption(3), valueOption(27), valueOption(81)] },
    { mathml: fraction(multiply(power(16, 2), power(2, -3)), power(4, 2)), label: "(16 pangkat 2 kali 2 pangkat negatif 3) dibagi 4 pangkat 2", answer: valueOption(2), distractors: [valueOption(4), valueOption(8), valueOption(1)] },
    { mathml: fraction(power(group(power(5, 2)), 2), group(multiply(number(25), power(5, -1)))), label: "(5 pangkat 2) pangkat 2 dibagi (25 kali 5 pangkat negatif 1)", answer: valueOption(125), distractors: [valueOption(25), powerOption(5, 4), valueOption(5)] },
    { mathml: fraction(multiply(power(8, 2), power(4, -1)), power(2, -2)), label: "(8 pangkat 2 kali 4 pangkat negatif 1) dibagi 2 pangkat negatif 2", answer: valueOption(64), distractors: [valueOption(16), valueOption(32), powerOption(2, 7)] },
    { mathml: fraction(multiply(power(9, 3), power(3, -4)), number(27)), label: "(9 pangkat 3 kali 3 pangkat negatif 4) dibagi 27", answer: valueOption("1/3"), distractors: [valueOption("1/9"), valueOption(3), valueOption("1/27")] },
    { mathml: fraction(multiply(power(group(power(4, 2)), 2), power(2, -3)), power(2, 2)), label: "((4 pangkat 2) pangkat 2 kali 2 pangkat negatif 3) dibagi 2 pangkat 2", answer: valueOption(8), distractors: [valueOption(4), valueOption(16), valueOption(2)] },
    { mathml: fraction(multiply(power(27, 2), power(9, -1)), power(3, -2)), label: "(27 pangkat 2 kali 9 pangkat negatif 1) dibagi 3 pangkat negatif 2", answer: powerOption(3, 6), distractors: [powerOption(3, 4), powerOption(3, 5), powerOption(3, 7)] },
    { mathml: fraction(multiply(power(group(power(2, 3)), 3), power(4, -2)), power(2, -1)), label: "((2 pangkat 3) pangkat 3 kali 4 pangkat negatif 2) dibagi 2 pangkat negatif 1", answer: valueOption(64), distractors: [valueOption(32), powerOption(2, 7), valueOption(16)] }
  ];

  const mathNamespace = "http://www.w3.org/1998/Math/MathML";
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
    window.location.replace("../student.html?next=latihan/eksponen.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function createSessionQuestions() {
    return window.MathPractice.shuffle(questionBank).slice(0, exercise.totalQuestions);
  }

  function getQuestionOptions(question) {
    return [question.answer].concat(question.distractors);
  }

  function createMathElement(tagName, text) {
    const element = document.createElementNS(mathNamespace, tagName);
    if (text) element.textContent = text;
    return element;
  }

  function createOptionMath(option) {
    const math = createMathElement("math");

    math.setAttribute("aria-hidden", "true");
    if (option.power) {
      const poweredValue = createMathElement("msup");
      poweredValue.append(createMathElement("mn", option.power.base), createMathElement("mn", option.power.exponent));
      math.append(poweredValue);
      return math;
    }

    const [numerator, denominator] = option.value.split("/");
    if (!denominator) {
      math.append(createMathElement("mn", numerator));
      return math;
    }

    const answerFraction = createMathElement("mfrac");
    answerFraction.append(createMathElement("mn", numerator), createMathElement("mn", denominator));
    math.append(answerFraction);
    return math;
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
    answerValue.append(createOptionMath(option));
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

  function createReviewAnswer(label, option) {
    const answerGroup = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerMath = document.createElement("span");

    answerGroup.className = "result-review-answer";
    answerLabel.textContent = label;
    answerMath.className = "result-review-answer-math";
    answerMath.append(createOptionMath(option));
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

  function renderResultReview() {
    resultReviewList.replaceChildren(...sessionQuestions.map(createReviewItem));
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
    renderResultReview();

    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function startExercise() {
    sessionQuestions = createSessionQuestions();
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

  window.MathPractice.startExponentExercise = startExercise;
  window.MathPractice.showPreviousExponentQuestion = showPreviousQuestion;
  window.MathPractice.showNextExponentQuestion = showNextQuestion;
  window.MathPractice.retryExponentResult = saveCurrentResult;
})();
