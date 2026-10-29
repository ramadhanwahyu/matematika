(function () {
  "use strict";

  const exercise = {
    id: "deret_aritmetika_dasar_01",
    name: "Deret Aritmetika Dasar",
    totalQuestions: 10,
    durationSeconds: 7 * 60
  };

  const questionBank = [
    { firstTerm: 2, difference: 3, termCount: 9 },
    { firstTerm: 1, difference: 2, termCount: 12 },
    { firstTerm: 4, difference: 4, termCount: 10 },
    { firstTerm: 3, difference: 2, termCount: 15 },
    { firstTerm: 10, difference: 3, termCount: 11 },
    { firstTerm: 2, difference: 2, termCount: 18 },
    { firstTerm: 7, difference: 5, termCount: 9 },
    { firstTerm: 5, difference: 4, termCount: 14 },
    { firstTerm: 1, difference: 5, termCount: 16 },
    { firstTerm: 12, difference: 2, termCount: 10 },
    { firstTerm: 20, difference: -2, termCount: 12 },
    { firstTerm: 15, difference: -3, termCount: 9 },
    { firstTerm: 30, difference: -3, termCount: 17 },
    { firstTerm: 8, difference: -2, termCount: 13 },
    { firstTerm: 2, difference: -2, termCount: 10 },
    { firstTerm: 11, difference: -4, termCount: 15 },
    { firstTerm: 5, difference: -3, termCount: 12 },
    { firstTerm: -2, difference: -3, termCount: 9 },
    { firstTerm: -1, difference: 3, termCount: 14 },
    { firstTerm: -10, difference: 4, termCount: 16 },
    { firstTerm: 3, difference: 3, termCount: 20 },
    { firstTerm: 1, difference: 1, termCount: 18 },
    { firstTerm: 12, difference: -2, termCount: 11 },
    { firstTerm: 4, difference: 3, termCount: 13 },
    { firstTerm: 20, difference: -3, termCount: 19 },
    { firstTerm: -3, difference: 4, termCount: 9 },
    { firstTerm: 2, difference: -2, termCount: 12 },
    { firstTerm: 5, difference: 3, termCount: 15 },
    { firstTerm: 18, difference: -3, termCount: 10 },
    { firstTerm: -4, difference: 2, termCount: 20 }
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
    window.location.replace("../student.html?next=latihan/deret-aritmetika-dasar.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function formatNumber(value) {
    return new Intl.NumberFormat("id-ID").format(value);
  }

  function createQuestion(item) {
    const lastTerm = item.firstTerm + (item.termCount - 1) * item.difference;
    const answer = (item.termCount * (item.firstTerm + lastTerm)) / 2;
    const terms = Array.from({ length: 4 }, function (_, index) {
      return item.firstTerm + index * item.difference;
    });

    return {
      firstTerm: item.firstTerm,
      difference: item.difference,
      termCount: item.termCount,
      terms: terms,
      answer: { value: String(answer), label: formatNumber(answer) },
      distractors: createDistractors(answer, item.difference, item.termCount)
    };
  }

  function createDistractors(answer, difference, termCount) {
    const offsets = [termCount * difference, termCount, difference, 1];
    const values = [];
    offsets.forEach(function (offset) {
      [answer + offset, answer - offset].forEach(function (value) {
        if (value !== answer && !values.includes(value)) values.push(value);
      });
    });
    return values.slice(0, 3).map(function (value) {
      return { value: String(value), label: formatNumber(value) };
    });
  }

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
    answerValue.textContent = option.label;
    button.append(key, answerValue);
    button.addEventListener("click", function () {
      selectAnswer(option.value);
    });
    return button;
  }

  function renderQuestion(focusSelectedOption) {
    const question = sessionQuestions[currentQuestionIndex];
    const selectedValue = sessionAnswers[currentQuestionIndex];
    questionProgress.textContent = `Soal ${currentQuestionIndex + 1} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = selectedValue ? "Jawaban tersimpan" : "Pilih satu jawaban";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.textContent = `${question.terms.join(", ")}, …`;
    questionExpression.setAttribute("aria-label", `Deret: ${question.terms.join(", ")}, dan seterusnya`);
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
    const answerValue = document.createElement("span");
    answerGroup.className = "result-review-answer";
    answerLabel.textContent = label;
    answerValue.className = "result-review-answer-value";
    answerValue.textContent = option.label;
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
    if (selectedOption) {
      answers.append(createReviewAnswer("Jawabanmu", selectedOption));
    } else {
      const missingAnswer = document.createElement("span");
      missingAnswer.className = "result-review-answer-value";
      missingAnswer.textContent = "Belum dijawab";
      const missingGroup = document.createElement("div");
      const missingLabel = document.createElement("p");
      missingGroup.className = "result-review-answer";
      missingLabel.textContent = "Jawabanmu";
      missingGroup.append(missingLabel, missingAnswer);
      answers.append(missingGroup);
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
      ? `Waktu tujuh menit habis. Kamu menjawab ${result.correct} dari ${result.total} soal dengan benar.`
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

  window.MathPractice.startArithmeticSeriesExercise = startExercise;
  window.MathPractice.showPreviousArithmeticSeriesQuestion = showPreviousQuestion;
  window.MathPractice.showNextArithmeticSeriesQuestion = showNextQuestion;
  window.MathPractice.retryArithmeticSeriesResult = saveCurrentResult;
})();
