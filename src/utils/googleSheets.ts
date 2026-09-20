import {
  AnimalMeasurements,
  CalculationResult,
  GoogleSheetPayload,
  WheelchairType,
  PipeSize,
} from '../types/wheelchair';

export const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1EJASDHMSzbnt2mdlALjvwgmA8HkIiuHQGwlahMr44gg/edit?usp=sharing';

// ค่าเริ่มต้น Web App URL ส่วนกลาง (ทุกคนเข้าเว็บมาใช้งานได้ทันที 100%)
export const DEFAULT_APPS_SCRIPT_URL =
  (import.meta.env?.VITE_GOOGLE_APPS_SCRIPT_URL as string) ||
  'https://script.google.com/macros/s/AKfycbxm9QKwmZ2R8aJ5aR560Yr0XY5ht-2GuCKyJe0jxSoemM2v0slj5kXnszGX30K7r1Z9/exec';

const WEBHOOK_STORAGE_KEY = 'chakr_apps_script_url';

export function getAppsScriptUrl(): string {
  const customUrl = localStorage.getItem(WEBHOOK_STORAGE_KEY);
  if (customUrl && customUrl.trim()) {
    const trimmed = customUrl.trim();
    // ถ้าเคยเผลอเซฟ redirect echo URL ชั่วคราว ให้ลบทิ้งแล้วใช้ DEFAULT_APPS_SCRIPT_URL ที่ถูกต้อง
    if (trimmed.includes('script.googleusercontent.com')) {
      console.warn('ตรวจพบ URL ชั่วคราว (echo) ใน localStorage จึงรีเซ็ตกลับเป็นค่าเริ่มต้น');
      localStorage.removeItem(WEBHOOK_STORAGE_KEY);
      return DEFAULT_APPS_SCRIPT_URL;
    }
    return trimmed;
  }
  return DEFAULT_APPS_SCRIPT_URL;
}

export function setAppsScriptUrl(url: string): void {
  const trimmed = url.trim();
  if (trimmed.includes('script.googleusercontent.com')) {
    throw new Error('ไม่สามารถใช้ URL จาก script.googleusercontent.com ได้ กรุณาใช้ Web App URL ที่ลงท้ายด้วย /exec จาก Google Apps Script');
  }
  localStorage.setItem(WEBHOOK_STORAGE_KEY, trimmed);
}

export function generateCaseId(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CK-${year}${month}${day}-${rand}`;
}

export function buildGoogleSheetPayload(
  measurements: AnimalMeasurements,
  wheelchairType: WheelchairType,
  _pipeSize: PipeSize,
  calc: CalculationResult,
  qcStatusStr: string = 'ผ่านการตรวจ QC'
): GoogleSheetPayload {
  const getPart = (k: string) => calc.parts.find((p) => p.key === k);

  const partA = getPart('ก');
  const partB = getPart('ข');
  const partC = getPart('ค');
  const partD = getPart('ง');
  const partE = getPart('จ');
  const partF = getPart('ฉ');
  const partG = getPart('ช');

  return {
    action: 'save',
    caseId: measurements.caseId || generateCaseId(),
    timestamp: new Date().toLocaleString('th-TH'),
    staffName: measurements.staffName || 'ไม่ระบุ',
    petName: measurements.petName || 'ไม่ระบุชื่อ',
    ownerName: measurements.ownerName || '-',
    animalType: measurements.animalType,
    weight: measurements.weight || 0,
    A: measurements.A,
    B: measurements.B,
    G: measurements.G,
    H: measurements.H,
    E: measurements.E,
    D: measurements.D,
    wheelchairType,
    pipeSize: calc.pipeConstants.sizeName,
    part_A_length: partA?.lengthCm || 0,
    part_A_count: partA?.count || 0,
    part_B_length: partB?.lengthCm || 0,
    part_B_count: partB?.count || 0,
    part_C_length: partC?.lengthCm || 0,
    part_C_count: partC?.count || 0,
    part_D_length: partD?.lengthCm || 0,
    part_D_count: partD?.count || 0,
    part_E_length: partE?.lengthCm || 0,
    part_E_count: partE?.count || 0,
    part_F_length: partF?.lengthCm || 0,
    part_F_count: partF?.count || 0,
    part_G_length: partG?.lengthCm || 0,
    part_G_count: partG?.count || 0,
    totalLengthMeters: calc.totalLengthMeters,
    standardPipesNeeded: calc.standardPipesNeeded,
    qcStatus: qcStatusStr,
    notes: measurements.notes || '',
  };
}

export async function saveToGoogleSheet(
  payload: GoogleSheetPayload
): Promise<{ success: boolean; message: string; caseId: string }> {
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) {
    throw new Error(
      'ยังไม่ได้ตั้งค่า Google Apps Script Web App URL กรุณาตั้งค่าในหน้าต่างการเชื่อมต่อ Google Sheets'
    );
  }

  try {
    // การส่งข้อมูลไปยัง Google Apps Script Web App ด้วย text/plain จะไม่เกิด CORS preflight (OPTIONS)
    // ทำให้เบราว์เซอร์ส่งตรงและติดตาม redirect (302) ไปรับผลลัพธ์ JSON จาก Google ได้อย่างถูกต้อง
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && response.status !== 0) {
      throw new Error(`Google Apps Script ส่งกลับรหัสข้อผิดพลาด HTTP ${response.status}`);
    }

    const text = await response.text();
    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      // ในกรณีที่เบราว์เซอร์รับเป็นข้อความทั่วไป
      if (text.includes('success')) {
        result = { status: 'success', message: 'บันทึกข้อมูลเรียบร้อยแล้ว' };
      } else {
        throw new Error(`คำตอบจากเซิร์ฟเวอร์ไม่ใช่รูปแบบ JSON: ${text.slice(0, 100)}`);
      }
    }

    if (result.status === 'success') {
      return {
        success: true,
        message: result.message || 'บันทึกข้อมูลลง Google Sheet เรียบร้อยแล้ว',
        caseId: result.caseId || payload.caseId,
      };
    } else {
      throw new Error(result.message || 'บันทึกข้อมูลไม่สำเร็จ (เซิร์ฟเวอร์ส่งข้อผิดพลาดกลับมา)');
    }
  } catch (err: any) {
    throw new Error(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google Sheet');
  }
}

export async function fetchCaseFromGoogleSheet(
  caseId: string
): Promise<any> {
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) {
    throw new Error('กรุณาระบุ Google Apps Script Web App URL ก่อน');
  }

  const url = `${scriptUrl}?action=get&id=${encodeURIComponent(caseId.trim())}`;
  const response = await fetch(url);
  const result = await response.json();

  if (result.status === 'success' && result.record) {
    return result.record;
  } else {
    throw new Error(result.message || `ไม่พบ Case ID: ${caseId}`);
  }
}

export async function listRecentFromGoogleSheet(): Promise<any[]> {
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) return [];

  try {
    const url = `${scriptUrl}?action=list`;
    const response = await fetch(url);
    const result = await response.json();
    if (result.status === 'success' && Array.isArray(result.records)) {
      return result.records;
    }
    return [];
  } catch {
    return [];
  }
}
