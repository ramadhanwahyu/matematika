(function () {
  "use strict";

  const exercise = { id: "soal_cerita_aljabar_level_2_01", name: "Soal Cerita Aljabar - Level 2", totalQuestions: 10 };
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

  function formatNumber(value) { return new Intl.NumberFormat("id-ID").format(value); }
  function answerOption(value, unit) {
    const formattedValue = unit === "rupiah" ? `Rp${formatNumber(value)}` : formatNumber(value);
    return { value: String(value), label: formattedValue, mathml: `<math><mrow><mtext>${formattedValue}</mtext></mrow></math>` };
  }
  function createQuestion(title, story, answer, distractors, unit) {
    return { title: title, story: story, answer: answerOption(answer, unit), distractors: distractors.map(function (value) { return answerOption(value, unit); }) };
  }

  const questionBank = [
    createQuestion("Kotak Permen", "Sebuah toko memiliki 4 kotak permen dengan jumlah permen yang sama di setiap kotak. Kemudian, toko tersebut mendapat tambahan 8 permen. Sekarang jumlah seluruh permen menjadi 40. Berapa banyak permen dalam setiap kotak sebelum mendapat tambahan?", 8, [6, 9, 12]),
    createQuestion("Kue Ibu", "Ibu memiliki sejumlah kue. Kue tersebut dibagikan sama rata kepada 5 anak. Setiap anak mendapat 3 kue dan masih tersisa 5 kue. Berapa banyak kue yang dimiliki Ibu mula-mula?", 20, [15, 18, 25]),
    createQuestion("Permen Rina", "Rina membeli 3 bungkus permen dengan jumlah yang sama pada setiap bungkus. Setelah itu, ia memberikan 6 permen kepada temannya. Sekarang Rina memiliki 30 permen. Berapa banyak permen dalam setiap bungkus?", 12, [8, 10, 14]),
    createQuestion("Buku di Rak", "Sebuah rak memiliki 5 susun buku dengan jumlah buku yang sama pada setiap susun. Kemudian, 10 buku ditambahkan ke rak tersebut. Sekarang jumlah seluruh buku menjadi 45. Berapa banyak buku pada setiap susun sebelum buku tambahan dimasukkan?", 7, [5, 8, 9]),
    createQuestion("Uang Dika", "Dika memiliki sejumlah uang. Ia menggunakan Rp10.000 untuk membeli makanan, kemudian mendapat tambahan Rp5.000 dari kakaknya. Sekarang uang Dika menjadi Rp30.000. Berapa uang Dika mula-mula?", 35000, [25000, 30000, 45000], "rupiah"),
    createQuestion("Pensil di Kelas", "Sebuah kotak berisi sejumlah pensil. Setelah 6 pensil digunakan, sisa pensil tersebut dibagikan sama rata kepada 4 siswa. Setiap siswa mendapat 5 pensil. Berapa banyak pensil yang ada di dalam kotak mula-mula?", 26, [14, 24, 30]),
    createQuestion("Paket Roti", "Sebuah toko memiliki 6 paket roti dengan jumlah roti yang sama di setiap paket. Setelah itu, toko menerima tambahan 6 roti. Sekarang jumlah seluruh roti menjadi 42. Berapa banyak roti dalam setiap paket?", 6, [5, 7, 8]),
    createQuestion("Kelereng Budi", "Budi memiliki sejumlah kelereng. Ia memberikan 8 kelereng kepada adiknya, kemudian membeli lagi 5 kelereng. Sekarang Budi memiliki 27 kelereng. Berapa banyak kelereng Budi mula-mula?", 30, [24, 27, 32]),
    createQuestion("Buku Tulis", "Siti membeli 4 buku tulis dengan harga yang sama. Ia juga membeli sebuah penghapus seharga Rp4.000. Jika total belanja Siti Rp28.000, berapa harga satu buku tulis?", 6000, [4000, 5000, 7000], "rupiah"),
    createQuestion("Telur", "Pak Hasan memiliki sejumlah telur. Ia menggunakan 5 telur untuk membuat kue. Sisa telur kemudian dimasukkan ke dalam 3 wadah dengan jumlah yang sama. Setiap wadah berisi 7 telur. Berapa banyak telur Pak Hasan mula-mula?", 26, [19, 21, 28]),
    createQuestion("Stiker", "Lina memiliki 5 lembar stiker dengan jumlah stiker yang sama pada setiap lembar. Ia kemudian memberikan 10 stiker kepada adiknya. Sekarang Lina memiliki 30 stiker. Berapa banyak stiker pada setiap lembar?", 8, [6, 7, 10]),
    createQuestion("Uang Saku", "Rafi memiliki sejumlah uang. Ia menggunakan Rp8.000 untuk membeli minuman. Setelah itu, ayahnya memberi tambahan Rp12.000. Sekarang uang Rafi menjadi Rp34.000. Berapa uang Rafi sebelum membeli minuman?", 30000, [22000, 26000, 42000], "rupiah"),
    createQuestion("Buah di Keranjang", "Sebuah toko memiliki 4 keranjang apel dengan jumlah apel yang sama pada setiap keranjang. Setelah 4 apel terjual, tersisa 32 apel. Berapa banyak apel dalam setiap keranjang sebelum ada yang terjual?", 9, [7, 8, 10]),
    createQuestion("Kelereng Dodi", "Dodi memiliki sejumlah kelereng. Setelah memberikan 5 kelereng kepada temannya, sisa kelerengnya dibagikan sama rata kepada 3 orang. Setiap orang mendapat 6 kelereng. Berapa banyak kelereng Dodi mula-mula?", 23, [13, 18, 24]),
    createQuestion("Tiket", "Sebuah keluarga membeli 3 tiket dengan harga yang sama. Mereka juga membayar biaya parkir sebesar Rp5.000. Jika total yang dibayar adalah Rp35.000, berapa harga satu tiket?", 10000, [5000, 8000, 12000], "rupiah"),
    createQuestion("Buku di Perpustakaan", "Sebuah perpustakaan memiliki 8 rak dengan jumlah buku yang sama pada setiap rak. Kemudian, 24 buku dipinjam oleh siswa. Setelah itu, masih tersisa 136 buku di perpustakaan. Berapa banyak buku yang terdapat pada setiap rak sebelum dipinjam?", 20, [16, 18, 22]),
    createQuestion("Kue di Toko", "Sebuah toko memiliki sejumlah kue. Setelah 8 kue terjual, sisa kue dimasukkan ke dalam 4 kotak dengan jumlah yang sama. Setiap kotak berisi 6 kue. Berapa banyak kue yang dimiliki toko mula-mula?", 32, [24, 28, 36]),
    createQuestion("Tabungan Rina", "Rina menabung sejumlah uang. Ia menggunakan Rp15.000 untuk membeli buku, kemudian menabung lagi Rp10.000. Sekarang tabungannya menjadi Rp40.000. Berapa jumlah tabungan Rina sebelum membeli buku?", 45000, [35000, 40000, 55000], "rupiah"),
    createQuestion("Botol Air", "Sebuah kardus berisi 5 botol air dengan volume yang sama. Kemudian, ditambahkan 5 botol lagi dengan volume yang sama. Jika seluruhnya terdapat 50 liter air dan setiap botol memiliki volume yang sama, berapa liter isi setiap botol?", 5, [2, 4, 10]),
    createQuestion("Pensil", "Seorang guru memiliki sejumlah pensil. Ia memberikan 7 pensil kepada siswa. Sisa pensil kemudian dibagikan sama rata kepada 3 siswa, dan setiap siswa mendapat 5 pensil. Berapa banyak pensil yang dimiliki guru mula-mula?", 22, [15, 20, 25]),
    createQuestion("Belanja Buah", "Ibu membeli 3 kg apel dengan harga yang sama setiap kilogram. Ia juga membeli pisang seharga Rp9.000. Jika total belanja Ibu Rp30.000, berapa harga apel per kilogram?", 7000, [5000, 6000, 8000], "rupiah"),
    createQuestion("Permen dalam Kotak", "Sebuah toko memiliki 4 kotak permen dengan jumlah yang sama. Setelah 12 permen terjual, masih tersisa 28 permen. Berapa banyak permen dalam setiap kotak sebelum ada yang terjual?", 10, [7, 8, 12]),
    createQuestion("Uang Adik", "Adik memiliki sejumlah uang. Kakaknya memberikan tambahan Rp7.000. Setelah itu, adik menggunakan Rp5.000 untuk membeli makanan. Sekarang uang adik menjadi Rp22.000. Berapa uang adik mula-mula?", 20000, [18000, 22000, 30000], "rupiah"),
    createQuestion("Buku Bacaan", "Sebuah sekolah membeli sejumlah buku. Buku tersebut dibagikan sama rata kepada 5 kelas. Setelah masing-masing kelas mendapat 8 buku, masih tersisa 10 buku. Berapa jumlah buku yang dibeli sekolah mula-mula?", 50, [40, 45, 58]),
    createQuestion("Kue untuk Tamu", "Ibu membuat 4 piring kue dengan jumlah kue yang sama pada setiap piring. Kemudian, 4 kue dari seluruh kue tersebut diberikan kepada tetangga. Sekarang tersisa 36 kue. Berapa banyak kue pada setiap piring mula-mula?", 10, [8, 9, 12]),
    createQuestion("Harga Pulpen", "Dina membeli 5 pulpen dengan harga yang sama. Ia mendapat potongan harga Rp5.000 dari total belanja. Setelah mendapat potongan, ia membayar Rp20.000. Berapa harga satu pulpen sebelum mendapat potongan?", 5000, [3000, 4000, 6000], "rupiah"),
    createQuestion("Buah untuk Anak-anak", "Ayah memiliki sejumlah jeruk. Setelah membeli 6 jeruk lagi, semua jeruk dibagikan sama rata kepada 4 anak. Setiap anak mendapat 5 jeruk. Berapa banyak jeruk yang dimiliki Ayah sebelum membeli tambahan?", 14, [10, 12, 16]),
    createQuestion("Tabungan Harian", "Rudi memiliki sejumlah tabungan. Ia menabung Rp5.000 lagi, kemudian menggunakan Rp10.000 untuk membeli sepatu. Setelah itu, tabungannya tersisa Rp25.000. Berapa jumlah tabungan Rudi sebelum menabung dan membeli sepatu?", 30000, [20000, 25000, 40000], "rupiah"),
    createQuestion("Paket Makanan", "Sebuah kantin menyiapkan sejumlah makanan. Makanan tersebut dimasukkan ke dalam 4 paket dengan jumlah yang sama. Setelah itu, ditambahkan 3 makanan ke setiap paket. Sekarang setiap paket berisi 8 makanan. Berapa banyak makanan yang disiapkan mula-mula?", 20, [12, 16, 24]),
    createQuestion("Belanja Alat Tulis", "Fajar membeli 3 buku dengan harga yang sama dan sebuah pulpen seharga Rp4.000. Ia mendapat potongan harga Rp5.000. Setelah mendapat potongan, ia membayar Rp23.000. Berapa harga satu buku sebelum mendapat potongan?", 8000, [5000, 7000, 9000], "rupiah")
  ];

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/soal-cerita-aljabar-level-2.html");
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
  window.MathPractice.startAlgebraStoryLevelTwoExercise = startExercise;
  window.MathPractice.showPreviousAlgebraStoryLevelTwoQuestion = showPreviousQuestion;
  window.MathPractice.showNextAlgebraStoryLevelTwoQuestion = showNextQuestion;
  window.MathPractice.retryAlgebraStoryLevelTwoResult = saveCurrentResult;
})();
