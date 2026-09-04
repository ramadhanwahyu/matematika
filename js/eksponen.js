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

  // Setiap soal membawa empat hasil unik: satu jawaban benar dan tiga pengalih yang masuk akal.
  const questionBank = [
    { mathml: fraction(multiply(power(2, 5), power(2, 3)), power(2, 4)), label: "(2 pangkat 5 kali 2 pangkat 3) dibagi 2 pangkat 4", answer: "16", distractors: ["8", "32", "4"] },
    { mathml: fraction(multiply(power(3, 4), power(3, 2)), power(group(power(3, 2)), 2)), label: "(3 pangkat 4 kali 3 pangkat 2) dibagi (3 pangkat 2) pangkat 2", answer: "9", distractors: ["3", "27", "1"] },
    { mathml: fraction(multiply(power(5, 3), power(5, -2)), power(5, -1)), label: "(5 pangkat 3 kali 5 pangkat negatif 2) dibagi 5 pangkat negatif 1", answer: "25", distractors: ["5", "125", "1"] },
    { mathml: fraction(multiply(power(group(power(2, 3)), 2), power(2, -2)), power(2, 3)), label: "((2 pangkat 3) pangkat 2 kali 2 pangkat negatif 2) dibagi 2 pangkat 3", answer: "2", distractors: ["4", "8", "1"] },
    { mathml: fraction(power(group(power(3, 2)), 3), group(multiply(power(3, 4), power(3, -1)))), label: "(3 pangkat 2) pangkat 3 dibagi (3 pangkat 4 kali 3 pangkat negatif 1)", answer: "27", distractors: ["9", "81", "3"] },
    { mathml: fraction(multiply(power(2, 4), power(4, 2)), power(2, 5)), label: "(2 pangkat 4 kali 4 pangkat 2) dibagi 2 pangkat 5", answer: "8", distractors: ["4", "16", "2"] },
    { mathml: fraction(multiply(power(9, 2), power(3, -1)), power(3, 2)), label: "(9 pangkat 2 kali 3 pangkat negatif 1) dibagi 3 pangkat 2", answer: "3", distractors: ["1", "9", "27"] },
    { mathml: fraction(multiply(power(8, 2), power(2, -3)), power(2, 2)), label: "(8 pangkat 2 kali 2 pangkat negatif 3) dibagi 2 pangkat 2", answer: "2", distractors: ["4", "8", "1"] },
    { mathml: fraction(multiply(power(4, 3), power(2, -2)), number(8)), label: "(4 pangkat 3 kali 2 pangkat negatif 2) dibagi 8", answer: "2", distractors: ["4", "8", "1"] },
    { mathml: fraction(multiply(number(27), power(3, 2)), power(group(power(3, 2)), 2)), label: "(27 kali 3 pangkat 2) dibagi (3 pangkat 2) pangkat 2", answer: "3", distractors: ["1", "9", "27"] },
    { mathml: fraction(multiply(power(group(power(2, 2)), 3), power(4, -1)), power(2, -1)), label: "((2 pangkat 2) pangkat 3 kali 4 pangkat negatif 1) dibagi 2 pangkat negatif 1", answer: "32", distractors: ["16", "64", "8"] },
    { mathml: fraction(multiply(power(25, 2), power(5, -3)), power(5, 0)), label: "(25 pangkat 2 kali 5 pangkat negatif 3) dibagi 5 pangkat 0", answer: "5", distractors: ["1", "25", "125"] },
    { mathml: fraction(multiply(power(group(power(3, 3)), 2), power(9, -1)), power(3, 2)), label: "((3 pangkat 3) pangkat 2 kali 9 pangkat negatif 1) dibagi 3 pangkat 2", answer: "9", distractors: ["3", "27", "81"] },
    { mathml: fraction(multiply(power(16, 2), power(2, -3)), power(4, 2)), label: "(16 pangkat 2 kali 2 pangkat negatif 3) dibagi 4 pangkat 2", answer: "2", distractors: ["4", "8", "1"] },
    { mathml: fraction(power(group(power(5, 2)), 2), group(multiply(number(25), power(5, -1)))), label: "(5 pangkat 2) pangkat 2 dibagi (25 kali 5 pangkat negatif 1)", answer: "125", distractors: ["25", "625", "5"] },
    { mathml: fraction(multiply(power(8, 2), power(4, -1)), power(2, -2)), label: "(8 pangkat 2 kali 4 pangkat negatif 1) dibagi 2 pangkat negatif 2", answer: "64", distractors: ["16", "32", "128"] },
    { mathml: fraction(multiply(power(9, 3), power(3, -4)), number(27)), label: "(9 pangkat 3 kali 3 pangkat negatif 4) dibagi 27", answer: "1/3", distractors: ["1/9", "3", "1/27"] },
    { mathml: fraction(multiply(power(group(power(4, 2)), 2), power(2, -3)), power(2, 2)), label: "((4 pangkat 2) pangkat 2 kali 2 pangkat negatif 3) dibagi 2 pangkat 2", answer: "8", distractors: ["4", "16", "2"] },
    { mathml: fraction(multiply(power(27, 2), power(9, -1)), power(3, -2)), label: "(27 pangkat 2 kali 9 pangkat negatif 1) dibagi 3 pangkat negatif 2", answer: "729", distractors: ["81", "243", "2187"] },
    { mathml: fraction(multiply(power(group(power(2, 3)), 3), power(4, -2)), power(2, -1)), label: "((2 pangkat 3) pangkat 3 kali 4 pangkat negatif 2) dibagi 2 pangkat negatif 1", answer: "64", distractors: ["32", "128", "16"] }
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
  const saveStatus = document.getElementById("save-status");
  const retrySaveButton = document.getElementById("retry-save-button");
  const studentSummary = document.getElementById("student-summary");

  let sessionQuestions = [];
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
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

  function createMathElement(tagName, text) {
    const element = document.createElementNS(mathNamespace, tagName);
    if (text) element.textContent = text;
    return element;
  }

  function createAnswerMath(answer) {
    const math = createMathElement("math");
    const [numerator, denominator] = answer.split("/");

    math.setAttribute("aria-hidden", "true");
    if (!denominator) {
      math.append(createMathElement("mn", numerator));
      return math;
    }

    const answerFraction = createMathElement("mfrac");
    answerFraction.append(createMathElement("mn", numerator), createMathElement("mn", denominator));
    math.append(answerFraction);
    return math;
  }

  function createOptionButton(answer, index, question) {
    const option = document.createElement("button");
    const key = document.createElement("span");
    const answerValue = document.createElement("span");
    const optionLetter = String.fromCharCode(65 + index);

    option.className = "exponent-option";
    option.type = "button";
    option.setAttribute("aria-label", `Pilihan ${optionLetter}: ${answer}`);
    key.className = "exponent-option-key";
    key.textContent = optionLetter;
    answerValue.className = "exponent-option-value";
    answerValue.append(createAnswerMath(answer));
    option.append(key, answerValue);
    option.addEventListener("click", function () {
      submitAnswer(answer, question);
    });
    return option;
  }

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    const currentNumber = currentQuestionIndex + 1;
    const options = window.MathPractice.shuffle([question.answer].concat(question.distractors));

    questionProgress.textContent = `Soal ${currentNumber} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = "Pilih satu jawaban";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.innerHTML = question.mathml;
    questionExpression.setAttribute("aria-label", question.label);
    answerOptions.replaceChildren(...options.map(function (answer, index) {
      return createOptionButton(answer, index, question);
    }));
    answerOptions.querySelector("button").focus();
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

    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function submitAnswer(answer, question) {
    if (hasFinishedSession) return;
    if (answer === question.answer) correctAnswers += 1;

    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) {
      finishExercise();
      return;
    }
    renderQuestion();
  }

  function startExercise() {
    sessionQuestions = createSessionQuestions();
    currentQuestionIndex = 0;
    correctAnswers = 0;
    hasFinishedSession = false;
    currentSubmission = null;
    setSaveStatus("", "idle", false);
    window.MathPractice.showOnly(quizScreen, screens);
    renderQuestion();
  }

  window.MathPractice.startExponentExercise = startExercise;
  window.MathPractice.retryExponentResult = saveCurrentResult;
})();
