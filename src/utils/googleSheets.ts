import {
  AnimalMeasurements,
  CalculationResult,
  GoogleSheetPayload,
  WheelchairType,
  PipeSize,
} from '../types/wheelchair';

export const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1EJASDHMSzbnt2mdlALjvwgmA8HkIiuHQGwlahMr44gg/edit?usp=sharing';

const WEBHOOK_STORAGE_KEY = 'chakr_apps_script_url';

export function getAppsScriptUrl(): string {
  return localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
}

export function setAppsScriptUrl(url: string): void {
  localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
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
    // Google Apps Script accepts POST with text/plain body to avoid CORS preflight issues
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.status === 'success') {
      return {
        success: true,
        message: result.message || 'บันทึกข้อมูลลง Google Sheet สำเร็จ',
        caseId: result.caseId || payload.caseId,
      };
    } else {
      throw new Error(result.message || 'บันทึกข้อมูลไม่สำเร็จ');
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
