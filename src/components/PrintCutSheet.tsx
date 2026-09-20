import React from 'react';
import { AnimalMeasurements, CalculationResult } from '../types/wheelchair';
import { calculateQCTargets } from '../utils/qc';

interface PrintCutSheetProps {
  measurements: AnimalMeasurements;
  calculationResult: CalculationResult;
  qcMeasuredValues: Record<string, number>;
}

export const PrintCutSheet: React.FC<PrintCutSheetProps> = ({
  measurements,
  calculationResult,
  qcMeasuredValues,
}) => {
  const { wheelchairType, pipeConstants, parts, totalLengthCm, totalLengthMeters, standardPipesNeeded, fittings, hardware } = calculationResult;
  const qcItems = calculateQCTargets(measurements, wheelchairType, calculationResult.pipeSize);

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="print-only" style={{ padding: '1.5rem', color: '#000000', fontFamily: 'var(--font-thai)' }}>
      {/* Official Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
          ใบงานคำนวณการตัดท่อ PVC และตรวจรับงาน (QC) วีลแชร์สัตว์พิการ
        </h2>
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>
          โครงการเพราะมีน้ำใจจึงมีชีวิต (Wheelchair for Pets)
        </div>
        <div style={{ fontSize: '0.85rem' }}>
          มูลนิธิศาสตราจารย์ ดร.จักร พิชัยรณรงค์สงคราม • วันที่ออกเอกสาร: {currentDate}
        </div>
      </div>

      {/* Case Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        border: '1px solid #000',
        padding: '0.75rem',
        marginBottom: '1rem',
        fontSize: '0.85rem'
      }}>
        <div><strong>รหัสเคส (Case ID):</strong> {measurements.caseId || '-'}</div>
        <div><strong>Staff ผู้คำนวณ:</strong> {measurements.staffName || '-'}</div>
        <div><strong>ชื่อสัตว์เลี้ยง:</strong> {measurements.petName || '-'}</div>
        <div><strong>ผู้ดูแล/เจ้าของ:</strong> {measurements.ownerName || '-'}</div>
        
        <div><strong>ประเภทสัตว์:</strong> {measurements.animalType === 'dog' ? 'สุนัข' : 'แมว'} ({measurements.weight || 0} กก.)</div>
        <div style={{ gridColumn: 'span 3' }}><strong>รูปแบบวีลแชร์:</strong> {wheelchairType === '2_wheel' ? '2 ล้อหลัง' : '4 ล้อ'} (ท่อ PVC ขนาด {pipeConstants.sizeName} / {pipeConstants.sizeInch})</div>

        {/* Measurements row */}
        <div style={{ gridColumn: 'span 4', borderTop: '1px dashed #666', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
          <strong>สัดส่วนที่วัดได้ (ซม.): </strong>
          A (สูงสะโพก) = <strong>{measurements.A}</strong> | 
          B (สูงท้อง) = <strong>{measurements.B}</strong> | 
          G (กว้างตัว) = <strong>{measurements.G}</strong> | 
          H (รอบอก) = <strong>{measurements.H}</strong> | 
          E (ยาวลำตัว) = <strong>{measurements.E}</strong> | 
          D (สูงอก) = <strong>{measurements.D}</strong>
        </div>
      </div>

      {/* Cutting Table */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '0.2rem', marginBottom: '0.4rem' }}>
          1. รายการตัดท่อ PVC (ความยาวรวม {totalLengthCm} ซม. / {totalLengthMeters} ม. • ใช้ท่อ 4ม. จำนวน {standardPipesNeeded} เส้น)
        </h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f0f0f0', borderBottom: '1px solid #000' }}>
              <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center', width: '45px' }}>ชิ้น</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem' }}>ตำแหน่งและหน้าที่</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'right', width: '90px' }}>ความยาว (ซม.)</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center', width: '60px' }}>จำนวน</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'right', width: '90px' }}>ความยาวรวม</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem' }}>สูตรการคำนวณ</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center', width: '50px' }}>ตัดแล้ว</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p) => (
              <tr key={p.key}>
                <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center', fontWeight: 'bold' }}>{p.key}</td>
                <td style={{ border: '1px solid #000', padding: '0.3rem' }}>{p.name}</td>
                <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'right', fontWeight: 'bold' }}>{p.lengthCm}</td>
                <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center' }}>{p.count}</td>
                <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'right' }}>{(p.lengthCm * p.count).toFixed(1)}</td>
                <td style={{ border: '1px solid #000', padding: '0.3rem', fontSize: '0.78rem' }}>{p.formulaStr}</td>
                <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center' }}>[ &nbsp; ]</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Materials & Fittings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.825rem' }}>
        <div style={{ border: '1px solid #000', padding: '0.5rem' }}>
          <strong>ข้อต่อ PVC ({pipeConstants.sizeName}):</strong>
          <ul style={{ paddingLeft: '1.2rem', margin: '0.3rem 0 0 0' }}>
            {fittings.map((f, i) => (
              <li key={i}>{f.name} — <strong>{f.count} ตัว</strong></li>
            ))}
          </ul>
        </div>
        <div style={{ border: '1px solid #000', padding: '0.5rem' }}>
          <strong>ล้อและอุปกรณ์เสริม:</strong>
          <ul style={{ paddingLeft: '1.2rem', margin: '0.3rem 0 0 0' }}>
            {hardware.map((h, i) => (
              <li key={i}>{h.name} — <strong>{h.count} {h.name.includes('ล้อ') ? 'ล้อ' : 'ชุด'}</strong></li>
            ))}
          </ul>
        </div>
      </div>

      {/* QC Verification Table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '0.2rem', marginBottom: '0.4rem' }}>
          2. ตรวจรับรองคุณภาพหลังประกอบ (QC Inspection Checklist)
        </h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #000', padding: '0.3rem' }}>รายการตรวจสอบ</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem', width: '100px', textAlign: 'center' }}>ค่ามาตรฐาน</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem', width: '100px', textAlign: 'center' }}>ค่าที่วัดได้จริง</th>
              <th style={{ border: '1px solid #000', padding: '0.3rem', width: '80px', textAlign: 'center' }}>ผลตรวจ</th>
            </tr>
          </thead>
          <tbody>
            {qcItems.map((q) => {
              const val = qcMeasuredValues[q.id];
              return (
                <tr key={q.id}>
                  <td style={{ border: '1px solid #000', padding: '0.3rem' }}>
                    <strong>{q.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#444' }}>{q.description}</div>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center', fontWeight: 'bold' }}>
                    {q.id === 'qc_wheel_alignment' ? 'ระนาบเสมอ' : `${q.targetValue} ซม.`}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center' }}>
                    {val !== undefined ? `${val} ซม.` : '................... ซม.'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '0.3rem', textAlign: 'center' }}>
                    [ &nbsp; ] ผ่าน &nbsp; [ &nbsp; ] ปรับปรุง
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem', fontSize: '0.85rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div>ลงชื่อ .............................................................. ช่างผู้ประกอบ ({measurements.staffName || '................................'})</div>
          <div style={{ marginTop: '0.35rem' }}>( .............................................................. )</div>
          <div style={{ marginTop: '0.35rem' }}>วันที่ ........ / ........ / ................</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>ลงชื่อ .............................................................. ผู้ตรวจ QC / สัตวแพทย์</div>
          <div style={{ marginTop: '0.35rem' }}>( .............................................................. )</div>
          <div style={{ marginTop: '0.35rem' }}>วันที่ ........ / ........ / ................</div>
        </div>
      </div>
    </div>
  );
};
