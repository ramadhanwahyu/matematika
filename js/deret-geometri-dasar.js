(function () {
  "use strict";

  const exercise = {
    id: "deret_geometri_dasar_01",
    name: "Deret Geometri Dasar",
    totalQuestions: 10,
    durationSeconds: 10 * 60
  };

  const questionBank = [
    { firstTerm: 2, ratioNumerator: 2, ratioDenominator: 1, termCount: 9 },
    { firstTerm: 3, ratioNumerator: 2, ratioDenominator: 1, termCount: 6 },
    { firstTerm: 4, ratioNumerator: 2, ratioDenominator: 1, termCount: 8 },
    { firstTerm: 5, ratioNumerator: 2, ratioDenominator: 1, termCount: 8 },
    { firstTerm: 1, ratioNumerator: 2, ratioDenominator: 1, termCount: 7 },
    { firstTerm: 6, ratioNumerator: 2, ratioDenominator: 1, termCount: 8 },
    { firstTerm: 2, ratioNumerator: 3, ratioDenominator: 1, termCount: 5 },
    { firstTerm: 3, ratioNumerator: 3, ratioDenominator: 1, termCount: 5 },
    { firstTerm: 4, ratioNumerator: 3, ratioDenominator: 1, termCount: 6 },
    { firstTerm: 5, ratioNumerator: 3, ratioDenominator: 1, termCount: 5 },
    { firstTerm: 2, ratioNumerator: 4, ratioDenominator: 1, termCount: 4 },
    { firstTerm: 3, ratioNumerator: 4, ratioDenominator: 1, termCount: 4 },
    { firstTerm: 1, ratioNumerator: 5, ratioDenominator: 1, termCount: 5 },
    { firstTerm: 2, ratioNumerator: 5, ratioDenominator: 1, termCount: 4 },
    { firstTerm: 4, ratioNumerator: 5, ratioDenominator: 1, termCount: 4 },
    { firstTerm: 3, ratioNumerator: 5, ratioDenominator: 1, termCount: 4 },
    { firstTerm: 64, ratioNumerator: 1, ratioDenominator: 2, termCount: 6 },
    { firstTerm: 96, ratioNumerator: 1, ratioDenominator: 2, termCount: 5 },
    { firstTerm: 160, ratioNumerator: 1, ratioDenominator: 2, termCount: 6 },
    { firstTerm: 128, ratioNumerator: 1, ratioDenominator: 2, termCount: 5 },
    { firstTerm: 48, ratioNumerator: 1, ratioDenominator: 2, termCount: 5 },
    { firstTerm: 80, ratioNumerator: 1, ratioDenominator: 2, termCount: 8 },
    { firstTerm: 24, ratioNumerator: 1, ratioDenominator: 2, termCount: 8 },
    { firstTerm: 200, ratioNumerator: 1, ratioDenominator: 2, termCount: 8 },
    { firstTerm: 72, ratioNumerator: 1, ratioDenominator: 2, termCount: 8 },
    { firstTerm: 81, ratioNumerator: 1, ratioDenominator: 3, termCount: 5 },
    { firstTerm: 162, ratioNumerator: 1, ratioDenominator: 3, termCount: 6 },
    { firstTerm: 243, ratioNumerator: 1, ratioDenominator: 3, termCount: 5 },
    { firstTerm: 54, ratioNumerator: 1, ratioDenominator: 3, termCount: 6 },
    { firstTerm: 324, ratioNumerator: 1, ratioDenominator: 3, termCount: 4 }
  ];

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionExpression = document.getElementById("question-expression");
  const questionSumPrompt = document.getElementById("question-sum-prompt");
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
    window.location.replace("../student.html?next=latihan/deret-geometri-dasar.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function gcd(left, right) {
    let a = Math.abs(left);
    let b = Math.abs(right);
    while (b) [a, b] = [b, a % b];
    return a || 1;
  }

  function fraction(numerator, denominator) {
    const divisor = gcd(numerator, denominator);
    const sign = denominator < 0 ? -1 : 1;
    return { numerator: (numerator / divisor) * sign, denominator: Math.abs(denominator / divisor) };
  }

  function addFractions(left, right) {
    return fraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
  }

  function multiplyFractions(left, right) {
    return fraction(left.numerator * right.numerator, left.denominator * right.denominator);
  }

  function fractionKey(value) {
    return `${value.numerator}/${value.denominator}`;
  }

  function formatFraction(value) {
    const whole = Math.floor(value.numerator / value.denominator);
    const remainder = value.numerator % value.denominator;
    if (!remainder) return new Intl.NumberFormat("id-ID").format(whole);
    if (!whole) return `${remainder}/${value.denominator}`;
    return `${new Intl.NumberFormat("id-ID").format(whole)} ${remainder}/${value.denominator}`;
  }

  function formatTerm(value) {
    return formatFraction(value);
  }

  function createQuestion(item) {
    const ratio = fraction(item.ratioNumerator, item.ratioDenominator);
    let term = fraction(item.firstTerm, 1);
    let answer = fraction(0, 1);
    const terms = [];
    for (let index = 0; index < item.termCount; index += 1) {
      answer = addFractions(answer, term);
      if (index < 4) terms.push(formatTerm(term));
      term = multiplyFractions(term, ratio);
    }
    const question = {
      terms: terms,
      termCount: item.termCount,
      answer: { value: fractionKey(answer), numerator: answer.numerator, denominator: answer.denominator, label: formatFraction(answer) },
      firstTerm: item.firstTerm
    };
    question.distractors = createDistractors(question);
    return question;
  }

  function createDistractors(question) {
    const offsets = [question.firstTerm, 2 * question.firstTerm, 3 * question.firstTerm, 5 * question.firstTerm, question.termCount, question.termCount * 2];
    const values = [];
    offsets.forEach(function (offset) {
      [offset, -offset].forEach(function (change) {
        const candidate = fraction(question.answer.numerator + change * question.answer.denominator, question.answer.denominator);
        const key = fractionKey(candidate);
        if (candidate.numerator > 0 && key !== question.answer.value && !values.some(function (option) { return option.value === key; })) {
          values.push({ value: key, label: formatFraction(candidate), numerator: candidate.numerator, denominator: candidate.denominator });
        }
      });
    });
    return values.slice(0, 3);
  }

  function getQuestionOptions(question) {
    return [question.answer].concat(question.distractors);
  }

  function getOptionByValue(question, value) {
    return getQuestionOptions(question).find(function (option) { return option.value === value; });
  }

  function createFractionElement(numerator, denominator) {
    const fractionElement = document.createElement("span");
    const numeratorElement = document.createElement("span");
    const lineElement = document.createElement("span");
    const denominatorElement = document.createElement("span");
    fractionElement.className = "math-fraction geometric-option-fraction";
    fractionElement.setAttribute("aria-hidden", "true");
    numeratorElement.className = "math-fraction-numerator";
    numeratorElement.textContent = String(numerator);
    lineElement.className = "math-fraction-line";
    lineElement.setAttribute("aria-hidden", "true");
    denominatorElement.className = "math-fraction-denominator";
    denominatorElement.textContent = String(denominator);
    fractionElement.append(numeratorElement, lineElement, denominatorElement);
    return fractionElement;
  }

  function appendNumberNotation(container, option) {
    const whole = Math.floor(option.numerator / option.denominator);
    const remainder = option.numerator % option.denominator;
    container.classList.add("geometric-mixed-number");
    if (!remainder) {
      container.textContent = new Intl.NumberFormat("id-ID").format(whole);
      return;
    }
    if (whole) {
      const wholeElement = document.createElement("span");
      wholeElement.className = "geometric-whole-number";
      wholeElement.textContent = new Intl.NumberFormat("id-ID").format(whole);
      container.append(wholeElement);
    }
    container.append(createFractionElement(remainder, option.denominator));
  }

  function getAccessibleOptionLabel(option) {
    const whole = Math.floor(option.numerator / option.denominator);
    const remainder = option.numerator % option.denominator;
    if (!remainder) return option.label;
    return whole
      ? `${whole} utuh dan ${remainder} per ${option.denominator}`
      : `${remainder} per ${option.denominator}`;
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
    button.setAttribute("aria-label", `Pilihan ${optionLetter}: ${getAccessibleOptionLabel(option)}`);
    button.setAttribute("aria-pressed", String(isSelected));
    key.className = "exponent-option-key";
    key.textContent = optionLetter;
    answerValue.className = "exponent-option-value";
    if (Number.isInteger(option.numerator) && Number.isInteger(option.denominator)) appendNumberNotation(answerValue, option);
    else answerValue.textContent = option.label;
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
    questionExpression.textContent = `${question.terms.join(", ")}, …`;
    questionExpression.setAttribute("aria-label", `Deret geometri: ${question.terms.join(", ")}, dan seterusnya`);
    questionSumPrompt.textContent = `Tentukan jumlah ${question.termCount} suku pertama (S${question.termCount}).`;
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
    timerValue.setAttribute("aria-label", `Sisa waktu ${minutes} menit ${seconds} detik`);
    if (remainingSeconds === 0) finishExercise(true);
  }

  function selectAnswer(answer) {
    if (hasFinishedSession) return;
    if (Date.now() >= deadline) {
      finishExercise(true);
      return;
    }
    sessionAnswers[currentQuestionIndex] = answer;
    renderQuestion(true);
  }

  function showPreviousQuestion() {
    if (hasFinishedSession) return;
    if (Date.now() >= deadline) {
      finishExercise(true);
      return;
    }
    if (currentQuestionIndex === 0) return;
    currentQuestionIndex -= 1;
    renderQuestion(true);
  }

  function showNextQuestion() {
    if (hasFinishedSession) return;
    if (Date.now() >= deadline) {
      finishExercise(true);
      return;
    }
    if (!sessionAnswers[currentQuestionIndex]) return;
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

  function createReviewAnswer(label, option) {
    const answerGroup = document.createElement("div");
    const answerLabel = document.createElement("p");
    const answerValue = document.createElement("span");
    answerGroup.className = "result-review-answer";
    answerLabel.textContent = label;
    answerValue.className = "result-review-answer-value";
    if (Number.isInteger(option.numerator) && Number.isInteger(option.denominator)) {
      appendNumberNotation(answerValue, option);
      answerValue.setAttribute("role", "img");
      answerValue.setAttribute("aria-label", getAccessibleOptionLabel(option));
    } else answerValue.textContent = option.label;
    answerGroup.append(answerLabel, answerValue);
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
    expression.className = "result-review-expression sequence-review-expression";
    expression.textContent = `${question.terms.join(", ")}, …; tentukan S${question.termCount}`;
    answers.className = "result-review-answers";
    if (selectedOption) answers.append(createReviewAnswer("Jawabanmu", selectedOption));
    else {
      const missing = { label: "Belum dijawab" };
      answers.append(createReviewAnswer("Jawabanmu", missing));
    }
    if (!isCorrect) answers.append(createReviewAnswer("Jawaban benar", question.answer));
    topLine.append(questionNumber, status);
    item.append(topLine, expression, answers);
    return item;
  }

  function finishExercise(timeExpired) {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    window.clearInterval(timerId);
    timerId = null;
    const correct = sessionQuestions.reduce(function (total, question, index) {
      return total + Number(sessionAnswers[index] === question.answer.value);
    }, 0);
    const result = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      correct: correct,
      incorrect: exercise.totalQuestions - correct,
      total: exercise.totalQuestions,
      score: Math.min(100, correct * 10)
    };
    currentSubmission = { result: result, isSaving: false, isSaved: false };
    document.getElementById("result-eyebrow").textContent = timeExpired ? "Waktu habis" : "Sesi selesai";
    document.getElementById("final-score").textContent = result.score;
    document.getElementById("correct-count").textContent = result.correct;
    document.getElementById("incorrect-count").textContent = result.incorrect;
    document.getElementById("total-count").textContent = result.total;
    document.getElementById("result-summary").textContent = timeExpired
      ? `Waktu sepuluh menit habis. Kamu menjawab ${result.correct} dari ${result.total} soal dengan benar.`
      : `Kamu menjawab ${result.correct} dari ${result.total} soal dengan benar.`;
    progressBar.style.width = "100%";
    resultReviewList.replaceChildren(...sessionQuestions.map(createReviewItem));
    window.MathPractice.showOnly(resultScreen, screens);
    resultScreen.querySelector("h1").focus({ preventScroll: true });
    void saveCurrentResult();
  }

  function startExercise() {
    window.clearInterval(timerId);
    sessionQuestions = window.MathPractice.shuffle(questionBank).slice(0, exercise.totalQuestions).map(createQuestion);
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

  window.MathPractice.startGeometricSeriesExercise = startExercise;
  window.MathPractice.showPreviousGeometricSeriesQuestion = showPreviousQuestion;
  window.MathPractice.showNextGeometricSeriesQuestion = showNextQuestion;
  window.MathPractice.retryGeometricSeriesResult = saveCurrentResult;
})();
