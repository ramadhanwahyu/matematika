(function () {
  "use strict";

  const exercise = {
    id: "eksponen_01",
    name: "Eksponen",
    totalQuestions: 10
  };

  // Markup di bank soal bersifat statis dan hanya dipakai untuk menampilkan notasi matematika.
  const questionBank = [
    { numerator: "(2<sup>5</sup> × 2<sup>3</sup>)", denominator: "2<sup>4</sup>", label: "(2 pangkat 5 kali 2 pangkat 3) dibagi 2 pangkat 4", answerNumerator: 16, answerDenominator: 1 },
    { numerator: "(3<sup>4</sup> × 3<sup>2</sup>)", denominator: "(3<sup>2</sup>)<sup>2</sup>", label: "(3 pangkat 4 kali 3 pangkat 2) dibagi (3 pangkat 2) pangkat 2", answerNumerator: 9, answerDenominator: 1 },
    { numerator: "(5<sup>3</sup> × 5<sup>−2</sup>)", denominator: "5<sup>−1</sup>", label: "(5 pangkat 3 kali 5 pangkat negatif 2) dibagi 5 pangkat negatif 1", answerNumerator: 25, answerDenominator: 1 },
    { numerator: "((2<sup>3</sup>)<sup>2</sup> × 2<sup>−2</sup>)", denominator: "2<sup>3</sup>", label: "((2 pangkat 3) pangkat 2 kali 2 pangkat negatif 2) dibagi 2 pangkat 3", answerNumerator: 2, answerDenominator: 1 },
    { numerator: "(3<sup>2</sup>)<sup>3</sup>", denominator: "(3<sup>4</sup> × 3<sup>−1</sup>)", label: "(3 pangkat 2) pangkat 3 dibagi (3 pangkat 4 kali 3 pangkat negatif 1)", answerNumerator: 27, answerDenominator: 1 },
    { numerator: "(2<sup>4</sup> × 4<sup>2</sup>)", denominator: "2<sup>5</sup>", label: "(2 pangkat 4 kali 4 pangkat 2) dibagi 2 pangkat 5", answerNumerator: 8, answerDenominator: 1 },
    { numerator: "(9<sup>2</sup> × 3<sup>−1</sup>)", denominator: "3<sup>2</sup>", label: "(9 pangkat 2 kali 3 pangkat negatif 1) dibagi 3 pangkat 2", answerNumerator: 3, answerDenominator: 1 },
    { numerator: "(8<sup>2</sup> × 2<sup>−3</sup>)", denominator: "2<sup>2</sup>", label: "(8 pangkat 2 kali 2 pangkat negatif 3) dibagi 2 pangkat 2", answerNumerator: 2, answerDenominator: 1 },
    { numerator: "(4<sup>3</sup> × 2<sup>−2</sup>)", denominator: "8", label: "(4 pangkat 3 kali 2 pangkat negatif 2) dibagi 8", answerNumerator: 2, answerDenominator: 1 },
    { numerator: "(27 × 3<sup>2</sup>)", denominator: "(3<sup>2</sup>)<sup>2</sup>", label: "(27 kali 3 pangkat 2) dibagi (3 pangkat 2) pangkat 2", answerNumerator: 3, answerDenominator: 1 },
    { numerator: "((2<sup>2</sup>)<sup>3</sup> × 4<sup>−1</sup>)", denominator: "2<sup>−1</sup>", label: "((2 pangkat 2) pangkat 3 kali 4 pangkat negatif 1) dibagi 2 pangkat negatif 1", answerNumerator: 32, answerDenominator: 1 },
    { numerator: "(25<sup>2</sup> × 5<sup>−3</sup>)", denominator: "5<sup>0</sup>", label: "(25 pangkat 2 kali 5 pangkat negatif 3) dibagi 5 pangkat 0", answerNumerator: 5, answerDenominator: 1 },
    { numerator: "((3<sup>3</sup>)<sup>2</sup> × 9<sup>−1</sup>)", denominator: "3<sup>2</sup>", label: "((3 pangkat 3) pangkat 2 kali 9 pangkat negatif 1) dibagi 3 pangkat 2", answerNumerator: 9, answerDenominator: 1 },
    { numerator: "(16<sup>2</sup> × 2<sup>−3</sup>)", denominator: "4<sup>2</sup>", label: "(16 pangkat 2 kali 2 pangkat negatif 3) dibagi 4 pangkat 2", answerNumerator: 2, answerDenominator: 1 },
    { numerator: "(5<sup>2</sup>)<sup>2</sup>", denominator: "(25 × 5<sup>−1</sup>)", label: "(5 pangkat 2) pangkat 2 dibagi (25 kali 5 pangkat negatif 1)", answerNumerator: 125, answerDenominator: 1 },
    { numerator: "(8<sup>2</sup> × 4<sup>−1</sup>)", denominator: "2<sup>−2</sup>", label: "(8 pangkat 2 kali 4 pangkat negatif 1) dibagi 2 pangkat negatif 2", answerNumerator: 64, answerDenominator: 1 },
    { numerator: "(9<sup>3</sup> × 3<sup>−4</sup>)", denominator: "27", label: "(9 pangkat 3 kali 3 pangkat negatif 4) dibagi 27", answerNumerator: 1, answerDenominator: 3 },
    { numerator: "((4<sup>2</sup>)<sup>2</sup> × 2<sup>−3</sup>)", denominator: "2<sup>2</sup>", label: "((4 pangkat 2) pangkat 2 kali 2 pangkat negatif 3) dibagi 2 pangkat 2", answerNumerator: 8, answerDenominator: 1 },
    { numerator: "(27<sup>2</sup> × 9<sup>−1</sup>)", denominator: "3<sup>−2</sup>", label: "(27 pangkat 2 kali 9 pangkat negatif 1) dibagi 3 pangkat negatif 2", answerNumerator: 729, answerDenominator: 1 },
    { numerator: "((2<sup>3</sup>)<sup>3</sup> × 4<sup>−2</sup>)", denominator: "2<sup>−1</sup>", label: "((2 pangkat 3) pangkat 3 kali 4 pangkat negatif 2) dibagi 2 pangkat negatif 1", answerNumerator: 64, answerDenominator: 1 }
  ];

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const answerForm = document.getElementById("answer-form");
  const answerInput = document.getElementById("answer-input");
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionExpression = document.getElementById("question-expression");
  const answerMessage = document.getElementById("answer-message");
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

  function createExponentFraction(question) {
    const fraction = document.createElement("span");
    const numerator = document.createElement("span");
    const line = document.createElement("span");
    const denominator = document.createElement("span");

    fraction.className = "exponent-fraction";
    numerator.className = "exponent-numerator";
    line.className = "exponent-fraction-line";
    denominator.className = "exponent-denominator";
    numerator.innerHTML = question.numerator;
    denominator.innerHTML = question.denominator;
    fraction.append(numerator, line, denominator);
    return fraction;
  }

  function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];
    const currentNumber = currentQuestionIndex + 1;
    questionProgress.textContent = `Soal ${currentNumber} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = "Sederhanakan dengan teliti";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionExpression.replaceChildren(createExponentFraction(question));
    questionExpression.setAttribute("aria-label", question.label);
    answerForm.reset();
    clearValidation();
    answerInput.focus();
  }

  function clearValidation() {
    answerMessage.textContent = "";
    answerInput.removeAttribute("aria-invalid");
  }

  function showValidation(message) {
    answerMessage.textContent = message;
    answerInput.setAttribute("aria-invalid", "true");
    answerInput.focus();
  }

  function readAnswer() {
    const answerText = answerInput.value.trim();
    const fractionPattern = /^([+-]?\d+)(?:\s*\/\s*([+-]?\d+))?$/;
    const match = answerText.match(fractionPattern);

    if (!answerText) {
      showValidation("Masukkan jawaban terlebih dahulu.");
      return null;
    }
    if (!match) {
      showValidation("Gunakan bilangan bulat atau pecahan, misalnya 8 atau 1/3.");
      return null;
    }

    let numerator = BigInt(match[1]);
    let denominator = BigInt(match[2] || "1");
    if (denominator === 0n) {
      showValidation("Penyebut pecahan tidak boleh bernilai 0.");
      return null;
    }
    if (denominator < 0n) {
      numerator = -numerator;
      denominator = -denominator;
    }
    return { numerator: numerator, denominator: denominator };
  }

  function isCorrectAnswer(answer, question) {
    return answer.numerator * BigInt(question.answerDenominator) === BigInt(question.answerNumerator) * answer.denominator;
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

  answerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (hasFinishedSession) return;
    clearValidation();
    const answer = readAnswer();
    if (!answer) return;

    if (isCorrectAnswer(answer, sessionQuestions[currentQuestionIndex])) {
      correctAnswers += 1;
    }

    currentQuestionIndex += 1;
    if (currentQuestionIndex === exercise.totalQuestions) {
      finishExercise();
      return;
    }
    renderQuestion();
  });

  window.MathPractice.startExponentExercise = startExercise;
  window.MathPractice.retryExponentResult = saveCurrentResult;
})();
