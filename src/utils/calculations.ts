import {
  AnimalMeasurements,
  AnimalType,
  CalculationResult,
  CutPart,
  FittingItem,
  PipeConstants,
  PipeSize,
  WheelchairType,
} from '../types/wheelchair';

export const PIPE_CONSTANTS_MAP: Record<PipeSize, PipeConstants> = {
  '3_hun': {
    sizeName: '3 หุน',
    sizeInch: '3/8"',
    sizeMm: 'ประมาณ 17 mm (ชั้น 8.5/13.5)',
    X: 0, // ไม่ได้ใช้ในสูตร 3 หุน (ใช้ค่าคงที่ตายตัว)
    Y: 0,
    Z: 0,
    rearWheelRadius: 5.5,
    frontWheelHeight: 5.0,
    pipeDeduct: 3.0,
    qcWidthAdd: 1.0,
    qcChestDeduct: 4.0,
  },
  '4_hun': {
    sizeName: '4 หุน',
    sizeInch: '1/2"',
    sizeMm: 'ประมาณ 22 mm (ชั้น 8.5/13.5)',
    X: 2.0,
    Y: 8.5,
    Z: 2.5,
    rearWheelRadius: 7.0,
    frontWheelHeight: 6.5,
    pipeDeduct: 4.0,
    qcWidthAdd: 2.0,
    qcChestDeduct: 5.0,
  },
  '6_hun': {
    sizeName: '6 หุน',
    sizeInch: '3/4"',
    sizeMm: 'ประมาณ 26 mm (ชั้น 8.5/13.5)',
    X: 2.25,
    Y: 10.0,
    Z: 3.0,
    rearWheelRadius: 9.5,
    frontWheelHeight: 8.0,
    pipeDeduct: 6.0,
    qcWidthAdd: 3.0,
    qcChestDeduct: 6.0,
  },
};

/**
 * กำหนดขนาดท่อตามประเภทสัตว์และน้ำหนัก
 * - แมว: ใช้ 3 หุน เสมอ
 * - สุนัข:
 *    1 - 6 kg   -> 3 หุน
 *    7 - 12 kg  -> 4 หุน
 *    >= 13 kg   -> 6 หุน
 */
export function determinePipeSize(animalType: AnimalType, weight: number): PipeSize {
  if (animalType === 'cat') {
    return '3_hun';
  }
  if (weight <= 6) {
    return '3_hun';
  }
  if (weight <= 12) {
    return '4_hun';
  }
  return '6_hun';
}

/**
 * คำนวณความยาวชิ้นส่วนท่อ ก - ช
 */
