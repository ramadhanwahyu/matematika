const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';
const STUDENTS_SHEET_NAME = 'Students';
const RESULTS_SHEET_NAME = 'Results';
const SESSIONS_SHEET_NAME = 'Sessions';
const STUDENTS_HEADERS = ['student_id', 'name', 'class_name', 'password_salt', 'password_hash', 'active'];
const RESULTS_HEADERS = ['timestamp', 'student_id', 'student_name', 'class_name', 'exercise_id', 'exercise_name', 'correct', 'incorrect', 'total', 'score'];
const SESSION_HOURS = 12;
const PASSWORD_ITERATIONS = 5000;
const MAX_LOGIN_FAILURES = 5;
const LOCKOUT_MINUTES = 15;
function doPost(e) {
  try {
    ensureSpreadsheetId();
    if (!e || !e.postData || !e.postData.contents) throw new Error('Body JSON tidak ditemukan.');
    const p = JSON.parse(e.postData.contents); let result;
    if (p.action === 'login') result = loginStudent(p);
    else if (p.action === 'logout') result = logoutStudent(p);
    else if (p.action === 'change_password') result = changeStudentPassword(p);
    else if (p.action === 'save_result') result = saveStudentResult(p);
    else throw new Error('Aksi tidak dikenal.');
    return createJsonResponse(Object.assign({ success: true }, result || {}));
  } catch (error) { console.error(error); return createJsonResponse({ success: false, message: error.message || 'Terjadi kesalahan di server.' }); }
}
function doGet() { return createJsonResponse({ success: true, service: 'Math Practice' }); }
function ensureSpreadsheetId() { if (SPREADSHEET_ID === 'GANTI_DENGAN_ID_SPREADSHEET_ANDA') throw new Error('SPREADSHEET_ID belum diisi.'); }
function loginStudent(p) {
  const id = requireStudentId(p.student_id), password = requirePassword(p.password), lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties(), key = 'login_' + id.toUpperCase(), attempt = JSON.parse(props.getProperty(key) || '{"count":0,"until":0}');
    if (attempt.until > Date.now()) throw new Error('Terlalu banyak percobaan. Coba lagi beberapa menit lagi.');
    const found = findStudentRow(id), student = found && found.student;
    const valid = student && isActive(student.active) && student.password_salt && student.password_hash && constantTimeEqual(hashPassword(password, student.password_salt), student.password_hash);
    if (!valid) { attempt.count += 1; if (attempt.count >= MAX_LOGIN_FAILURES) { attempt.count = 0; attempt.until = Date.now() + LOCKOUT_MINUTES * 60000; } props.setProperty(key, JSON.stringify(attempt)); throw new Error('ID siswa atau kata sandi tidak sesuai.'); }
    props.deleteProperty(key);
    const token = Utilities.getUuid() + Utilities.getUuid(), expires = new Date(Date.now() + SESSION_HOURS * 3600000);
    getOrCreateSheet(SpreadsheetApp.openById(SPREADSHEET_ID), SESSIONS_SHEET_NAME, ['token_hash','student_id','expires_at','revoked']).appendRow([sha256(token), student.student_id, expires, false]);
    return { token: token, expires_at: expires.toISOString(), student: { student_id: student.student_id, name: student.name, class_name: student.class_name } };
  } finally { lock.releaseLock(); }
}
function logoutStudent(p) { const s = requireSession(p.token); s.sheet.getRange(s.row, 4).setValue(true); return {}; }
function changeStudentPassword(p) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const session = requireSession(p.token), current = requirePassword(p.current_password), next = requirePassword(p.new_password);
    if (next.length < 8) throw new Error('Kata sandi baru harus sedikitnya 8 karakter.');
    if (current === next) throw new Error('Kata sandi baru harus berbeda dari kata sandi saat ini.');
    const found = findStudentRow(session.student.student_id);
    if (!constantTimeEqual(hashPassword(current, found.student.password_salt), found.student.password_hash)) throw new Error('Kata sandi saat ini tidak sesuai.');
    const salt = randomSalt(); found.sheet.getRange(found.row, found.indexes.password_salt + 1, 1, 2).setValues([[salt, hashPassword(next, salt)]]);
    revokeStudentSessions(session.student.student_id, session.row); return {};
  } finally { lock.releaseLock(); }
}
function saveStudentResult(p) {
  const session = requireSession(p.token), r = validateResultPayload(p.result), ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateSheet(ss, RESULTS_SHEET_NAME, RESULTS_HEADERS).appendRow([new Date(), session.student.student_id, session.student.name, session.student.class_name, r.exercise_id, r.exercise_name, r.correct, r.incorrect, r.total, r.score]);
  return { message: 'Hasil berhasil disimpan.' };
}
function requireSession(token) {
  if (typeof token !== 'string' || token.length < 30 || token.length > 100) throw new Error('Sesi tidak valid. Masuk kembali.');
  const sheet = getOrCreateSheet(SpreadsheetApp.openById(SPREADSHEET_ID), SESSIONS_SHEET_NAME, ['token_hash','student_id','expires_at','revoked']), values = sheet.getDataRange().getValues(), digest = sha256(token);
  for (let i = values.length - 1; i >= 1; i--) if (constantTimeEqual(String(values[i][0]), digest)) {
    const expires = new Date(values[i][2]).getTime();
    if (values[i][3] === true || !expires || expires <= Date.now()) throw new Error('Sesi berakhir. Masuk kembali.');
    const found = findStudentRow(String(values[i][1]));
    if (!found || !isActive(found.student.active)) throw new Error('Akun siswa tidak aktif. Hubungi guru.');
    return { sheet: sheet, row: i + 1, student: { student_id: found.student.student_id, name: found.student.name, class_name: found.student.class_name } };
  }
  throw new Error('Sesi tidak valid. Masuk kembali.');
}
function revokeStudentSessions(id, exceptRow) {
  const sh = getOrCreateSheet(SpreadsheetApp.openById(SPREADSHEET_ID), SESSIONS_SHEET_NAME, ['token_hash','student_id','expires_at','revoked']), rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) if (i + 1 !== exceptRow && String(rows[i][1]).toUpperCase() === id.toUpperCase() && rows[i][3] !== true) sh.getRange(i + 1, 4).setValue(true);
}
function findStudentRow(id) {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(STUDENTS_SHEET_NAME); if (!sh || sh.getLastRow() < 2) throw new Error('Sheet Students belum memiliki data.');
  const values = sh.getDataRange().getDisplayValues(), indexes = getHeaderIndexes(values[0], STUDENTS_HEADERS), matches = [];
  for (let i = 1; i < values.length; i++) if (String(values[i][indexes.student_id]).trim().toUpperCase() === id.toUpperCase()) matches.push(i);
  if (matches.length > 1) throw new Error('ID siswa duplikat pada sheet Students.'); if (!matches.length) return null;
  const i = matches[0], student = {}; STUDENTS_HEADERS.forEach(function(h) { student[h] = String(values[i][indexes[h]] || '').trim(); });
  return { sheet: sh, row: i + 1, indexes: indexes, student: student };
}
function initializeStudentPassword() {
  const ui = SpreadsheetApp.getUi(), idPrompt = ui.prompt('Kata sandi awal', 'Masukkan ID siswa:', ui.ButtonSet.OK_CANCEL);
  if (idPrompt.getSelectedButton() !== ui.Button.OK) return;
  const passPrompt = ui.prompt('Kata sandi sementara', 'Masukkan kata sandi sementara (minimal 8 karakter):', ui.ButtonSet.OK_CANCEL);
  if (passPrompt.getSelectedButton() !== ui.Button.OK) return;
  const id = requireStudentId(idPrompt.getResponseText()), pass = requirePassword(passPrompt.getResponseText()); if (pass.length < 8) throw new Error('Kata sandi harus sedikitnya 8 karakter.');
  const found = findStudentRow(id); if (!found) throw new Error('ID siswa tidak ditemukan.');
  const salt = randomSalt(); found.sheet.getRange(found.row, found.indexes.password_salt + 1, 1, 2).setValues([[salt, hashPassword(pass, salt)]]);
  if (!found.student.active) found.sheet.getRange(found.row, found.indexes.active + 1).setValue('TRUE'); ui.alert('Kata sandi sementara tersimpan. Berikan kepada siswa secara pribadi.');
}
function hashPassword(password, salt) { let value = Utilities.newBlob(salt + ':' + password).getBytes(), key = Utilities.newBlob(salt).getBytes(); for (let i = 0; i < PASSWORD_ITERATIONS; i++) value = Utilities.computeHmacSha256Signature(value, key); return Utilities.base64Encode(value); }
function sha256(value) { return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)); }
function randomSalt() { return Utilities.getUuid() + Utilities.getUuid(); }
function constantTimeEqual(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
function isActive(v) { return String(v).trim().toLowerCase() !== 'false' && String(v).trim() !== '0' && String(v).trim().toLowerCase() !== 'nonaktif'; }
function requireStudentId(v) { const id = typeof v === 'string' ? v.trim() : ''; if (!/^[A-Za-z0-9_-]{1,32}$/.test(id)) throw new Error('ID siswa tidak valid.'); return id; }
function requirePassword(v) { if (typeof v !== 'string' || v.length < 1 || v.length > 128) throw new Error('Kata sandi tidak valid.'); return v; }
function getHeaderIndexes(headers, required) { const ix = {}; headers.forEach(function(h,i) { ix[String(h).trim().toLowerCase()] = i; }); required.forEach(function(h) { if (ix[h] === undefined) throw new Error('Header Students wajib berisi: ' + required.join(', ')); }); return ix; }
function getOrCreateSheet(ss, name, headers) { let sh = ss.getSheetByName(name); if (!sh) sh = ss.insertSheet(name); if (sh.getLastRow() === 0) { sh.appendRow(headers); sh.setFrozenRows(1); } return sh; }
function validateResultPayload(p) { if (!p || typeof p !== 'object') throw new Error('Format hasil tidak valid.'); const r = { exercise_id: requireText(p.exercise_id,100), exercise_name: requireText(p.exercise_name,150), correct: requireInteger(p.correct,0,1000), incorrect: requireInteger(p.incorrect,0,1000), total: requireInteger(p.total,0,1000), score: requireInteger(p.score,0,10000) }; if (r.correct + r.incorrect !== r.total) throw new Error('Jumlah jawaban tidak sesuai total soal.'); return r; }
function requireText(v,max) { if (typeof v !== 'string' || !v.trim() || v.trim().length > max) throw new Error('Data hasil tidak valid.'); return v.trim(); }
function requireInteger(v,min,max) { if (!Number.isInteger(v) || v < min || v > max) throw new Error('Nilai hasil tidak valid.'); return v; }
function createJsonResponse(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
