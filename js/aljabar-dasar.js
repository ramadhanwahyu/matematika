(function () {
  "use strict";

  const exercise = {
    id: "aljabar_dasar_01",
    name: "Aljabar Dasar Level 2",
    totalQuestions: 10
  };

  function number(value) {
    return value < 0 ? `<mrow><mo>−</mo><mn>${Math.abs(value)}</mn></mrow>` : `<mn>${value}</mn>`;
  }

  function variable(name) { return `<mi>${name}</mi>`; }
  function term(coefficient, name) { return `<mrow>${number(coefficient)}${variable(name)}</mrow>`; }
  function group(expression) { return `<mrow><mo>(</mo>${expression}<mo>)</mo></mrow>`; }
  function add(left, right) { return `<mrow>${left}<mo>+</mo>${right}</mrow>`; }
  function subtract(left, right) { return `<mrow>${left}<mo>−</mo>${right}</mrow>`; }
  // Perkalian yang diikuti tanda kurung ditulis sebagai perkalian implisit,
  // misalnya 5(a - 2), sesuai notasi matematika yang umum digunakan.
  function multiply(left, right) { return `<mrow>${left}${right}</mrow>`; }
  function divide(numerator, denominator) { return `<mfrac><mrow>${numerator}</mrow><mrow>${denominator}</mrow></mfrac>`; }
  function equation(left, right) { return `<math display="block"><mrow>${left}<mo>=</mo>${right}</mrow></math>`; }

  function valueOption(value) {
    return {
      value: String(value),
      label: value < 0 ? `negatif ${Math.abs(value)}` : String(value),
      mathml: `<math><mrow>${number(value)}</mrow></math>`
    };
  }

  // Bank mencakup operasi dasar, distributif, variabel pada dua ruas, dan pecahan sederhana.
  const questionBank = [
    { mathml: equation(subtract(term(4, "a"), number(9)), number(-5)), label: "4a kurang 9 sama dengan negatif 5", answer: valueOption(1), distractors: [valueOption(-1), valueOption(2), valueOption(4)] },
    { mathml: equation(divide(subtract(term(3, "a"), number(1)), number(4)), number(5)), label: "(3a kurang 1) dibagi 4 sama dengan 5", answer: valueOption(7), distractors: [valueOption(5), valueOption(6), valueOption(8)] },
    { mathml: equation(add(term(5, "x"), number(8)), number(23)), label: "5x tambah 8 sama dengan 23", answer: valueOption(3), distractors: [valueOption(2), valueOption(4), valueOption(5)] },
    { mathml: equation(subtract(term(7, "a"), number(6)), number(29)), label: "7a kurang 6 sama dengan 29", answer: valueOption(5), distractors: [valueOption(3), valueOption(4), valueOption(6)] },
    { mathml: equation(subtract(number(12), term(3, "x")), number(-6)), label: "12 kurang 3x sama dengan negatif 6", answer: valueOption(6), distractors: [valueOption(-6), valueOption(2), valueOption(4)] },
    { mathml: equation(add(term(-4, "a"), number(9)), number(21)), label: "negatif 4a tambah 9 sama dengan 21", answer: valueOption(-3), distractors: [valueOption(3), valueOption(-2), valueOption(-4)] },
    { mathml: equation(add(term(2, "x"), number(15)), number(3)), label: "2x tambah 15 sama dengan 3", answer: valueOption(-6), distractors: [valueOption(6), valueOption(-5), valueOption(-9)] },
    { mathml: equation(subtract(number(18), term(5, "a")), number(3)), label: "18 kurang 5a sama dengan 3", answer: valueOption(3), distractors: [valueOption(2), valueOption(4), valueOption(-3)] },
    { mathml: equation(subtract(term(6, "x"), number(2)), add(term(4, "x"), number(10))), label: "6x kurang 2 sama dengan 4x tambah 10", answer: valueOption(6), distractors: [valueOption(4), valueOption(5), valueOption(8)] },
    { mathml: equation(add(term(9, "a"), number(7)), subtract(term(5, "a"), number(9))), label: "9a tambah 7 sama dengan 5a kurang 9", answer: valueOption(-4), distractors: [valueOption(4), valueOption(-2), valueOption(-6)] },
    { mathml: equation(multiply(number(3), group(add(variable("a"), number(4)))), number(27)), label: "3 kali (a tambah 4) sama dengan 27", answer: valueOption(5), distractors: [valueOption(4), valueOption(6), valueOption(9)] },
    { mathml: equation(multiply(number(5), group(subtract(variable("x"), number(2)))), number(15)), label: "5 kali (x kurang 2) sama dengan 15", answer: valueOption(5), distractors: [valueOption(3), valueOption(7), valueOption(13)] },
    { mathml: equation(multiply(number(-2), group(add(variable("a"), number(3)))), number(8)), label: "negatif 2 kali (a tambah 3) sama dengan 8", answer: valueOption(-7), distractors: [valueOption(7), valueOption(-1), valueOption(-5)] },
    { mathml: equation(multiply(number(4), group(subtract(term(2, "x"), number(1)))), number(20)), label: "4 kali (2x kurang 1) sama dengan 20", answer: valueOption(3), distractors: [valueOption(2), valueOption(4), valueOption(5)] },
    { mathml: equation(multiply(number(3), group(add(term(2, "a"), number(5)))), number(27)), label: "3 kali (2a tambah 5) sama dengan 27", answer: valueOption(2), distractors: [valueOption(1), valueOption(3), valueOption(6)] },
    { mathml: equation(add(multiply(number(2), group(subtract(variable("x"), number(3)))), number(4)), number(18)), label: "2 kali (x kurang 3) tambah 4 sama dengan 18", answer: valueOption(10), distractors: [valueOption(8), valueOption(9), valueOption(12)] },
    { mathml: equation(subtract(multiply(number(5), group(add(variable("a"), number(1)))), number(3)), number(22)), label: "5 kali (a tambah 1) kurang 3 sama dengan 22", answer: valueOption(4), distractors: [valueOption(3), valueOption(5), valueOption(6)] },
    { mathml: equation(add(multiply(number(4), group(subtract(variable("x"), number(2)))), term(3, "x")), number(20)), label: "4 kali (x kurang 2) tambah 3x sama dengan 20", answer: valueOption(4), distractors: [valueOption(3), valueOption(5), valueOption(6)] },
    { mathml: equation(subtract(term(6, "a"), multiply(number(2), group(add(variable("a"), number(5))))), number(10)), label: "6a kurang 2 kali (a tambah 5) sama dengan 10", answer: valueOption(5), distractors: [valueOption(3), valueOption(4), valueOption(6)] },
    { mathml: equation(add(multiply(number(3), group(subtract(term(2, "x"), number(1)))), variable("x")), number(18)), label: "3 kali (2x kurang 1) tambah x sama dengan 18", answer: valueOption(3), distractors: [valueOption(2), valueOption(4), valueOption(5)] },
    { mathml: equation(divide(add(variable("x"), number(5)), number(3)), number(4)), label: "(x tambah 5) dibagi 3 sama dengan 4", answer: valueOption(7), distractors: [valueOption(5), valueOption(6), valueOption(9)] },
    { mathml: equation(divide(subtract(term(2, "a"), number(3)), number(5)), number(3)), label: "(2a kurang 3) dibagi 5 sama dengan 3", answer: valueOption(9), distractors: [valueOption(6), valueOption(8), valueOption(12)] },
    { mathml: equation(divide(add(term(4, "a"), number(8)), number(2)), number(10)), label: "(4a tambah 8) dibagi 2 sama dengan 10", answer: valueOption(3), distractors: [valueOption(2), valueOption(4), valueOption(5)] },
    { mathml: equation(divide(subtract(term(5, "x"), number(10)), number(3)), number(5)), label: "(5x kurang 10) dibagi 3 sama dengan 5", answer: valueOption(5), distractors: [valueOption(4), valueOption(6), valueOption(7)] },
    { mathml: equation(divide(add(term(3, "a"), number(6)), number(4)), number(0)), label: "(3a tambah 6) dibagi 4 sama dengan 0", answer: valueOption(-2), distractors: [valueOption(0), valueOption(2), valueOption(-6)] },
    { mathml: equation(divide(add(term(2, "x"), number(1)), number(3)), number(-5)), label: "(2x tambah 1) dibagi 3 sama dengan negatif 5", answer: valueOption(-8), distractors: [valueOption(-5), valueOption(-7), valueOption(8)] },
    { mathml: equation(add(divide(subtract(variable("a"), number(4)), number(2)), number(3)), number(8)), label: "(a kurang 4) dibagi 2 tambah 3 sama dengan 8", answer: valueOption(14), distractors: [valueOption(10), valueOption(12), valueOption(16)] },
    { mathml: equation(subtract(term(7, "x"), number(4)), add(term(3, "x"), number(16))), label: "7x kurang 4 sama dengan 3x tambah 16", answer: valueOption(5), distractors: [valueOption(4), valueOption(6), valueOption(7)] },
    { mathml: equation(multiply(number(5), group(subtract(term(2, "x"), number(1)))), add(term(3, "x"), number(16))), label: "5 kali (2x kurang 1) sama dengan 3x tambah 16", answer: valueOption(3), distractors: [valueOption(2), valueOption(4), valueOption(5)] },
    { mathml: equation(subtract(multiply(number(4), group(add(variable("a"), number(2)))), number(3)), add(term(2, "a"), number(11))), label: "4 kali (a tambah 2) kurang 3 sama dengan 2a tambah 11", answer: valueOption(3), distractors: [valueOption(2), valueOption(4), valueOption(5)] }
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
    window.location.replace("../student.html?next=latihan/aljabar-dasar.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function getQuestionOptions(question) { return [question.answer].concat(question.distractors); }
  function getOptionByValue(question, value) { return getQuestionOptions(question).find(function (option) { return option.value === value; }); }

  function createOptionButton(option, index, selectedValue) {
    const button = document.createElement("button");
    const key = document.createElement("span");
    const answerValue = document.createElement("span");
    const letter = String.fromCharCode(65 + index);
    const isSelected = selectedValue === option.value;
    button.className = "exponent-option";
    button.classList.toggle("is-selected", isSelected);
    button.type = "button";
    button.setAttribute("aria-label", `Pilihan ${letter}: ${option.label}`);
    button.setAttribute("aria-pressed", String(isSelected));
    key.className = "exponent-option-key";
    key.textContent = letter;
    answerValue.className = "exponent-option-value";
    answerValue.innerHTML = option.mathml;
    button.append(key, answerValue);
    button.addEventListener("click", function () { selectAnswer(option.value); });
    return button;
  }

  function renderQuestion(focusSelectedOption) {
    const question = sessionQuestions[currentQuestionIndex];
    const selectedValue = sessionAnswers[currentQuestionIndex];
    questionProgress.textContent = `Soal ${currentQuestionIndex + 1} dari ${exercise.totalQuestions}`;
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
    const focusTarget = focusSelectedOption && selectedValue ? answerOptions.querySelector('[aria-pressed="true"]') : answerOptions.querySelector("button");
    focusTarget.focus();
  }

  function selectAnswer(answer) { if (!hasFinishedSession) { sessionAnswers[currentQuestionIndex] = answer; renderQuestion(true); } }
  function showPreviousQuestion() { if (currentQuestionIndex > 0 && !hasFinishedSession) { currentQuestionIndex -= 1; renderQuestion(true); } }
  function showNextQuestion() {
    if (!sessionAnswers[currentQuestionIndex] || hasFinishedSession) return;
    if (currentQuestionIndex === exercise.totalQuestions - 1) { finishExercise(); return; }
    currentQuestionIndex += 1;
    renderQuestion(false);
  }

  function setSaveStatus(message, state, canRetry) {
    saveStatus.textContent = message;
    saveStatus.dataset.state = state;
    retrySaveButton.classList.toggle("is-hidden", !canRetry);
    retrySaveButton.disabled = !canRetry;
  }

  async function saveCurrentResult() {
    const submission = currentSubmission;
    if (!submission || submission.isSaving || submission.isSaved) return;
    submission.isSaving = true;
    setSaveStatus("Menyimpan nilai...", "pending", false);
    try {
      await window.MathPractice.submitExerciseResult(submission.result);
      submission.isSaved = true;
      setSaveStatus("Nilai berhasil disimpan.", "success", false);
    } catch (error) {
      setSaveStatus(`Nilai belum berhasil disimpan. ${error.message} Silakan coba lagi setelah diperbaiki.`, "error", true);
    } finally {
      submission.isSaving = false;
    }
  }

  function createReviewAnswer(label, option) {
    const groupElement = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerMath = document.createElement("span");
    groupElement.className = "result-review-answer";
    answerLabel.textContent = label;
    answerMath.className = "result-review-answer-math";
    answerMath.innerHTML = option.mathml;
    groupElement.append(answerLabel, answerMath);
    return groupElement;
  }

  function createReviewItem(question, index) {
    const selectedOption = getOptionByValue(question, sessionAnswers[index]);
    const isCorrect = selectedOption.value === question.answer.value;
    const item = document.createElement("article");
    const topLine = document.createElement("div");
    const numberLabel = document.createElement("p");
    const status = document.createElement("p");
    const expression = document.createElement("div");
    const answers = document.createElement("div");
    item.className = "result-review-item";
    item.dataset.state = isCorrect ? "correct" : "incorrect";
    topLine.className = "result-review-item-topline";
    numberLabel.className = "result-review-number";
    numberLabel.textContent = `Soal ${index + 1}`;
    status.className = "result-review-status";
    status.textContent = isCorrect ? "Benar" : "Perlu ditinjau";
    expression.className = "result-review-expression";
    expression.innerHTML = question.mathml;
    expression.setAttribute("aria-label", question.label);
    answers.className = "result-review-answers";
    answers.append(createReviewAnswer("Jawabanmu", selectedOption));
    if (!isCorrect) answers.append(createReviewAnswer("Jawaban benar", question.answer));
    topLine.append(numberLabel, status);
    item.append(topLine, expression, answers);
    return item;
  }

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    const correct = sessionQuestions.reduce(function (total, question, index) { return total + Number(sessionAnswers[index] === question.answer.value); }, 0);
    const result = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      correct: correct,
      incorrect: exercise.totalQuestions - correct,
      total: exercise.totalQuestions,
      score: Math.min(100, correct * 10)
    };
    currentSubmission = { result: result, isSaving: false, isSaved: false };
    document.getElementById("final-score").textContent = result.score;
    document.getElementById("correct-count").textContent = result.correct;
    document.getElementById("incorrect-count").textContent = result.incorrect;
    document.getElementById("total-count").textContent = result.total;
    document.getElementById("result-summary").textContent = `Kamu menjawab ${result.correct} dari ${result.total} soal dengan benar.`;
    progressBar.style.width = "100%";
    resultReviewList.replaceChildren(...sessionQuestions.map(createReviewItem));
    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function startExercise() {
    sessionQuestions = window.MathPractice.shuffle(questionBank).slice(0, exercise.totalQuestions);
    sessionOptions = sessionQuestions.map(function (question) { return window.MathPractice.shuffle(getQuestionOptions(question)); });
    sessionAnswers = Array(exercise.totalQuestions).fill("");
    currentQuestionIndex = 0;
    hasFinishedSession = false;
    currentSubmission = null;
    setSaveStatus("", "idle", false);
    window.MathPractice.showOnly(quizScreen, screens);
    renderQuestion(false);
  }

  window.MathPractice.startBasicAlgebraExercise = startExercise;
  window.MathPractice.showPreviousBasicAlgebraQuestion = showPreviousQuestion;
  window.MathPractice.showNextBasicAlgebraQuestion = showNextQuestion;
  window.MathPractice.retryBasicAlgebraResult = saveCurrentResult;
})();
