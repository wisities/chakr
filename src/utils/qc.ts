import {
  AnimalMeasurements,
  PipeSize,
  QCTargetItem,
  WheelchairType,
} from '../types/wheelchair';
import { PIPE_CONSTANTS_MAP } from './calculations';

export function calculateQCTargets(
  measurements: AnimalMeasurements,
  wheelchairType: WheelchairType,
  pipeSize: PipeSize
): QCTargetItem[] {
  const { A, B, G, E, D } = measurements;
  const c = PIPE_CONSTANTS_MAP[pipeSize];
  const avgAB = (A + B) / 2;

  const items: QCTargetItem[] = [
    {
      id: 'qc_length',
      title: '1. ความยาวช่วงตัว (หลังขาหน้าถึงกลางล้อหลัง)',
      description: 'วัดจากตำแหน่งหลังขาหน้าของสัตว์ยาวมาจนถึงกึ่งกลางแกนล้อหลัง',
      targetValue: Math.round(E * 10) / 10,
      formulaDescription: `เท่ากับค่า E (${E} ซม.)`,
      toleranceCm: 0.5,
    },
    {
      id: 'qc_height',
      title: '2. ความสูงวีลแชร์ (กึ่งกลางท่อบนถึงพื้น)',
      description: 'วัดในแนวดิ่งจากจุดกึ่งกลางของท่อแนวนอนด้านบนลงไปจรดพื้น',
      targetValue: Math.round(avgAB * 10) / 10,
      formulaDescription: `(A + B) / 2 = (${A} + ${B}) / 2 = ${avgAB.toFixed(1)} ซม.`,
      toleranceCm: 0.5,
    },
    {
      id: 'qc_width',
      title: '3. ความกว้างด้านในของวีลแชร์ (ระยะในท่อ ซ้าย-ขวา)',
      description: `วัดระยะว่างด้านในของท่อขวาและท่อซ้าย (สำหรับขนาด ${c.sizeName} ให้บวกเพิ่ม ${c.qcWidthAdd} ซม.)`,
      targetValue: Math.round((G + c.qcWidthAdd) * 10) / 10,
      formulaDescription: `G + ${c.qcWidthAdd} (${c.sizeName}) = ${G} + ${c.qcWidthAdd} = ${(G + c.qcWidthAdd).toFixed(1)} ซม.`,
      toleranceCm: 0.5,
    },
    {
      id: 'qc_chest_bar',
      title: '4. ความสูงคานตรงหน้าอก (ด้านบนท่อถึงพื้น)',
      description: `วัดจากขอบบนสุดของคานหน้าอกลงมาถึงพื้น (สำหรับขนาด ${c.sizeName} ให้หักลบออก ${c.qcChestDeduct} ซม.)`,
      targetValue: Math.round(Math.max(0, D - c.qcChestDeduct) * 10) / 10,
      formulaDescription: `D - ${c.qcChestDeduct} (${c.sizeName}) = ${D} - ${c.qcChestDeduct} = ${(D - c.qcChestDeduct).toFixed(1)} ซม.`,
      toleranceCm: 0.5,
    },
  ];

  if (wheelchairType === '4_wheel') {
    items.push({
      id: 'qc_wheel_alignment',
      title: '5. ระนาบ 4 ล้อสัมผัสพื้นสม่ำเสมอ',
      description: 'ทดสอบวางบนพื้นเรียบ ทุกล้อต้องแตะพื้นพร้อมกัน โครงสร้างต้องได้ฉากและไม่เอียงบิดตัว',
      targetValue: 0,
      formulaDescription: 'ความสูงระนาบหน้า-หลังได้ระดับขนานพื้น',
      toleranceCm: 0,
    });
  }

  return items;
}

export function evaluateQCItem(
  item: QCTargetItem,
  measuredValue: number | undefined
): boolean {
  if (measuredValue === undefined || isNaN(measuredValue)) return false;
  if (item.id === 'qc_wheel_alignment') {
    return measuredValue === 1; // 1 = ผ่าน
  }
  const diff = Math.abs(measuredValue - item.targetValue);
  return diff <= item.toleranceCm;
}
