export type AnimalType = 'dog' | 'cat';

export type WheelchairType = '2_wheel' | '4_wheel';

export type PipeSize = '3_hun' | '4_hun' | '6_hun';

export interface AnimalMeasurements {
  caseId: string; // รหัสเคส (เช่น CK-2026-0001)
  staffName: string; // ชื่อ Staff ผู้คำนวณ
  petName: string; // ชื่อสัตว์เจ้าของวีลแชร์
  ownerName: string; // ชื่อเจ้าของ / เบอร์ติดต่อ
  animalType: AnimalType;
  weight: number; // in kg
  A: number; // ความสูงจากพื้นถึงหลังสะโพก (cm)
  B: number; // ความสูงจากพื้นถึงท้อง (cm)
  G: number; // ความกว้างลำตัว (cm)
  H: number; // ความยาวรอบอกหรือรอบท้อง (cm)
  E: number; // ความยาวจากหลังขาหน้าถึงกลางสะโพก (cm)
  D: number; // ความสูงจากพื้นถึงหน้าอก (cm)
  notes?: string;
}

export type PartKey = 'ก' | 'ข' | 'ค' | 'ง' | 'จ' | 'ฉ' | 'ช';

export interface CutPart {
  key: PartKey;
  name: string;
  role: string;
  lengthCm: number;
  count: number;
  formulaStr: string;
  notes?: string;
}

export interface PipeConstants {
  sizeName: string;
  sizeInch: string;
  sizeMm: string;
  X: number;
  Y: number;
  Z: number;
  rearWheelRadius: number;
  frontWheelHeight: number;
  pipeDeduct: number;
  qcWidthAdd: number;
  qcChestDeduct: number;
}

export interface FittingItem {
  name: string;
  count: number;
  spec: string;
}

export interface CalculationResult {
  wheelchairType: WheelchairType;
  pipeSize: PipeSize;
  pipeConstants: PipeConstants;
  parts: CutPart[];
  totalLengthCm: number;
  totalLengthMeters: number;
  standardPipesNeeded: number;
  fittings: FittingItem[];
  hardware: FittingItem[];
}

export interface QCTargetItem {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  formulaDescription: string;
  toleranceCm: number;
  measuredValue?: number;
  isPassed?: boolean;
}

export interface SavedCase {
  id: string;
  createdAt: string;
  updatedAt?: string;
  measurements: AnimalMeasurements;
  wheelchairType: WheelchairType;
  pipeSize: PipeSize;
  calculationResult: CalculationResult;
  qcResults?: Record<string, number>;
  syncedToGoogleSheet?: boolean;
}

export interface GoogleSheetPayload {
  action: 'save' | 'get' | 'list';
  id?: string;
  caseId: string;
  timestamp: string;
  staffName: string;
  petName: string;
  ownerName: string;
  animalType: string;
  weight: number;
  A: number;
  B: number;
  G: number;
  H: number;
  E: number;
  D: number;
  wheelchairType: string;
  pipeSize: string;
  part_A_length: number; // ก
  part_A_count: number;
  part_B_length: number; // ข
  part_B_count: number;
  part_C_length: number; // ค
  part_C_count: number;
  part_D_length: number; // ง
  part_D_count: number;
  part_E_length: number; // จ
  part_E_count: number;
  part_F_length: number; // ฉ
  part_F_count: number;
  part_G_length: number; // ช (ถ้ามี)
  part_G_count: number;
  totalLengthMeters: number;
  standardPipesNeeded: number;
  qcStatus: string;
  notes: string;
}
