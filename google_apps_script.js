/**
 * Google Apps Script สำหรับเชื่อมต่อระบบคำนวณวีลแชร์สัตว์พิการ กับ Google Sheet
 * Google Sheet ID: 1EJASDHMSzbnt2mdlALjvwgmA8HkIiuHQGwlahMr44gg
 * โครงการเพราะมีน้ำใจจึงมีชีวิต มูลนิธิ ศ.ดร.จักร พิชัยรณรงค์สงคราม
 * 
 * วิธีการติดตั้ง (One-time Setup):
 * 1. เปิด Google Sheet: https://docs.google.com/spreadsheets/d/1EJASDHMSzbnt2mdlALjvwgmA8HkIiuHQGwlahMr44gg/edit
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) > "Apps Script"
 * 3. ลบโค้ดเดิมทั้งหมดออก แล้ววางโค้ดไฟล์นี้ลงไป
 * 4. กดปุ่ม "การทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้รายการใหม่" (New deployment)
 * 5. เลือกประเภท: "เว็บแอป" (Web App)
 *    - คำอธิบาย: Wheelchair Calc API
 *    - ดำเนินการในฐานะ: ฉัน (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง: ทุกคน (Anyone)
 * 6. กด "ทำให้ใช้งานได้" (Deploy) และคัดลอก Web App URL (ลงท้ายด้วย /exec) มาวางในหน้าเว็บแอป
 */

const SHEET_NAME = 'Chakr'; // ชื่อแท็บใน Google Sheet

const HEADERS = [
  'Case ID',
  'Timestamp',
  'Staff Name (ผู้คำนวณ)',
  'Pet Name (ชื่อสัตว์)',
  'Owner Name (เจ้าของ/เบอร์)',
  'Animal Type (ประเภท)',
  'Weight (kg)',
  'A (สูงสะโพก)',
  'B (สูงท้อง)',
  'G (กว้างตัว)',
  'H (รอบอก/ท้อง)',
  'E (ยาวลำตัว)',
  'D (สูงอก)',
  'Wheelchair Type (รูปแบบ)',
  'Pipe Size (ขนาดท่อ)',
  'ชิ้น ก (ซม. x จำนวน)',
  'ชิ้น ข (ซม. x จำนวน)',
  'ชิ้น ค (ซม. x จำนวน)',
  'ชิ้น ง (ซม. x จำนวน)',
  'ชิ้น จ (ซม. x จำนวน)',
  'ชิ้น ฉ (ซม. x จำนวน)',
  'ชิ้น ช (ซม. x จำนวน)',
  'Total Pipe (m)',
  'ท่อ 4ม. (เส้น)',
  'QC Status',
  'Notes (หมายเหตุ)'
];

function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action || 'list';
    const sheet = getOrCreateSheet();

    if (action === 'get') {
      const targetId = params.id || params.caseId;
      if (!targetId) {
        return createJsonResponse({ status: 'error', message: 'กรุณาระบุ id หรือ caseId' });
      }

      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJsonResponse({ status: 'not_found', message: 'ไม่พบข้อมูล' });
      }

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === String(targetId).trim()) {
          const row = data[i];
          const record = mapRowToRecord(row);
          return createJsonResponse({ status: 'success', record: record });
        }
      }
      return createJsonResponse({ status: 'not_found', message: 'ไม่พบ Case ID: ' + targetId });
    }

    // Default: List recent cases (up to 50 latest)
    const data = sheet.getDataRange().getValues();
    const records = [];
    for (let i = Math.max(1, data.length - 50); i < data.length; i++) {
      if (data[i][0]) {
        records.unshift(mapRowToRecord(data[i]));
      }
    }
    return createJsonResponse({ status: 'success', total: records.length, records: records });

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();

    const caseId = postData.caseId || postData.id || ('CK-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000));
    const timestamp = postData.timestamp || new Date().toLocaleString('th-TH');

    const rowValues = [
      caseId,
      timestamp,
      postData.staffName || '',
      postData.petName || '',
      postData.ownerName || '',
      postData.animalType === 'dog' ? 'สุนัข' : (postData.animalType === 'cat' ? 'แมว' : (postData.animalType || '')),
      postData.weight || 0,
      postData.A || 0,
      postData.B || 0,
      postData.G || 0,
      postData.H || 0,
      postData.E || 0,
      postData.D || 0,
      postData.wheelchairType === '2_wheel' ? '2 ล้อหลัง' : '4 ล้อ',
      postData.pipeSize || '',
      formatPartString(postData.part_A_length, postData.part_A_count),
      formatPartString(postData.part_B_length, postData.part_B_count),
      formatPartString(postData.part_C_length, postData.part_C_count),
      formatPartString(postData.part_D_length, postData.part_D_count),
      formatPartString(postData.part_E_length, postData.part_E_count),
      formatPartString(postData.part_F_length, postData.part_F_count),
      formatPartString(postData.part_G_length, postData.part_G_count),
      postData.totalLengthMeters || 0,
      postData.standardPipesNeeded || 0,
      postData.qcStatus || 'รอดำเนินการ',
      postData.notes || ''
    ];

    // Check if ID already exists (UPSERT / Edit existing row)
    let updatedRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(caseId).trim()) {
        updatedRowIndex = i + 1; // 1-indexed for Sheets
        break;
      }
    }

    if (updatedRowIndex > 0) {
      // Update existing row
      sheet.getRange(updatedRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      return createJsonResponse({
        status: 'success',
        action: 'updated',
        caseId: caseId,
        row: updatedRowIndex,
        message: 'อัปเดตข้อมูล Case ID ' + caseId + ' เรียบร้อยแล้ว'
      });
    } else {
      // Append new row
      sheet.appendRow(rowValues);
      return createJsonResponse({
        status: 'success',
        action: 'created',
        caseId: caseId,
        row: sheet.getLastRow(),
        message: 'บันทึกข้อมูล Case ID ' + caseId + ' ลงใน Google Sheet เรียบร้อยแล้ว'
      });
    }

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    if (sheet) sheet.setName(SHEET_NAME);
  }
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Check header
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0284c7')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function formatPartString(len, count) {
  if (!len || !count) return '-';
  return len + ' cm x ' + count + ' ชิ้น';
}

function mapRowToRecord(row) {
  return {
    caseId: row[0] || '',
    timestamp: row[1] || '',
    staffName: row[2] || '',
    petName: row[3] || '',
    ownerName: row[4] || '',
    animalType: row[5] === 'สุนัข' ? 'dog' : (row[5] === 'แมว' ? 'cat' : row[5]),
    weight: Number(row[6]) || 0,
    A: Number(row[7]) || 0,
    B: Number(row[8]) || 0,
    G: Number(row[9]) || 0,
    H: Number(row[10]) || 0,
    E: Number(row[11]) || 0,
    D: Number(row[12]) || 0,
    wheelchairType: String(row[13]).includes('4') ? '4_wheel' : '2_wheel',
    pipeSize: row[14] || '',
    part_A: row[15] || '',
    part_B: row[16] || '',
    part_C: row[17] || '',
    part_D: row[18] || '',
    part_E: row[19] || '',
    part_F: row[20] || '',
    part_G: row[21] || '',
    totalLengthMeters: Number(row[22]) || 0,
    standardPipesNeeded: Number(row[23]) || 0,
    qcStatus: row[24] || '',
    notes: row[25] || ''
  };
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
