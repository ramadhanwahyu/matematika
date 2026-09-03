// Isi dengan ID Spreadsheet dari URL Google Sheets Anda.
const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';
const RESULTS_SHEET_NAME = 'Results';
const STUDENTS_SHEET_NAME = 'Students';
const STUDENTS_HEADERS = ['student_id', 'name', 'class_name'];
const STUDENTS_CACHE_KEY = 'students_lookup_data_v1';
const STUDENTS_CACHE_SECONDS = 300;
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
    ensureSpreadsheetId();
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

function doGet(e) {
  try {
    ensureSpreadsheetId();
    const action = e && e.parameter ? e.parameter.action : '';

    if (action !== 'find_student') {
      throw new Error('Aksi pencarian tidak valid.');
    }

    const studentId = e.parameter.student_id || '';
    const student = findStudentById(studentId);
    return createJsonResponse({ success: true, student: student });
  } catch (error) {
    console.error(error);
    return createJsonResponse({ success: false, message: error.message || 'Terjadi kesalahan di server.' });
  }
}

function ensureSpreadsheetId() {
  if (SPREADSHEET_ID === 'GANTI_DENGAN_ID_SPREADSHEET_ANDA') {
    throw new Error('SPREADSHEET_ID belum diisi.');
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

function findStudentById(requestedStudentId) {
  const studentId = requireStudentId(requestedStudentId);
  const studentsData = getStudentsLookupData();
  const headerIndexes = getStudentsHeaderIndexes(studentsData.headers);
  const matches = studentsData.rows.filter(function(row) {
    return String(row[headerIndexes.student_id]).trim().toUpperCase() === studentId.toUpperCase();
  });

  if (matches.length === 0) return null;
  if (matches.length > 1) {
    throw new Error('ID siswa ditemukan lebih dari satu kali di sheet Students. Gunakan ID yang unik.');
  }

  const row = matches[0];
  const student = {
    student_id: String(row[headerIndexes.student_id]).trim(),
    name: String(row[headerIndexes.name]).trim(),
    class_name: String(row[headerIndexes.class_name]).trim()
  };

  if (!student.name || !student.class_name) {
    throw new Error('Data nama atau kelas untuk ID siswa ini belum lengkap.');
  }
  return student;
}

function getStudentsLookupData() {
  const cache = CacheService.getScriptCache();
  const cachedData = cache.get(STUDENTS_CACHE_KEY);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (error) {
      // Cache yang tidak dapat dibaca akan diganti dengan data terbaru dari sheet.
      cache.remove(STUDENTS_CACHE_KEY);
    }
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(STUDENTS_SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet Students belum ditemukan. Buat sheet dengan header student_id, name, class_name.');
  }

  const sheetValues = sheet.getDataRange().getDisplayValues();
  const studentsData = {
    headers: sheetValues[0] || [],
    rows: sheetValues.slice(1)
  };

  try {
    cache.put(STUDENTS_CACHE_KEY, JSON.stringify(studentsData), STUDENTS_CACHE_SECONDS);
  } catch (error) {
    // Pencarian tetap bekerja jika cache sedang tidak tersedia atau datanya terlalu besar.
    console.warn('Data Students tidak dapat disimpan ke cache.', error);
  }
  return studentsData;
}

function getStudentsHeaderIndexes(headers) {
  const indexes = {};
  headers.forEach(function(header, index) {
    indexes[String(header).trim().toLowerCase()] = index;
  });

  STUDENTS_HEADERS.forEach(function(header) {
    if (indexes[header] === undefined) {
      throw new Error('Header sheet Students harus berisi: student_id, name, class_name.');
    }
  });
  return indexes;
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
    total: requireInteger(payload.total, 'total', 0, 1000),
    score: requireInteger(payload.score, 'score', 0, 10000)
  };

  requireStudentId(result.student_id);
  if (result.correct + result.incorrect !== result.total) {
    throw new Error('Jumlah jawaban benar dan salah tidak sesuai total soal.');
  }
  return result;
}

function requireStudentId(value) {
  const studentId = typeof value === 'string' ? value.trim() : '';
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(studentId)) {
    throw new Error('student_id berisi karakter yang tidak diizinkan.');
  }
  return studentId;
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
