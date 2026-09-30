(function () {
  "use strict";

  const exercise = { id: "aljabar_dasar_level_1_01", name: "Aljabar Dasar Level 1", totalQuestions: 10 };
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

  function number(value) { return value < 0 ? `<mrow><mo>−</mo><mn>${Math.abs(value)}</mn></mrow>` : `<mn>${value}</mn>`; }
  function variable(name) { return `<mi>${name}</mi>`; }
  function term(coefficient, name) { return `<mrow>${number(coefficient)}${variable(name)}</mrow>`; }
  function add(left, right) { return `<mrow>${left}<mo>+</mo>${right}</mrow>`; }
  function subtract(left, right) { return `<mrow>${left}<mo>−</mo>${right}</mrow>`; }
  function divide(numerator, denominator) { return `<mfrac><mrow>${numerator}</mrow><mrow>${denominator}</mrow></mfrac>`; }
  function equation(left, right) { return `<math display="block"><mrow>${left}<mo>=</mo>${right}</mrow></math>`; }
  function valueOption(value) { return { value: String(value), label: value < 0 ? `negatif ${Math.abs(value)}` : String(value), mathml: `<math><mrow>${number(value)}</mrow></math>` }; }

  function createQuestion(mathml, label, answer) {
    const nearbyValues = [answer - 1, answer + 1, answer + 2].filter(function (value, index, values) {
      return value !== answer && values.indexOf(value) === index;
    });
    return { mathml: mathml, label: label, answer: valueOption(answer), distractors: nearbyValues.map(valueOption) };
  }

  const questionBank = [
    createQuestion(equation(add(term(2, "a"), number(5)), number(11)), "2a tambah 5 sama dengan 11", 3),
    createQuestion(equation(subtract(term(7, "a"), number(2)), number(19)), "7a kurang 2 sama dengan 19", 3),
    createQuestion(equation(divide(variable("a"), number(7)), number(4)), "a dibagi 7 sama dengan 4", 28),
    createQuestion(equation(subtract(variable("a"), number(15)), number(-3)), "a kurang 15 sama dengan negatif 3", 12),
    createQuestion(equation(add(term(3, "x"), number(7)), number(22)), "3x tambah 7 sama dengan 22", 5),
    createQuestion(equation(subtract(term(5, "a"), number(9)), number(16)), "5a kurang 9 sama dengan 16", 5),
    createQuestion(equation(divide(variable("x"), number(6)), number(-3)), "x dibagi 6 sama dengan negatif 3", -18),
    createQuestion(equation(add(variable("x"), number(14)), number(-2)), "x tambah 14 sama dengan negatif 2", -16),
    createQuestion(equation(subtract(term(4, "a"), number(11)), number(9)), "4a kurang 11 sama dengan 9", 5),
    createQuestion(equation(add(term(8, "x"), number(3)), number(35)), "8x tambah 3 sama dengan 35", 4),
    createQuestion(equation(divide(variable("a"), number(9)), number(5)), "a dibagi 9 sama dengan 5", 45),
    createQuestion(equation(subtract(variable("a"), number(18)), number(7)), "a kurang 18 sama dengan 7", 25),
    createQuestion(equation(add(term(6, "a"), number(4)), number(-14)), "6a tambah 4 sama dengan negatif 14", -3),
    createQuestion(equation(subtract(variable("x"), number(7)), number(-20)), "x kurang 7 sama dengan negatif 20", -13),
    createQuestion(equation(subtract(term(9, "a"), number(5)), number(31)), "9a kurang 5 sama dengan 31", 4),
    createQuestion(equation(divide(variable("x"), number(8)), number(-2)), "x dibagi 8 sama dengan negatif 2", -16),
    createQuestion(equation(add(term(3, "a"), number(12)), number(0)), "3a tambah 12 sama dengan 0", -4),
    createQuestion(equation(subtract(term(2, "x"), number(7)), number(15)), "2x kurang 7 sama dengan 15", 11),
    createQuestion(equation(add(variable("a"), number(23)), number(5)), "a tambah 23 sama dengan 5", -18),
    createQuestion(equation(subtract(term(10, "a"), number(4)), number(26)), "10a kurang 4 sama dengan 26", 3),
    createQuestion(equation(divide(variable("a"), number(5)), number(-7)), "a dibagi 5 sama dengan negatif 7", -35),
    createQuestion(equation(add(term(4, "x"), number(9)), number(-7)), "4x tambah 9 sama dengan negatif 7", -4),
    createQuestion(equation(subtract(variable("a"), number(21)), number(-8)), "a kurang 21 sama dengan negatif 8", 13),
    createQuestion(equation(subtract(term(7, "a"), number(6)), number(29)), "7a kurang 6 sama dengan 29", 5),
    createQuestion(equation(add(term(5, "x"), number(15)), number(40)), "5x tambah 15 sama dengan 40", 5),
    createQuestion(equation(divide(variable("x"), number(12)), number(3)), "x dibagi 12 sama dengan 3", 36),
    createQuestion(equation(subtract(term(2, "a"), number(13)), number(-1)), "2a kurang 13 sama dengan negatif 1", 6),
    createQuestion(equation(add(variable("x"), number(19)), number(-6)), "x tambah 19 sama dengan negatif 6", -25),
    createQuestion(equation(add(term(6, "x"), number(2)), number(32)), "6x tambah 2 sama dengan 32", 5),
    createQuestion(equation(subtract(variable("x"), number(24)), number(-10)), "x kurang 24 sama dengan negatif 10", 14),
    createQuestion(equation(subtract(term(3, "a"), number(8)), number(-20)), "3a kurang 8 sama dengan negatif 20", -4),
    createQuestion(equation(divide(variable("x"), number(4)), number(-6)), "x dibagi 4 sama dengan negatif 6", -24),
    createQuestion(equation(add(term(9, "x"), number(1)), number(46)), "9x tambah 1 sama dengan 46", 5),
    createQuestion(equation(subtract(variable("a"), number(32)), number(-17)), "a kurang 32 sama dengan negatif 17", 15),
    createQuestion(equation(add(term(4, "a"), number(16)), number(0)), "4a tambah 16 sama dengan 0", -4),
    createQuestion(equation(divide(variable("x"), number(10)), number(7)), "x dibagi 10 sama dengan 7", 70),
    createQuestion(equation(subtract(term(8, "a"), number(12)), number(20)), "8a kurang 12 sama dengan 20", 4),
    createQuestion(equation(add(variable("x"), number(27)), number(9)), "x tambah 27 sama dengan 9", -18),
    createQuestion(equation(subtract(term(5, "x"), number(20)), number(-5)), "5x kurang 20 sama dengan negatif 5", 3),
    createQuestion(equation(divide(variable("x"), number(2)), number(16)), "x dibagi 2 sama dengan 16", 32)
  ];

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/aljabar-dasar-level-1.html");
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
    answerOptions.replaceChildren(...sessionOptions[currentQuestionIndex].map(function (option, index) { return createOptionButton(option, index, selectedValue); }));
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

  function updateSubmissionStatus(submission, message, state, canRetry) { if (currentSubmission === submission) setSaveStatus(message, state, canRetry); }

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
    const group = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerMath = document.createElement("span");
    group.className = "result-review-answer";
    answerLabel.textContent = label;
    answerMath.className = "result-review-answer-math";
    answerMath.innerHTML = option.mathml;
    group.append(answerLabel, answerMath);
    return group;
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
    const result = { exercise_id: exercise.id, exercise_name: exercise.name, correct: correct, incorrect: exercise.totalQuestions - correct, total: exercise.totalQuestions, score: Math.min(100, correct * 10) };
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

  window.MathPractice.startBasicAlgebraLevelOneExercise = startExercise;
  window.MathPractice.showPreviousBasicAlgebraLevelOneQuestion = showPreviousQuestion;
  window.MathPractice.showNextBasicAlgebraLevelOneQuestion = showNextQuestion;
  window.MathPractice.retryBasicAlgebraLevelOneResult = saveCurrentResult;
})();