export function calculateCutParts(
  measurements: AnimalMeasurements,
  wheelchairType: WheelchairType,
  pipeSize: PipeSize
): CutPart[] {
  const { A, B, G, E, D } = measurements;
  const c = PIPE_CONSTANTS_MAP[pipeSize];
  const parts: CutPart[] = [];

  const avgAB = (A + B) / 2;

  if (wheelchairType === '2_wheel') {
    if (pipeSize === '3_hun') {
      // 2 ล้อ 3 หุน
      // ก = G - 6 [2 ชิ้น]
      parts.push({
        key: 'ก',
        name: 'คานขวางด้านบน/หลัง',
        role: 'โครงขวางรับความกว้างตัวสัตว์',
        lengthCm: round(G - 6),
        count: 2,
        formulaStr: 'G - 6',
      });

      // ข = ((A+B)/2) - 5.5 - 3 [4 ชิ้น]
      parts.push({
        key: 'ข',
        name: 'เสาแนวตั้งล้อหลัง',
        role: 'ความสูงเสาข้างล้อหลัง',
        lengthCm: round(avgAB - 5.5 - 3),
        count: 4,
        formulaStr: '((A + B) / 2) - รัศมีล้อ (5.5) - 3',
      });

      // ค = 3 [2 ชิ้น]
      parts.push({
        key: 'ค',
        name: 'ท่อต่อแกนล้อ/ข้อต่อ',
        role: 'ช่วงต่อแกนล้อหลังและข้อต่อ',
        lengthCm: 3,
        count: 2,
        formulaStr: '3 (ค่าคงที่)',
      });

      // ง = (E - 7.5) / 2 [4 ชิ้น]
      parts.push({
        key: 'ง',
        name: 'คานแนวนอนขนานลำตัว',
        role: 'คานยาวด้านข้างตามความยาวตัว',
        lengthCm: round((E - 7.5) / 2),
        count: 4,
        formulaStr: '(E - 7.5) / 2',
      });

      // จ = ((A+B)/2) - D - 3 [2 ชิ้น]
      parts.push({
        key: 'จ',
        name: 'เสาปรับระดับคานหน้าอก',
        role: 'เสาแนวตั้งรับคานหน้าอกด้านหน้า',
        lengthCm: round(avgAB - D - 3),
        count: 2,
        formulaStr: '((A + B) / 2) - D - 3',
      });

      // ฉ = 6 [2 ชิ้น]
      parts.push({
        key: 'ฉ',
        name: 'คานเสริม/ตัวต่อหลัง',
        role: 'ช่วงต่อโครงยึดส่วนหลัง',
        lengthCm: 6,
        count: 2,
        formulaStr: '6 (ค่าคงที่)',
      });
    } else {
      // 2 ล้อ 4 หุน และ 6 หุน
      const { X, Y, rearWheelRadius, pipeDeduct } = c;

      // ก = G [2 ชิ้น]
      parts.push({
        key: 'ก',
        name: 'คานขวางด้านบน/หลัง',
        role: 'โครงขวางรับความกว้างตัวสัตว์',
        lengthCm: round(G),
        count: 2,
        formulaStr: 'G',
      });

      // ข = ((A+B)/2) - รัศมีล้อ - ขนาดท่อ [4 ชิ้น]
      parts.push({
        key: 'ข',
        name: 'เสาแนวตั้งล้อหลัง',
        role: 'ความสูงเสาข้างล้อหลัง',
        lengthCm: round(avgAB - rearWheelRadius - pipeDeduct),
        count: 4,
        formulaStr: `((A + B) / 2) - รัศมีล้อ (${rearWheelRadius}) - ${pipeDeduct}`,
      });

      // ค = 2X + 3 [2 ชิ้น]
      parts.push({
        key: 'ค',
        name: 'ท่อต่อแกนล้อ/ข้อต่อ',
        role: 'ช่วงต่อแกนล้อหลังและข้อต่อ',
        lengthCm: round(2 * X + 3),
        count: 2,
        formulaStr: `2X + 3 = 2(${X}) + 3`,
      });

      // ง = (E - 2Y + 4X) / 2 [4 ชิ้น]
      parts.push({
        key: 'ง',
        name: 'คานแนวนอนขนานลำตัว',
        role: 'คานยาวด้านข้างตามความยาวตัว',
        lengthCm: round((E - 2 * Y + 4 * X) / 2),
        count: 4,
        formulaStr: `(E - 2Y + 4X) / 2 = (E - 2(${Y}) + 4(${X})) / 2`,
      });

      // จ = ((A+B)/2) - D [2 ชิ้น]
      parts.push({
        key: 'จ',
        name: 'เสาปรับระดับคานหน้าอก',
        role: 'เสาแนวตั้งรับคานหน้าอกด้านหน้า',
        lengthCm: round(avgAB - D),
        count: 2,
        formulaStr: '((A + B) / 2) - D',
      });

      // ฉ = 2X [2 ชิ้น]
      parts.push({
        key: 'ฉ',
        name: 'คานเสริม/ตัวต่อหลัง',
        role: 'ช่วงต่อโครงยึดส่วนหลัง',
        lengthCm: round(2 * X),
        count: 2,
        formulaStr: `2X = 2(${X})`,
      });
    }
  } else {
    // 4 ล้อ
    if (pipeSize === '3_hun') {
      // 4 ล้อ 3 หุน
      // ก = G - 6 [2 ชิ้น]
      parts.push({
        key: 'ก',
        name: 'คานขวางด้านบน/หลัง',
        role: 'โครงขวางรับความกว้างตัวสัตว์',
        lengthCm: round(G - 6),
        count: 2,
        formulaStr: 'G - 6',
      });

      // ข = ((A+B)/2) - 5.5 - 3 [4 ชิ้น]
      parts.push({
        key: 'ข',
        name: 'เสาแนวตั้งล้อหลัง',
        role: 'ความสูงเสาข้างล้อหลัง',
        lengthCm: round(avgAB - 5.5 - 3),
        count: 4,
        formulaStr: '((A + B) / 2) - รัศมีล้อ (5.5) - 3',
      });

      // ค = 3 [4 ชิ้น]
      parts.push({
        key: 'ค',
        name: 'ท่อต่อแกนล้อ/ข้อต่อ',
        role: 'ช่วงต่อแกนล้อหน้าและล้อหลัง',
        lengthCm: 3,
        count: 4,
        formulaStr: '3 (ค่าคงที่)',
      });

      // ง = E - 12 [2 ชิ้น]
      parts.push({
        key: 'ง',
        name: 'คานแนวนอนขนานลำตัว',
        role: 'คานยาวด้านข้างตามความยาวตัว',
        lengthCm: round(E - 12),
        count: 2,
        formulaStr: 'E - 12',
      });

      // จ = ((A+B)/2) - D - 3 [2 ชิ้น]
      parts.push({
        key: 'จ',
        name: 'เสาปรับระดับคานหน้าอก',
        role: 'เสาแนวตั้งรับคานหน้าอกด้านหน้า',
        lengthCm: round(avgAB - D - 3),
        count: 2,
        formulaStr: '((A + B) / 2) - D - 3',
      });

      // ฉ = 6 [4 ชิ้น]
      parts.push({
        key: 'ฉ',
        name: 'คานเสริม/ตัวต่อโครง',
        role: 'ช่วงต่อโครงยึดล้อหน้าและหลัง',
        lengthCm: 6,
        count: 4,
        formulaStr: '6 (ค่าคงที่)',
      });

      // ช = ((A+B)/2) - 5 - 3 [4 ชิ้น]
      parts.push({
        key: 'ช',
        name: 'เสาแนวตั้งล้อหน้า',
        role: 'ความสูงเสาข้างล้อหน้า',
        lengthCm: round(avgAB - 5 - 3),
        count: 4,
        formulaStr: '((A + B) / 2) - ล้อหน้า (5) - 3',
      });
    } else {
      // 4 ล้อ 4 หุน และ 6 หุน
      const { X, Y, Z, rearWheelRadius, frontWheelHeight, pipeDeduct } = c;

      // ก = G [3 ชิ้น]
      parts.push({
        key: 'ก',
        name: 'คานขวางด้านบน/หน้า/หลัง',
        role: 'โครงขวางรับความกว้างตัวสัตว์',
        lengthCm: round(G),
        count: 3,
        formulaStr: 'G',
      });

      // ข = ((A+B)/2) - รัศมีล้อ - ขนาดท่อ [4 ชิ้น]
      parts.push({
        key: 'ข',
        name: 'เสาแนวตั้งล้อหลัง',
        role: 'ความสูงเสาข้างล้อหลัง',
        lengthCm: round(avgAB - rearWheelRadius - pipeDeduct),
        count: 4,
        formulaStr: `((A + B) / 2) - รัศมีล้อ (${rearWheelRadius}) - ${pipeDeduct}`,
      });

      // ค = 2X + 3 [4 ชิ้น]
      parts.push({
        key: 'ค',
        name: 'ท่อต่อแกนล้อ/ข้อต่อ',
        role: 'ช่วงต่อแกนล้อหน้าและหลัง',
        lengthCm: round(2 * X + 3),
        count: 4,
        formulaStr: `2X + 3 = 2(${X}) + 3`,
      });

      // ง = (E - 2Y + 4X) / 2 [4 ชิ้น]
      parts.push({
        key: 'ง',
        name: 'คานแนวนอนขนานลำตัว',
        role: 'คานยาวด้านข้างตามความยาวตัว',
        lengthCm: round((E - 2 * Y + 4 * X) / 2),
        count: 4,
        formulaStr: `(E - 2Y + 4X) / 2 = (E - 2(${Y}) + 4(${X})) / 2`,
      });

      // จ = ((A+B)/2) - D [4 ชิ้น]
      parts.push({
        key: 'จ',
        name: 'เสาปรับระดับคานหน้าอก',
        role: 'เสาแนวตั้งรับคานหน้าอกด้านหน้า',
        lengthCm: round(avgAB - D),
        count: 4,
        formulaStr: '((A + B) / 2) - D',
      });

      // ฉ = 2X [4 ชิ้น]
      parts.push({
        key: 'ฉ',
        name: 'คานเสริม/ตัวต่อโครง',
        role: 'ช่วงต่อโครงยึดล้อหน้าและหลัง',
        lengthCm: round(2 * X),
        count: 4,
        formulaStr: `2X = 2(${X})`,
      });

      // ช = ((A+B)/2) - Z - ความสูงล้อหน้า - ขนาดท่อ [4 ชิ้น]
      parts.push({
        key: 'ช',
        name: 'เสาแนวตั้งล้อหน้า',
        role: 'ความสูงเสาข้างล้อหน้า',
        lengthCm: round(avgAB - Z - frontWheelHeight - pipeDeduct),
        count: 4,
        formulaStr: `((A + B) / 2) - Z (${Z}) - ล้อหน้า (${frontWheelHeight}) - ${pipeDeduct}`,
      });
    }
  }

  return parts;
}

