(function () {
  "use strict";

  const exercise = {
    id: "soal_cerita_aljabar_level_1_01",
    name: "Soal Cerita Aljabar - Level 1",
    totalQuestions: 10
  };

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

  function formatNumber(value) {
    return new Intl.NumberFormat("id-ID").format(value);
  }

  function answerOption(value, unit) {
    const formattedValue = unit === "rupiah" ? `Rp${formatNumber(value)}` : formatNumber(value);
    return {
      value: String(value),
      label: formattedValue,
      mathml: `<math><mrow><mtext>${formattedValue}</mtext></mrow></math>`
    };
  }

  function createQuestion(title, story, answer, distractors, unit) {
    return {
      title: title,
      story: story,
      answer: answerOption(answer, unit),
      distractors: distractors.map(function (value) { return answerOption(value, unit); })
    };
  }

  const questionBank = [
    createQuestion("Permen Budi", "Budi membeli 2 bungkus permen dengan jumlah isi yang sama. Setelah memakan 5 butir permen, ia masih memiliki 43 butir permen. Berapa banyak permen dalam setiap bungkus?", 24, [19, 21, 26]),
    createQuestion("Buku Siti", "Siti memiliki sejumlah buku. Setelah membeli 8 buku lagi, jumlah bukunya menjadi 27 buku. Berapa banyak buku yang dimiliki Siti sebelum membeli buku tambahan?", 19, [17, 20, 35]),
    createQuestion("Uang Saku Andi", "Andi memiliki sejumlah uang. Setelah mendapat tambahan Rp12.000 dari ibunya, uangnya menjadi Rp35.000. Berapa uang Andi sebelum menerima tambahan tersebut?", 23000, [17000, 23000 - 5000, 35000], "rupiah"),
    createQuestion("Pensil di Kelas", "Di sebuah kotak terdapat sejumlah pensil. Setelah 9 pensil dibagikan kepada siswa, tersisa 16 pensil. Berapa banyak pensil di dalam kotak sebelum dibagikan?", 25, [7, 18, 27]),
    createQuestion("Tabungan Rina", "Rina memiliki tabungan sejumlah tertentu. Setelah menggunakan Rp15.000 untuk membeli alat tulis, tabungannya tersisa Rp25.000. Berapa jumlah tabungan Rina sebelum digunakan?", 40000, [10000, 30000, 45000], "rupiah"),
    createQuestion("Kue Buatan Ibu", "Ibu membuat 3 loyang kue dengan jumlah kue yang sama pada setiap loyang. Setelah 6 kue dimakan, tersisa 39 kue. Berapa banyak kue dalam setiap loyang?", 15, [11, 13, 17]),
    createQuestion("Kelereng Dodi", "Dodi memiliki sejumlah kelereng. Ia memberikan 12 kelereng kepada adiknya, lalu masih memiliki 28 kelereng. Berapa banyak kelereng Dodi sebelum diberikan kepada adiknya?", 40, [16, 38, 42]),
    createQuestion("Stiker Lina", "Lina memiliki 3 lembar stiker dengan jumlah stiker yang sama pada setiap lembar. Setelah memberikan 4 stiker kepada temannya, ia masih memiliki 23 stiker. Berapa banyak stiker pada setiap lembar?", 9, [7, 8, 10]),
    createQuestion("Uang Belanja Ibu", "Ibu membawa sejumlah uang ke pasar. Setelah membeli sayuran seharga Rp18.000, uangnya tersisa Rp32.000. Berapa uang yang dibawa Ibu sebelum berbelanja?", 50000, [14000, 32000, 56000], "rupiah"),
    createQuestion("Buku Perpustakaan", "Sebuah rak berisi sejumlah buku. Setelah ditambahkan 15 buku, jumlah buku di rak menjadi 52. Berapa banyak buku di rak sebelum penambahan?", 37, [27, 38, 67]),
    createQuestion("Kotak Pensil", "Harga sebuah kotak pensil adalah x rupiah. Jika harga 4 kotak pensil yang sama adalah Rp48.000, berapa harga satu kotak pensil?", 12000, [8000, 10000, 16000], "rupiah"),
    createQuestion("Paket Roti", "Sebuah toko memiliki 5 paket roti dengan jumlah roti yang sama dalam setiap paket. Jika seluruhnya berjumlah 40 roti, berapa banyak roti dalam satu paket?", 8, [5, 10, 12]),
    createQuestion("Harga Buku Tulis", "Harga 3 buku tulis yang sama adalah Rp21.000. Berapa harga satu buku tulis?", 7000, [5000, 6000, 9000], "rupiah"),
    createQuestion("Botol Air Mineral", "Sebuah kardus berisi 6 botol air mineral dengan volume yang sama. Jika jumlah air dalam seluruh botol adalah 12 liter, berapa liter volume air dalam satu botol?", 2, [1, 3, 6]),
    createQuestion("Pembagian Jeruk", "Pak Hasan memiliki sejumlah jeruk. Jeruk tersebut dibagikan sama rata kepada 4 anak sehingga setiap anak mendapat 7 jeruk. Berapa jumlah jeruk Pak Hasan semula?", 28, [11, 24, 32]),
    createQuestion("Tiket Pertunjukan", "Sebuah keluarga membeli 5 tiket pertunjukan dengan harga yang sama. Total harga seluruh tiket adalah Rp75.000. Berapa harga satu tiket?", 15000, [10000, 12000, 18000], "rupiah"),
    createQuestion("Paket Buku", "Sebuah toko menyusun buku ke dalam 6 paket. Setiap paket berisi jumlah buku yang sama. Jika seluruhnya terdapat 54 buku, berapa banyak buku dalam satu paket?", 9, [6, 8, 12]),
    createQuestion("Harga Kue", "Harga 4 potong kue yang sama adalah Rp20.000. Berapa harga satu potong kue?", 5000, [4000, 4500, 6000], "rupiah"),
    createQuestion("Kotak Telur", "Seorang pedagang memiliki 48 butir telur. Ia memasukkan telur tersebut ke dalam beberapa kotak, dengan setiap kotak berisi 6 butir telur. Berapa kotak yang diperlukan?", 8, [6, 7, 9]),
    createQuestion("Uang untuk Bersedekah", "Sejumlah uang dibagikan sama rata kepada 5 orang. Setiap orang menerima Rp8.000. Berapa jumlah uang yang dibagikan?", 40000, [1600, 32000, 45000], "rupiah"),
    createQuestion("Umur Kakak", "Umur kakak 5 tahun lebih tua daripada umur adiknya. Jika umur kakak sekarang 17 tahun, berapa umur adiknya?", 12, [10, 13, 22]),
    createQuestion("Umur Ayah", "Umur ayah adalah 3 kali umur anaknya. Jika umur ayah 36 tahun, berapa umur anaknya?", 12, [9, 15, 18]),
    createQuestion("Kelereng Rafi", "Rafi memiliki kelereng 4 kali lebih banyak daripada adiknya. Jika Rafi memiliki 32 kelereng, berapa banyak kelereng adiknya?", 8, [4, 6, 12]),
    createQuestion("Harga Tas", "Harga sebuah tas Rp20.000 lebih mahal daripada harga sebuah dompet. Jika harga tas Rp65.000, berapa harga dompet tersebut?", 45000, [40000, 50000, 85000], "rupiah"),
    createQuestion("Panjang Tali", "Panjang sebuah tali adalah 3 kali panjang tali lainnya. Jika tali yang lebih panjang berukuran 24 meter, berapa panjang tali yang lebih pendek?", 8, [6, 12, 21]),
    createQuestion("Belanja di Warung", "Dina membeli 3 bungkus mi instan dengan harga yang sama. Ia juga membeli telur seharga Rp8.000. Jika total belanja Dina Rp23.000, berapa harga satu bungkus mi instan?", 5000, [3000, 4000, 6000], "rupiah"),
    createQuestion("Membeli Buah", "Budi membeli 4 buah apel dengan harga yang sama. Ia membayar dengan uang Rp50.000 dan menerima kembalian Rp10.000. Berapa harga satu buah apel?", 10000, [5000, 8000, 12000], "rupiah"),
    createQuestion("Tabungan Harian", "Rina menabung dengan jumlah yang sama setiap hari selama 5 hari. Setelah ditambah tabungan awal sebesar Rp10.000, jumlah uangnya menjadi Rp60.000. Berapa uang yang ditabung Rina setiap hari?", 10000, [5000, 8000, 12000], "rupiah"),
    createQuestion("Biaya Parkir", "Biaya parkir sepeda motor adalah Rp2.000 untuk setiap jam. Jika seseorang membayar total Rp14.000, berapa jam ia memarkirkan motornya?", 7, [5, 6, 8]),
    createQuestion("Belanja Alat Tulis", "Fajar membeli 2 pulpen dengan harga yang sama dan sebuah buku seharga Rp6.000. Ia membayar total Rp16.000. Berapa harga satu pulpen?", 5000, [3000, 4000, 7000], "rupiah")
  ];

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/soal-cerita-aljabar-level-1.html");
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
    questionExpression.innerHTML = `<p class="story-question-title">${question.title}</p><p>${question.story}</p><p class="story-question-ask">Tentukan jawaban yang tepat.</p>`;
    questionExpression.setAttribute("aria-label", `${question.title}. ${question.story}`);
    answerOptions.replaceChildren(...sessionOptions[currentQuestionIndex].map(function (option, index) {
      return createOptionButton(option, index, selectedValue);
    }));
    previousButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = !selectedValue;
    nextButton.textContent = currentQuestionIndex === exercise.totalQuestions - 1 ? "Lihat hasil" : "Soal berikutnya →";
    const focusTarget = focusSelectedOption && selectedValue ? answerOptions.querySelector('[aria-pressed="true"]') : answerOptions.querySelector("button");
    focusTarget.focus();
  }

  function selectAnswer(answer) {
    if (!hasFinishedSession) {
      sessionAnswers[currentQuestionIndex] = answer;
      renderQuestion(true);
    }
  }

  function showPreviousQuestion() {
    if (currentQuestionIndex > 0 && !hasFinishedSession) {
      currentQuestionIndex -= 1;
      renderQuestion(true);
    }
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
    expression.className = "result-review-expression story-review-expression";
    expression.innerHTML = `<p class="story-question-title">${question.title}</p><p>${question.story}</p>`;
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

  window.MathPractice.startAlgebraStoryLevelOneExercise = startExercise;
  window.MathPractice.showPreviousAlgebraStoryLevelOneQuestion = showPreviousQuestion;
  window.MathPractice.showNextAlgebraStoryLevelOneQuestion = showNextQuestion;
  window.MathPractice.retryAlgebraStoryLevelOneResult = saveCurrentResult;
})();
