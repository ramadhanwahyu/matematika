// Isi dengan ID Spreadsheet dari URL Google Sheets Anda.
const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';
const RESULTS_SHEET_NAME = 'Results';
const RESULTS_HEADERS = [
  'timestamp',
  'student_id',
  'student_name',
  'class_name',
  'exercise_id',
  'exercise_name',
  'correct',
  'incorrect',
  'total',
  'score'
];

function doPost(e) {
  try {
    if (SPREADSHEET_ID === 'GANTI_DENGAN_ID_SPREADSHEET_ANDA') {
      throw new Error('SPREADSHEET_ID belum diisi.');
    }
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Body JSON tidak ditemukan.');
    }

    const payload = JSON.parse(e.postData.contents);
    const result = validateResultPayload(payload);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateResultsSheet(spreadsheet);

    // Timestamp dibuat oleh server agar waktu browser tidak menjadi sumber data.
    sheet.appendRow([
      new Date(),
      result.student_id,
      result.student_name,
      result.class_name,
      result.exercise_id,
      result.exercise_name,
      result.correct,
      result.incorrect,
      result.total,
      result.score
    ]);

    return createJsonResponse({ success: true, message: 'Hasil berhasil disimpan.' });
  } catch (error) {
    console.error(error);
    return createJsonResponse({ success: false, message: error.message || 'Terjadi kesalahan di server.' });
  }
}

function getOrCreateResultsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(RESULTS_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(RESULTS_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RESULTS_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function validateResultPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Format data hasil tidak valid.');
  }

  const result = {
    student_id: requireText(payload.student_id, 'student_id', 50),
    student_name: requireText(payload.student_name, 'student_name', 100),
    class_name: requireText(payload.class_name, 'class_name', 80),
    exercise_id: requireText(payload.exercise_id, 'exercise_id', 100),
    exercise_name: requireText(payload.exercise_name, 'exercise_name', 150),
    correct: requireInteger(payload.correct, 'correct', 0, 1000),
    incorrect: requireInteger(payload.incorrect, 'incorrect', 0, 1000),
    total: requireInteger(payload.total, 'total', 1, 1000),
    score: requireInteger(payload.score, 'score', 0, 100)
  };

  if (!/^[A-Za-z0-9_-]+$/.test(result.student_id)) {
    throw new Error('student_id berisi karakter yang tidak diizinkan.');
  }
  if (result.correct + result.incorrect !== result.total) {
    throw new Error('Jumlah jawaban benar dan salah tidak sesuai total soal.');
  }
  return result;
}

function requireText(value, fieldName, maximumLength) {
  if (typeof value !== 'string') {
    throw new Error(fieldName + ' harus berupa teks.');
  }
  const text = value.trim();
  if (!text || text.length > maximumLength) {
    throw new Error(fieldName + ' wajib diisi dan tidak boleh terlalu panjang.');
  }
  return text;
}

function requireInteger(value, fieldName, minimum, maximum) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(fieldName + ' tidak valid.');
  }
  return value;
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
