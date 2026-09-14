(function () {
  "use strict";

  const exercise = {
    id: "eksponen_dasar_01",
    name: "Sifat Eksponen Dasar",
    totalQuestions: 10,
    durationSeconds: 300
  };

  function number(value) {
    return `<mn>${value}</mn>`;
  }

  function variable(value) {
    return `<mi>${value}</mi>`;
  }

  function exponent(value) {
    return value < 0 ? `<mrow><mo>−</mo>${number(Math.abs(value))}</mrow>` : number(value);
  }

  function power(base, value) {
    const baseExpression = typeof base === "number" ? number(base) : variable(base);
    return `<msup>${baseExpression}${exponent(value)}</msup>`;
  }

  function multiply() {
    return `<mrow>${Array.from(arguments).join("<mo>×</mo>")}</mrow>`;
  }

  function fraction(numerator, denominator) {
    return `<mfrac><mrow>${numerator}</mrow><mrow>${denominator}</mrow></mfrac>`;
  }

  function powerOption(base, exponentValue) {
    return {
      value: `${base}^${exponentValue}`,
      label: `${base} pangkat ${exponentValue}`,
      mathml: power(base, exponentValue)
    };
  }

  function fractionPowerOption(base, exponentValue) {
    return {
      value: `1/${base}^${exponentValue}`,
      label: `satu per ${base} pangkat ${exponentValue}`,
      mathml: `<mfrac><mn>1</mn>${power(base, exponentValue)}</mfrac>`
    };
  }

  function valueOption(value) {
    return { value: String(value), label: String(value), mathml: number(value) };
  }

  // Setiap soal hanya menguji satu sifat eksponen dan memiliki tiga pengalih unik.
  const questionBank = [
    { mathml: multiply(power("x", 2), power("x", 3)), label: "x pangkat 2 kali x pangkat 3", answer: powerOption("x", 5), distractors: [powerOption("x", 6), powerOption("x", 1), powerOption("x", 8)] },
    { mathml: multiply(power("a", 4), power("a", 2)), label: "a pangkat 4 kali a pangkat 2", answer: powerOption("a", 6), distractors: [powerOption("a", 8), powerOption("a", 2), powerOption("a", 4)] },
    { mathml: multiply(power("b", 5), power("b", 1)), label: "b pangkat 5 kali b", answer: powerOption("b", 6), distractors: [powerOption("b", 5), powerOption("b", 4), powerOption("b", 1)] },
    { mathml: multiply(power("m", 3), power("m", 4)), label: "m pangkat 3 kali m pangkat 4", answer: powerOption("m", 7), distractors: [powerOption("m", 12), powerOption("m", 1), powerOption("m", 6)] },
    { mathml: multiply(power("p", 2), power("p", 3), power("p", 4)), label: "p pangkat 2 kali p pangkat 3 kali p pangkat 4", answer: powerOption("p", 9), distractors: [powerOption("p", 6), powerOption("p", 7), powerOption("p", 24)] },
    { mathml: multiply(power(2, 2), power(2, 3), power(2, 4)), label: "2 pangkat 2 kali 2 pangkat 3 kali 2 pangkat 4", answer: powerOption(2, 9), distractors: [powerOption(2, 6), powerOption(2, 7), powerOption(2, 24)] },
    { mathml: fraction(power("x", 7), power("x", 2)), label: "x pangkat 7 dibagi x pangkat 2", answer: powerOption("x", 5), distractors: [powerOption("x", 9), powerOption("x", 2), powerOption("x", 14)] },
    { mathml: fraction(power("a", 6), power("a", 3)), label: "a pangkat 6 dibagi a pangkat 3", answer: powerOption("a", 3), distractors: [powerOption("a", 9), powerOption("a", 2), powerOption("a", 18)] },
    { mathml: fraction(power("b", 9), power("b", 4)), label: "b pangkat 9 dibagi b pangkat 4", answer: powerOption("b", 5), distractors: [powerOption("b", 13), powerOption("b", 4), powerOption("b", 36)] },
    { mathml: fraction(power("m", 5), variable("m")), label: "m pangkat 5 dibagi m", answer: powerOption("m", 4), distractors: [powerOption("m", 5), powerOption("m", 6), powerOption("m", 1)] },
    { mathml: fraction(power("p", 8), power("p", 2)), label: "p pangkat 8 dibagi p pangkat 2", answer: powerOption("p", 6), distractors: [powerOption("p", 10), powerOption("p", 4), powerOption("p", 16)] },
    { mathml: fraction(power(3, 6), power(3, 2)), label: "3 pangkat 6 dibagi 3 pangkat 2", answer: powerOption(3, 4), distractors: [powerOption(3, 8), powerOption(3, 3), powerOption(3, 12)] },
    { mathml: `<msup><mrow><mo>(</mo>${power("x", 2)}<mo>)</mo></mrow>${number(3)}</msup>`, label: "x pangkat 2, seluruhnya pangkat 3", answer: powerOption("x", 6), distractors: [powerOption("x", 5), powerOption("x", 8), powerOption("x", 9)] },
    { mathml: `<msup><mrow><mo>(</mo>${power("a", 3)}<mo>)</mo></mrow>${number(2)}</msup>`, label: "a pangkat 3, seluruhnya pangkat 2", answer: powerOption("a", 6), distractors: [powerOption("a", 5), powerOption("a", 8), powerOption("a", 9)] },
    { mathml: `<msup><mrow><mo>(</mo>${power("b", 4)}<mo>)</mo></mrow>${number(2)}</msup>`, label: "b pangkat 4, seluruhnya pangkat 2", answer: powerOption("b", 8), distractors: [powerOption("b", 6), powerOption("b", 16), powerOption("b", 2)] },
    { mathml: `<msup><mrow><mo>(</mo>${power("m", 2)}<mo>)</mo></mrow>${number(4)}</msup>`, label: "m pangkat 2, seluruhnya pangkat 4", answer: powerOption("m", 8), distractors: [powerOption("m", 6), powerOption("m", 16), powerOption("m", 2)] },
    { mathml: `<msup><mrow><mo>(</mo>${power("p", 5)}<mo>)</mo></mrow>${number(2)}</msup>`, label: "p pangkat 5, seluruhnya pangkat 2", answer: powerOption("p", 10), distractors: [powerOption("p", 7), powerOption("p", 25), powerOption("p", 3)] },
    { mathml: `<msup><mrow><mo>(</mo>${power(2, 3)}<mo>)</mo></mrow>${number(2)}</msup>`, label: "2 pangkat 3, seluruhnya pangkat 2", answer: powerOption(2, 6), distractors: [powerOption(2, 5), powerOption(2, 8), powerOption(2, 9)] },
    { mathml: multiply(power("x", -2), power("x", -3)), label: "x pangkat negatif 2 kali x pangkat negatif 3", answer: fractionPowerOption("x", 5), distractors: [powerOption("x", -5), fractionPowerOption("x", 1), fractionPowerOption("x", 6)] },
    { mathml: multiply(power("a", -4), power("a", -2)), label: "a pangkat negatif 4 kali a pangkat negatif 2", answer: fractionPowerOption("a", 6), distractors: [powerOption("a", -6), fractionPowerOption("a", 2), fractionPowerOption("a", 8)] },
    { mathml: power("b", -3), label: "b pangkat negatif 3", answer: fractionPowerOption("b", 3), distractors: [powerOption("b", 3), fractionPowerOption("b", 2), fractionPowerOption("b", 4)] },
    { mathml: power("m", -4), label: "m pangkat negatif 4", answer: fractionPowerOption("m", 4), distractors: [powerOption("m", 4), fractionPowerOption("m", 3), fractionPowerOption("m", 5)] },
    { mathml: power(2, -3), label: "2 pangkat negatif 3", answer: fractionPowerOption(2, 3), distractors: [powerOption(2, 3), fractionPowerOption(2, 2), fractionPowerOption(2, 4)] },
    { mathml: power(5, -2), label: "5 pangkat negatif 2", answer: fractionPowerOption(5, 2), distractors: [powerOption(5, 2), fractionPowerOption(5, 1), fractionPowerOption(5, 3)] },
    { mathml: power("x", 0), label: "x pangkat nol", answer: valueOption(1), distractors: [valueOption(0), powerOption("x", 1), powerOption("x", 2)] },
    { mathml: power("a", 0), label: "a pangkat nol", answer: valueOption(1), distractors: [valueOption(0), powerOption("a", 1), powerOption("a", 2)] },
    { mathml: multiply(power("b", 3), power("b", -3)), label: "b pangkat 3 kali b pangkat negatif 3", answer: valueOption(1), distractors: [valueOption(0), powerOption("b", 3), powerOption("b", -3)] },
    { mathml: multiply(power("m", -2), power("m", 2)), label: "m pangkat negatif 2 kali m pangkat 2", answer: valueOption(1), distractors: [valueOption(0), powerOption("m", 2), powerOption("m", -2)] },
    { mathml: power(2, 0), label: "2 pangkat nol", answer: valueOption(1), distractors: [valueOption(0), valueOption(2), powerOption(2, 2)] },
    { mathml: power(7, 0), label: "7 pangkat nol", answer: valueOption(1), distractors: [valueOption(0), valueOption(7), powerOption(7, 2)] }
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
  const timerValue = document.getElementById("timer-value");

  let sessionQuestions = [];
  let sessionOptions = [];
  let sessionAnswers = [];
  let currentQuestionIndex = 0;
  let hasFinishedSession = false;
  let currentSubmission = null;
  let deadline = 0;
  let timerId = null;

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/eksponen-dasar.html");
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
    math.innerHTML = option.mathml;
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
    questionExpression.innerHTML = `<math display="block">${question.mathml}</math>`;
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

  function updateTimer() {
    const remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerValue.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    if (remainingSeconds === 0) finishExercise(true);
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
      finishExercise(false);
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
    answerMath.append(createOptionMath(option));
    answerGroup.append(answerLabel, answerMath);
    return answerGroup;
  }

  function createMissingReviewAnswer() {
    const answerGroup = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerText = document.createElement("span");

    answerGroup.className = "result-review-answer";
    answerLabel.textContent = "Jawabanmu";
    answerText.className = "result-review-answer-value";
    answerText.textContent = "Belum dijawab";
    answerGroup.append(answerLabel, answerText);
    return answerGroup;
  }

  function createReviewItem(question, index) {
    const selectedOption = getOptionByValue(question, sessionAnswers[index]);
    const isCorrect = Boolean(selectedOption && selectedOption.value === question.answer.value);
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
    expression.innerHTML = `<math display="block">${question.mathml}</math>`;
    expression.setAttribute("aria-label", question.label);
    answers.className = "result-review-answers";
    answers.append(selectedOption ? createReviewAnswer("Jawabanmu", selectedOption) : createMissingReviewAnswer());
    if (!isCorrect) answers.append(createReviewAnswer("Jawaban benar", question.answer));

    topLine.append(questionNumber, status);
    item.append(topLine, expression, answers);
    return item;
  }

  function renderResultReview() {
    resultReviewList.replaceChildren(...sessionQuestions.map(createReviewItem));
  }

  function finishExercise(isTimeUp) {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    window.clearInterval(timerId);
    timerId = null;

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

    document.getElementById("result-eyebrow").textContent = isTimeUp ? "Waktu habis" : "Sesi selesai";
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
    window.clearInterval(timerId);
    sessionQuestions = createSessionQuestions();
    sessionOptions = sessionQuestions.map(function (question) {
      return window.MathPractice.shuffle(getQuestionOptions(question));
    });
    sessionAnswers = Array(exercise.totalQuestions).fill("");
    currentQuestionIndex = 0;
    hasFinishedSession = false;
    currentSubmission = null;
    deadline = Date.now() + exercise.durationSeconds * 1000;
    setSaveStatus("", "idle", false);
    window.MathPractice.showOnly(quizScreen, screens);
    updateTimer();
    timerId = window.setInterval(updateTimer, 250);
    renderQuestion(false);
  }

  window.MathPractice.startBasicExponentExercise = startExercise;
  window.MathPractice.showPreviousBasicExponentQuestion = showPreviousQuestion;
  window.MathPractice.showNextBasicExponentQuestion = showNextQuestion;
  window.MathPractice.retryBasicExponentResult = saveCurrentResult;
})();