/**
 * คำนวณภาพรวมของวัสดุ (ท่อ PVC, ข้อต่อ, น็อต, ล้อ)
 */
export function calculateFullWheelchair(
  measurements: AnimalMeasurements,
  wheelchairType: WheelchairType,
  pipeSize: PipeSize
): CalculationResult {
  const pipeConstants = PIPE_CONSTANTS_MAP[pipeSize];
  const parts = calculateCutParts(measurements, wheelchairType, pipeSize);

  // คำนวณความยาวรวม (รวมการสูญเสียจากการตัดใบเลื่อย ~3 มม. ต่อชิ้น)
  const cuttingWastePerPieceCm = 0.3;
  let totalCm = 0;
  parts.forEach((p) => {
    totalCm += (Math.max(0, p.lengthCm) + cuttingWastePerPieceCm) * p.count;
  });

  const totalLengthCm = round(totalCm);
  const totalLengthMeters = round(totalLengthCm / 100);

  // ท่อ PVC มาตรฐานยาว 4 เมตร (400 ซม.)
  const standardPipesNeeded = Math.max(1, Math.ceil(totalLengthCm / 380)); // คิดเผื่อหัวท้ายเหลือตัด 3.8 ม.

  // คำนวณอุปกรณ์และข้อต่อตามประเภทวีลแชร์
  const fittings: FittingItem[] = [];
  const hardware: FittingItem[] = [];

  const sizeStr = pipeConstants.sizeName;

  const chestCircumference = measurements.H;
  const supportSpec = chestCircumference
    ? `พยุงลำตัวและอก (รอบอก H = ${chestCircumference} ซม.)`
    : 'พยุงลำตัวและอก';

  if (wheelchairType === '2_wheel') {
    fittings.push({ name: `ข้องอ 90° PVC (${sizeStr})`, count: 4, spec: 'เกรดหนา 8.5 หรือ 13.5' });
    fittings.push({ name: `ข้อต่อสามทาง 90° PVC (${sizeStr})`, count: 6, spec: 'เกรดหนา' });

    hardware.push({
      name: `ล้อหลังขวา ขนาดรัศมี ${pipeConstants.rearWheelRadius} ซม. (⌀${pipeConstants.rearWheelRadius * 2} ซม.)`,
      count: 1,
      spec: 'ล้อยางตามขนาดท่อ',
    });
    hardware.push({
      name: `ล้อหลังซ้าย ขนาดรัศมี ${pipeConstants.rearWheelRadius} ซม. (⌀${pipeConstants.rearWheelRadius * 2} ซม.)`,
      count: 1,
      spec: 'ล้อยางตามขนาดท่อ',
    });
    hardware.push({ name: 'ก้ามปู (คลิปล็อค)', count: 4, spec: 'สำหรับ Lock ซัพพอร์ตหน้า' });
    hardware.push({ name: 'ชุดซับพอร์ตตามขนาด', count: 1, spec: supportSpec });
  } else {
    // 4 ล้อ
    fittings.push({ name: `ข้องอ 90° PVC (${sizeStr})`, count: 8, spec: 'เกรดหนา 8.5 หรือ 13.5' });
    fittings.push({ name: `ข้อต่อสามทาง 90° PVC (${sizeStr})`, count: 10, spec: 'เกรดหนา' });

    hardware.push({
      name: `ล้อหลังขวา ขนาดรัศมี ${pipeConstants.rearWheelRadius} ซม. (⌀${pipeConstants.rearWheelRadius * 2} ซม.)`,
      count: 1,
      spec: 'ล้อยางรับน้ำหนักหลัง',
    });
    hardware.push({
      name: `ล้อหลังซ้าย ขนาดรัศมี ${pipeConstants.rearWheelRadius} ซม. (⌀${pipeConstants.rearWheelRadius * 2} ซม.)`,
      count: 1,
      spec: 'ล้อยางรับน้ำหนักหลัง',
    });
    hardware.push({
      name: `ล้อหน้าขวา ขนาดความสูง ${pipeConstants.frontWheelHeight} ซม.`,
      count: 1,
      spec: 'ล้อคาสเตอร์/ล้อหมุนรอบทิศทาง',
    });
    hardware.push({
      name: `ล้อหน้าซ้าย ขนาดความสูง ${pipeConstants.frontWheelHeight} ซม.`,
      count: 1,
      spec: 'ล้อคาสเตอร์/ล้อหมุนรอบทิศทาง',
    });
    hardware.push({ name: 'ชุดซับพอร์ตตามขนาด', count: 1, spec: supportSpec });
  }

  return {
    wheelchairType,
    pipeSize,
    pipeConstants,
    parts,
    totalLengthCm,
    totalLengthMeters,
    standardPipesNeeded,
    fittings,
    hardware,
  };
}

function round(val: number): number {
  return Math.round(val * 10) / 10;
}
