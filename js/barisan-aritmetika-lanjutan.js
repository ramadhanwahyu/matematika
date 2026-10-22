(function () {
  "use strict";

  const exercise = { id: "barisan_aritmetika_lanjutan_01", name: "Barisan Aritmetika Lanjutan", totalQuestions: 10 };
  const questionBank = [
    { prompt: "Suku ke-9 suatu barisan aritmetika adalah 60, sedangkan suku ke-11 adalah 70. Berapa suku pertamanya?", answer: "20", distractors: ["10", "15", "25"] },
    { prompt: "Suku ke-4 suatu barisan aritmetika adalah 17 dan suku ke-10 adalah 41. Tentukan beda barisan tersebut.", answer: "4", distractors: ["3", "6", "7"] },
    { prompt: "Suku ke-6 suatu barisan aritmetika adalah 32 dan suku ke-13 adalah 4. Tentukan suku pertama dan beda barisan tersebut.", answer: "52 dan −4", distractors: ["48 dan −4", "52 dan 4", "56 dan −3"] },
    { prompt: "Suku ke-3 suatu barisan aritmetika adalah 14 dan suku ke-8 adalah 39. Berapa suku pertamanya?", answer: "4", distractors: ["−1", "9", "14"] },
    { prompt: "Suku ke-5 suatu barisan aritmetika adalah 7 dan suku ke-12 adalah 35. Tentukan beda dan suku pertama barisan tersebut.", answer: "Beda 4, suku pertama −9", distractors: ["Beda 4, suku pertama −5", "Beda 3, suku pertama −5", "Beda 7, suku pertama −21"] },
    { prompt: "Suku ke-7 suatu barisan aritmetika adalah −8, sedangkan suku ke-12 adalah 12. Tentukan beda barisan tersebut.", answer: "4", distractors: ["−4", "5", "20"] },
    { prompt: "Diketahui barisan 2, 5, 8, 11, …. Bilangan 92 merupakan suku ke berapa?", answer: "Suku ke-31", distractors: ["Suku ke-30", "Suku ke-32", "Suku ke-33"] },
    { prompt: "Diketahui barisan 50, 44, 38, 32, …. Bilangan −10 merupakan suku ke berapa?", answer: "Suku ke-11", distractors: ["Suku ke-10", "Suku ke-12", "Suku ke-13"] },
    { prompt: "Suku pertama suatu barisan aritmetika adalah 7 dan bedanya 4. Pada suku ke berapakah nilai 63 muncul?", answer: "Suku ke-15", distractors: ["Suku ke-14", "Suku ke-16", "Suku ke-17"] },
    { prompt: "Diketahui barisan −15, −10, −5, 0, …. Bilangan 70 merupakan suku ke berapa?", answer: "Suku ke-18", distractors: ["Suku ke-17", "Suku ke-16", "Suku ke-19"] },
    { prompt: "Suku pertama suatu barisan aritmetika adalah 100 dan bedanya −7. Bilangan 23 merupakan suku ke berapa?", answer: "Suku ke-12", distractors: ["Suku ke-11", "Suku ke-13", "Suku ke-14"] },
    { prompt: "Diketahui barisan 3, 8, 13, 18, …. Bilangan 78 merupakan suku ke berapa?", answer: "Suku ke-16", distractors: ["Suku ke-15", "Suku ke-17", "Suku ke-18"] },
    { prompt: "Sisipkan 3 bilangan di antara 8 dan 28 agar terbentuk barisan aritmetika. Bilangan yang disisipkan adalah …. ", answer: "13, 18, 23", distractors: ["12, 16, 20", "10, 15, 20", "12, 17, 22"] },
    { prompt: "Sisipkan 4 bilangan di antara −6 dan 19 agar seluruh bilangan membentuk barisan aritmetika. Bilangan yang disisipkan adalah …. ", answer: "−1, 4, 9, 14", distractors: ["−2, 3, 8, 13", "−1, 5, 11, 17", "0, 5, 10, 15"] },
    { prompt: "Lengkapi barisan aritmetika berikut: 5, __, 17, __, 29.", answer: "11 dan 23", distractors: ["10 dan 22", "12 dan 24", "11 dan 24"] },
    { prompt: "Di antara 12 dan 42 disisipkan beberapa bilangan sehingga terbentuk barisan aritmetika dengan beda 5. Berapa banyak bilangan yang disisipkan?", answer: "5 bilangan", distractors: ["4 bilangan", "6 bilangan", "7 bilangan"] },
    { prompt: "Tiga bilangan membentuk barisan aritmetika. Bilangan pertama 11 dan bilangan ketiga 35. Berapa bilangan di antaranya?", answer: "23", distractors: ["21", "22", "24"] },
    { prompt: "Empat bilangan membentuk barisan aritmetika. Bilangan pertama −2 dan bilangan terakhir 19. Tentukan dua bilangan di antaranya.", answer: "5 dan 12", distractors: ["4 dan 11", "5 dan 13", "6 dan 13"] },
    { prompt: "Dalam suatu barisan aritmetika, suku ke-5 adalah 23 dan suku ke-9 adalah 43. Tentukan selisih suku ke-15 dan suku ke-10.", answer: "25", distractors: ["20", "30", "35"] },
    { prompt: "Suku ke-4 suatu barisan aritmetika adalah 18. Jika bedanya 6, tentukan suku ke-9.", answer: "48", distractors: ["42", "45", "54"] },
    { prompt: "Suku ke-3 suatu barisan aritmetika adalah 14 dan suku ke-8 adalah 39. Tentukan suku ke-12.", answer: "59", distractors: ["54", "56", "64"] },
    { prompt: "Suku ke-6 suatu barisan aritmetika adalah 31. Berapa nilai suku ke-5 ditambah suku ke-7?", answer: "62", distractors: ["56", "60", "64"] },
    { prompt: "Suku ke-4 suatu barisan aritmetika adalah 20. Tentukan jumlah nilai suku ke-2 dan suku ke-6.", answer: "40", distractors: ["36", "38", "42"] },
    { prompt: "Suku ke-3 dan suku ke-7 suatu barisan aritmetika berturut-turut adalah 16 dan 36. Tentukan suku ke-5.", answer: "26", distractors: ["21", "24", "28"] },
    { prompt: "Tinggi sebuah tanaman pada minggu pertama adalah 12 cm. Setiap minggu tingginya bertambah dengan selisih tetap. Jika pada minggu ke-5 tingginya 28 cm, berapa pertambahan tinggi setiap minggu?", answer: "4 cm", distractors: ["3 cm", "5 cm", "6 cm"] },
    { prompt: "Tinggi anak tangga ke-3 adalah 40 cm dari tanah, sedangkan tinggi anak tangga ke-8 adalah 115 cm. Jika tinggi anak tangga membentuk barisan aritmetika, berapa tinggi anak tangga pertama dari tanah?", answer: "10 cm", distractors: ["15 cm", "25 cm", "30 cm"] },
    { prompt: "Pada baris pertama sebuah aula terdapat 5 kursi. Setiap baris berikutnya memiliki 4 kursi lebih banyak daripada baris sebelumnya. Berapa jumlah kursi pada baris ke-12?", answer: "49 kursi", distractors: ["45 kursi", "48 kursi", "53 kursi"] },
    { prompt: "Tinggi anak tangga pertama dari lantai adalah 18 cm. Tinggi anak tangga ke-6 adalah 108 cm. Jika tinggi tiap anak tangga membentuk barisan aritmetika, berapa tinggi anak tangga ke-10 dari lantai?", answer: "180 cm", distractors: ["162 cm", "171 cm", "198 cm"] },
    { prompt: "Sebuah pola ubin memiliki 7 ubin pada susunan pertama. Setiap susunan berikutnya memiliki 3 ubin lebih banyak daripada susunan sebelumnya. Berapa banyak ubin pada susunan ke-15?", answer: "49 ubin", distractors: ["46 ubin", "48 ubin", "52 ubin"] },
    { prompt: "Dalam suatu barisan aritmetika, suku ke-4 adalah 22 dan suku ke-9 adalah 47. Tentukan suku ke-15.", answer: "77", distractors: ["72", "75", "82"] }
  ];

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const screens = [startScreen, quizScreen, resultScreen];
  const questionProgress = document.getElementById("question-progress");
  const scoreProgress = document.getElementById("score-progress");
  const progressBar = document.getElementById("progress-bar");
  const questionPrompt = document.getElementById("question-prompt");
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
    window.location.replace("../student.html?next=latihan/barisan-aritmetika-lanjutan.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

  function createSessionQuestions() {
    return window.MathPractice.shuffle(questionBank).slice(0, exercise.totalQuestions);
  }

  function createOptionButton(option, index, selectedValue) {
    const button = document.createElement("button");
    const key = document.createElement("span");
    const value = document.createElement("span");
    const letter = String.fromCharCode(65 + index);
    button.className = "exponent-option";
    button.type = "button";
    button.classList.toggle("is-selected", selectedValue === option);
    button.setAttribute("aria-label", `Pilihan ${letter}: ${option}`);
    button.setAttribute("aria-pressed", String(selectedValue === option));
    key.className = "exponent-option-key";
    key.textContent = letter;
    value.className = "exponent-option-value";
    value.textContent = option;
    button.append(key, value);
    button.addEventListener("click", function () { selectAnswer(option); });
    return button;
  }

  function renderQuestion(focusSelectedOption) {
    const question = sessionQuestions[currentQuestionIndex];
    const selectedValue = sessionAnswers[currentQuestionIndex];
    questionProgress.textContent = `Soal ${currentQuestionIndex + 1} dari ${exercise.totalQuestions}`;
    scoreProgress.textContent = selectedValue ? "Jawaban tersimpan" : "Pilih satu jawaban";
    progressBar.style.width = `${(currentQuestionIndex / exercise.totalQuestions) * 100}%`;
    questionPrompt.textContent = "Baca soal berikut, lalu pilih jawaban yang tepat.";
    questionExpression.textContent = question.prompt;
    answerOptions.replaceChildren(...sessionOptions[currentQuestionIndex].map(function (option, index) {
      return createOptionButton(option, index, selectedValue);
    }));
    previousButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = !selectedValue;
    nextButton.textContent = currentQuestionIndex === exercise.totalQuestions - 1 ? "Lihat hasil" : "Soal berikutnya →";
    const target = focusSelectedOption && selectedValue
      ? answerOptions.querySelector('[aria-pressed="true"]')
      : answerOptions.querySelector("button");
    target.focus();
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

  function createReviewItem(question, index) {
    const item = document.createElement("article");
    const topLine = document.createElement("div");
    const number = document.createElement("p");
    const status = document.createElement("p");
    const prompt = document.createElement("p");
    const answer = document.createElement("p");
    const isCorrect = sessionAnswers[index] === question.answer;
    item.className = "result-review-item";
    item.dataset.state = isCorrect ? "correct" : "incorrect";
    topLine.className = "result-review-item-topline";
    number.className = "result-review-number";
    number.textContent = `Soal ${index + 1}`;
    status.className = "result-review-status";
    status.textContent = isCorrect ? "Benar" : "Perlu ditinjau";
    prompt.className = "result-review-expression story-review-expression";
    prompt.textContent = question.prompt;
    answer.className = isCorrect ? "result-review-answer-value" : "result-review-correction";
    answer.textContent = isCorrect ? `Jawabanmu: ${sessionAnswers[index]}` : `Jawabanmu: ${sessionAnswers[index]} · Jawaban benar: ${question.answer}`;
    topLine.append(number, status);
    item.append(topLine, prompt, answer);
    return item;
  }

  function finishExercise() {
    if (hasFinishedSession) return;
    hasFinishedSession = true;
    const correct = sessionQuestions.reduce((total, question, index) => total + Number(sessionAnswers[index] === question.answer), 0);
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
    sessionQuestions = createSessionQuestions();
    sessionOptions = sessionQuestions.map(function (question) {
      return window.MathPractice.shuffle([question.answer].concat(question.distractors));
    });
    sessionAnswers = [];
    currentQuestionIndex = 0;
    hasFinishedSession = false;
    currentSubmission = null;
    setSaveStatus("", "idle", false);
    window.MathPractice.showOnly(quizScreen, screens);
    renderQuestion(false);
  }

  window.MathPractice.startArithmeticAdvancedExercise = startExercise;
  window.MathPractice.showPreviousArithmeticAdvancedQuestion = showPreviousQuestion;
  window.MathPractice.showNextArithmeticAdvancedQuestion = showNextQuestion;
  window.MathPractice.retryArithmeticAdvancedResult = saveCurrentResult;
})();
