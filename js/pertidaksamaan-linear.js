(function () {
  "use strict";

  const exercise = {
    id: "pertidaksamaan_linear_01",
    name: "Pertidaksamaan Linear",
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

  function tokenizeMath(text) {
    return text.replace(/([0-9]+(?:[\.,][0-9]+)*)|([a-zA-Z])|([≤≥<>=+−\-])|([()])/g, function (_, num, variable, op, paren) {
      if (num) return `<mn>${num}</mn>`;
      if (variable) return `<mi>${variable}</mi>`;
      if (op) {
        const sym = op === "<" ? "&lt;" : op === ">" ? "&gt;" : (op === "-" ? "−" : op);
        return `<mo>${sym}</mo>`;
      }
      if (paren) return `<mo>${paren}</mo>`;
      return _;
    });
  }

  function toMathML(str) {
    const fractionMatch = str.match(/^\((.+?)\)\s*\/\s*(\d+)\s*(<=|>=|<|>|≤|≥)\s*(.+)$/);
    if (fractionMatch) {
      const numerator = fractionMatch[1];
      const denominator = fractionMatch[2];
      const rawOp = fractionMatch[3];
      const right = fractionMatch[4];
      const opSym = rawOp === "<=" ? "≤" : rawOp === ">=" ? "≥" : rawOp;
      const opFormatted = opSym === "<" ? "&lt;" : opSym === ">" ? "&gt;" : opSym;
      return `<math><mrow><mfrac><mrow>${tokenizeMath(numerator)}</mrow><mrow><mn>${denominator}</mn></mrow></mfrac><mo>${opFormatted}</mo>${tokenizeMath(right)}</mrow></math>`;
    }
    return `<math><mrow>${tokenizeMath(str)}</mrow></math>`;
  }

  function answerOption(expression) {
    return {
      value: expression,
      label: expression,
      mathml: toMathML(expression)
    };
  }

  function createQuestion(title, story, answer, distractors) {
    return {
      title: title,
      story: story,
      answer: answerOption(answer),
      distractors: distractors.map(answerOption)
    };
  }

  const questionBank = [
    createQuestion(
      "Kapasitas Bagasi Pesawat",
      "Seorang penumpang membawa koper dengan berat awal 14 kg. Ia menambahkan oleh-oleh seberat x kg. Petugas menyatakan bahwa total berat bagasi penumpang tersebut tidak boleh melebihi 20 kg.",
      "x + 14 ≤ 20",
      ["x + 14 < 20", "x + 14 ≥ 20", "x − 14 ≤ 20"]
    ),
    createQuestion(
      "Kekurangan Uang Budi",
      "Budi ingin membeli buku seharga Rp45.000. Uang yang dimiliki Budi saat ini adalah x rupiah. Karena uangnya masih kurang, Budi belum bisa membeli buku tersebut.",
      "x < 45.000",
      ["x ≤ 45.000", "x > 45.000", "x + 45.000 < 0"]
    ),
    createQuestion(
      "Syarat Tinggi Wahana",
      "Syarat anak boleh menaiki wahana halilintar adalah tinggi badan minimal 135 cm. Tinggi badan adik saat ini adalah t cm.",
      "t ≥ 135",
      ["t > 135", "t ≤ 135", "t + 135 ≥ 0"]
    ),
    createQuestion(
      "Sisa Saldo E-Money",
      "Saldo awal kartu tol Doni adalah Rp50.000. Setelah terpotong tarif tol sebesar x rupiah, sisa saldo di kartunya masih lebih dari Rp15.000.",
      "50.000 − x > 15.000",
      ["50.000 − x ≥ 15.000", "x − 50.000 > 15.000", "50.000 + x > 15.000"]
    ),
    createQuestion(
      "Penurunan Suhu Laboratorium",
      "Suhu awal ruangan laboratorium adalah 28°C. Setelah pendingin dinyalakan dan suhu turun sebesar x°C, suhu ruangan menjadi paling tinggi 18°C.",
      "28 − x ≤ 18",
      ["28 − x < 18", "28 + x ≤ 18", "x − 28 ≥ 18"]
    ),
    createQuestion(
      "Membeli Roti",
      "Harga sebuah roti adalah Rp4.000. Dina ingin membeli x buah roti dengan uang yang dibawanya sebesar Rp30.000 tanpa berutang.",
      "4.000x ≤ 30.000",
      ["4.000x < 30.000", "4.000x ≥ 30.000", "x + 4.000 ≤ 30.000"]
    ),
    createQuestion(
      "Muatan Mobil Barang",
      "Sebuah mobil bak mengangkut karung semen seberat 50 kg per karung. Jika mobil tersebut mengangkut y karung semen, daya angkut muatan tidak boleh melebihi 800 kg.",
      "50y ≤ 800",
      ["50y < 800", "50y ≥ 800", "y + 50 ≤ 800"]
    ),
    createQuestion(
      "Target Membaca Buku",
      "Farhan menargetkan membaca x lembar buku per hari. Dalam 6 hari, ia bertekad membaca paling sedikit 90 lembar buku.",
      "6x ≥ 90",
      ["6x > 90", "6x ≤ 90", "x + 6 ≥ 90"]
    ),
    createQuestion(
      "Kecepatan dan Jarak Tempuh",
      "Sebuah mobil melaju dengan kecepatan konstan v km/jam selama 3 jam. Jarak tempuh yang dicapai mobil tersebut kurang dari 180 km.",
      "3v < 180",
      ["3v ≤ 180", "3v > 180", "v / 3 < 180"]
    ),
    createQuestion(
      "Target Iuran Kas",
      "Suatu kelas mengumpulkan kas dari 25 siswa dengan iuran masing-masing x rupiah. Total dana yang terkumpul harus mencapai sekurang-kurangnya Rp500.000.",
      "25x ≥ 500.000",
      ["25x > 500.000", "25x ≤ 500.000", "x + 25 ≥ 500.000"]
    ),
    createQuestion(
      "Belanja Buku dan Parkir",
      "Rian membeli 4 buah buku tulis seharga masing-masing x rupiah serta membayar parkir Rp2.000. Total pengeluaran Rian tidak lebih dari Rp26.000.",
      "4x + 2.000 ≤ 26.000",
      ["4x + 2.000 < 26.000", "4x − 2.000 ≤ 26.000", "4x + 2.000 ≥ 26.000"]
    ),
    createQuestion(
      "Kapasitas Beban Lift",
      "Sebuah lift dinaiki oleh seorang operator berbobot 65 kg dan n kardus barang seberat 15 kg per kardus. Total muatan lift tidak boleh melampaui 350 kg.",
      "15n + 65 ≤ 350",
      ["15n + 65 < 350", "15n + 65 ≥ 350", "65n + 15 ≤ 350"]
    ),
    createQuestion(
      "Voucher Belanja Makanan",
      "Sinta memesan 3 porsi ayam bakar seharga masing-masing x rupiah dan memakai voucher diskon Rp10.000. Setelah dipotong voucher, ia membayar paling sedikit Rp50.000.",
      "3x − 10.000 ≥ 50.000",
      ["3x − 10.000 > 50.000", "3x + 10.000 ≥ 50.000", "3x − 10.000 ≤ 50.000"]
    ),
    createQuestion(
      "Tarif Taksi Daring",
      "Tarif awal taksi adalah Rp10.000, ditambah tarif Rp4.000 untuk setiap kilometer. Jika menempuh k km, total tarif yang harus dibayar kurang dari Rp70.000.",
      "4.000k + 10.000 < 70.000",
      ["4.000k + 10.000 ≤ 70.000", "10.000k + 4.000 < 70.000", "4.000k − 10.000 < 70.000"]
    ),
    createQuestion(
      "Target Tabungan Harian",
      "Aisyah memiliki tabungan awal Rp80.000. Ia menabung lagi Rp5.000 per hari selama h hari. Tabungan akhir Aisyah ditargetkan melebihi Rp200.000.",
      "5.000h + 80.000 > 200.000",
      ["5.000h + 80.000 ≥ 200.000", "80.000h + 5.000 > 200.000", "5.000h − 80.000 > 200.000"]
    ),
    createQuestion(
      "Pemakaian Kuota Internet",
      "Hasan memiliki paket kuota 15 GB. Setiap hari ia memakai rata-rata 1,5 GB selama d hari. Hasan ingin sisa kuotanya paling sedikit 3 GB.",
      "15 − 1,5d ≥ 3",
      ["15 − 1,5d > 3", "15 + 1,5d ≥ 3", "1,5d − 15 ≥ 3"]
    ),
    createQuestion(
      "Keliling Persegi Panjang",
      "Suatu kebun berbentuk persegi panjang memiliki panjang (x + 10) meter dan keliling kebun tidak lebih dari 40 meter dengan rumus 2(x + 10).",
      "2(x + 10) ≤ 40",
      ["2(x + 10) < 40", "x + 10 ≤ 40", "2(x + 10) ≥ 40"]
    ),
    createQuestion(
      "Keliling Segitiga Sama Sisi",
      "Sebuah bingkai berbentuk segitiga sama sisi memiliki panjang sisi (2x + 1) cm. Keliling bingkai tersebut, yaitu 3(2x + 1), minimal 33 cm.",
      "3(2x + 1) ≥ 33",
      ["3(2x + 1) > 33", "2x + 1 ≥ 33", "3(2x + 1) ≤ 33"]
    ),
    createQuestion(
      "Rata-rata Nilai Kelulusan",
      "Nilai tugas matematika Farel adalah 75. Jika nilai ujian akhirnya adalah x, maka rata-rata kedua nilai tersebut, yaitu (x + 75) / 2, harus paling sedikit 80.",
      "(x + 75) / 2 ≥ 80",
      ["(x + 75) / 2 > 80", "(x + 75) / 2 ≤ 80", "x + 75 ≥ 80"]
    ),
    createQuestion(
      "Jumlah Usia Ayah dan Anak",
      "Umur ayah adalah 3 kali umur anaknya (x tahun). Jika digabungkan, total umur mereka saat ini adalah 4x tahun dan jumlah umur keduanya kurang dari 60 tahun.",
      "4x < 60",
      ["4x ≤ 60", "3x < 60", "4x > 60"]
    )
  ];

  const student = window.MathPractice.getStudent();
  if (!student) {
    window.location.replace("../student.html?next=latihan/pertidaksamaan-linear.html");
    return;
  }
  studentSummary.textContent = `${student.name} — ${student.class_name}`;

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
    const letter = String.fromCharCode(65 + index);
    const isSelected = selectedValue === option.value;

    button.className = "exponent-option inequality-option";
    button.classList.toggle("is-selected", isSelected);
    button.type = "button";
    button.setAttribute("aria-label", `Pilihan ${letter}: ${option.label}`);
    button.setAttribute("aria-pressed", String(isSelected));

    key.className = "exponent-option-key";
    key.textContent = letter;

    answerValue.className = "exponent-option-value";
    answerValue.innerHTML = option.mathml;

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

    questionExpression.innerHTML = `<p class="story-question-title">${question.title}</p><p>${question.story}</p><p class="story-question-ask">Manakah model pertidaksamaan yang tepat?</p>`;
    questionExpression.setAttribute("aria-label", `${question.title}. ${question.story}`);

    answerOptions.replaceChildren(
      ...sessionOptions[currentQuestionIndex].map(function (option, index) {
        return createOptionButton(option, index, selectedValue);
      })
    );

    previousButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = !selectedValue;
    nextButton.textContent = currentQuestionIndex === exercise.totalQuestions - 1 ? "Lihat hasil" : "Soal berikutnya →";

    const focusTarget = focusSelectedOption && selectedValue
      ? answerOptions.querySelector('[aria-pressed="true"]')
      : answerOptions.querySelector("button");
    if (focusTarget) {
      focusTarget.focus();
    }
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
    if (!isCorrect) {
      answers.append(createReviewAnswer("Jawaban benar", question.answer));
    }

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
    sessionOptions = sessionQuestions.map(function (question) {
      return window.MathPractice.shuffle(getQuestionOptions(question));
    });
    sessionAnswers = Array(exercise.totalQuestions).fill("");
    currentQuestionIndex = 0;
    hasFinishedSession = false;
    currentSubmission = null;
    setSaveStatus("", "idle", false);
    window.MathPractice.showOnly(quizScreen, screens);
    renderQuestion(false);
  }

  window.MathPractice.startLinearInequalityExercise = startExercise;
  window.MathPractice.showPreviousLinearInequalityQuestion = showPreviousQuestion;
  window.MathPractice.showNextLinearInequalityQuestion = showNextQuestion;
  window.MathPractice.retryLinearInequalityResult = saveCurrentResult;
})();

