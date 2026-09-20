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
  const {
    wheelchairType,
    pipeConstants,
    parts,
    totalLengthCm,
    totalLengthMeters,
    standardPipesNeeded,
    fittings,
    hardware,
  } = calculationResult;

  const qcItems = calculateQCTargets(measurements, wheelchairType, calculationResult.pipeSize);

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="print-only">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 7mm 9mm 7mm 9mm;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-only {
            display: block !important;
          }
        }
        .print-single-page {
          width: 100%;
          max-width: 192mm;
          max-height: 280mm;
          margin: 0 auto;
          box-sizing: border-box;
          font-family: var(--font-thai), 'Prompt', -apple-system, sans-serif;
          font-size: 8pt;
          line-height: 1.25;
          color: #0f172a;
          overflow: hidden;
          page-break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
        }
      `}</style>

      <div className="print-single-page">
        {/* ========================================================= */}
        {/* 1. COMPACT OFFICIAL HEADER WITH COLOR ACCENT              */}
        {/* ========================================================= */}
        <div
          style={{
            background: '#0284c7',
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '5px',
          }}
        >
          <div>
            <div style={{ fontSize: '11pt', fontWeight: 800, letterSpacing: '-0.01em' }}>
              ใบงานตัดท่อ PVC & ตรวจรับงาน (QC) วีลแชร์สัตว์พิการ
            </div>
            <div style={{ fontSize: '7.5pt', opacity: 0.95 }}>
              โครงการเพราะมีน้ำใจจึงมีชีวิต (Wheelchair for Pets) • มูลนิธิศาสตราจารย์ ดร.จักร พิชัยรณรงค์สงคราม
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '7.5pt' }}>
            <div style={{ fontWeight: 700 }}>วันที่: {currentDate}</div>
            <div style={{ opacity: 0.9 }}>รหัสเคส: {measurements.caseId || '-'}</div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. CASE INFO & MEASUREMENTS ROW                           */}
        {/* ========================================================= */}
        <div
          style={{
            border: '1px solid #0284c7',
            borderRadius: '4px',
            padding: '4px 8px',
            marginBottom: '5px',
            background: '#f8fafc',
            fontSize: '7.5pt',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 1.4fr', gap: '2px 8px' }}>
            <div>
              <strong>ผู้คำนวณ (Staff):</strong> {measurements.staffName || '-'}
            </div>
            <div>
              <strong>ชื่อสัตว์:</strong> {measurements.petName || '-'} ({measurements.animalType === 'dog' ? 'สุนัข' : 'แมว'} {measurements.weight || 0} กก.)
            </div>
            <div>
              <strong>เจ้าของ:</strong> {measurements.ownerName || '-'}
            </div>
            <div>
              <strong>โมเดล:</strong>{' '}
              <span style={{ color: '#0369a1', fontWeight: 700 }}>
                {wheelchairType === '2_wheel' ? '2 ล้อหลัง' : '4 ล้อ'} (ท่อ {pipeConstants.sizeName})
              </span>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px dashed #cbd5e1',
              marginTop: '3px',
              paddingTop: '2px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              fontWeight: 600,
              color: '#0f172a',
            }}
          >
            <span style={{ color: '#0369a1' }}>สัดส่วนวัดตัว (ซม.):</span>
            <span>A (สูงสะโพก) = <strong style={{ color: '#0284c7' }}>{measurements.A}</strong></span>
            <span>B (สูงท้อง) = <strong style={{ color: '#0369a1' }}>{measurements.B}</strong></span>
            <span>G (กว้างตัว) = <strong style={{ color: '#0d9488' }}>{measurements.G}</strong></span>
            <span>H (รอบอก) = <strong style={{ color: '#8b5cf6' }}>{measurements.H}</strong></span>
            <span>E (ยาวลำตัว) = <strong style={{ color: '#ea580c' }}>{measurements.E}</strong></span>
            <span>D (สูงอก) = <strong style={{ color: '#e11d48' }}>{measurements.D}</strong></span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CUTTING PARTS TABLE (ชิ้น ก - ช)                      */}
        {/* ========================================================= */}
        <div style={{ marginBottom: '5px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2px',
              fontSize: '8pt',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            <span>1. รายการตัดท่อ PVC ขาว (เกรดหนา 8.5/13.5)</span>
            <span style={{ color: '#0369a1', fontSize: '7.5pt' }}>
              ความยาวรวม: {totalLengthCm} ซม. ({totalLengthMeters} ม.) • ใช้ท่อ 4 ม. = <strong>{standardPipesNeeded} เส้น</strong>
            </span>
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '7.2pt',
              textAlign: 'left',
              border: '1px solid #cbd5e1',
            }}
          >
            <thead>
              <tr style={{ background: '#e0f2fe', color: '#0369a1', borderBottom: '1px solid #0284c7' }}>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center', width: '32px' }}>ชิ้น</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px' }}>ตำแหน่งและหน้าที่</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'right', width: '70px' }}>ความยาว (ซม.)</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center', width: '45px' }}>จำนวน</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'right', width: '65px' }}>รวม (ซม.)</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px' }}>สูตรการคำนวณ</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center', width: '40px' }}>ตัดแล้ว</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, idx) => (
                <tr key={p.key} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center', fontWeight: 800, color: '#0284c7' }}>
                    {p.key}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px' }}>{p.name}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'right', fontWeight: 700 }}>
                    {p.lengthCm}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center', fontWeight: 600 }}>
                    {p.count}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'right' }}>
                    {(p.lengthCm * p.count).toFixed(1)}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', color: '#475569', fontSize: '6.8pt' }}>
                    {p.formulaStr}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center' }}>
                    <div style={{ width: '10px', height: '10px', border: '1px solid #475569', margin: '0 auto' }}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* 4. MATERIALS & HARDWARE SUMMARY (COMPACT 2-COL BOX)       */}
        {/* ========================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            marginBottom: '5px',
            fontSize: '7.2pt',
          }}
        >
          {/* Left: PVC Fittings */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '3px 6px',
              background: '#f8fafc',
            }}
          >
            <div style={{ fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>
              ข้อต่อ PVC ({pipeConstants.sizeName})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px 6px' }}>
              {fittings.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• {f.name}:</span>
                  <strong>{f.count} ตัว</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Wheels & Harness */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '3px 6px',
              background: '#f8fafc',
            }}
          >
            <div style={{ fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '1px', marginBottom: '2px' }}>
              ล้อและชุดสายรัดพยุงตัว
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px 6px' }}>
              {hardware.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• {h.name}:</span>
                  <strong>
                    {h.count} {h.name.includes('ล้อ') ? 'ล้อ' : 'ชุด'}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. QC INSPECTION CHECKLIST TABLE                          */}
        {/* ========================================================= */}
        <div style={{ marginBottom: '5px' }}>
          <div
            style={{
              fontSize: '8pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '2px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>2. ตรวจรับรองคุณภาพหลังประกอบ (QC Inspection Checklist)</span>
            <span style={{ fontSize: '7pt', color: '#64748b' }}>เกณฑ์มาตรฐานยอมรับ: ค่าคลาดเคลื่อนไม่เกิน ±0.5 ซม.</span>
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '7.2pt',
              textAlign: 'left',
              border: '1px solid #cbd5e1',
            }}
          >
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#334155', borderBottom: '1px solid #94a3b8' }}>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px' }}>รายการตรวจสอบ</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', width: '85px', textAlign: 'center' }}>เป้าหมาย</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', width: '80px', textAlign: 'center' }}>วัดได้จริง</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '2px 4px', width: '90px', textAlign: 'center' }}>ผลการตรวจ</th>
              </tr>
            </thead>
            <tbody>
              {qcItems.map((q) => {
                const val = qcMeasuredValues[q.id];
                return (
                  <tr key={q.id}>
                    <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px' }}>
                      <strong>{q.title}</strong>{' '}
                      <span style={{ color: '#64748b', fontSize: '6.8pt' }}>({q.description})</span>
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center', fontWeight: 700 }}>
                      {q.id === 'qc_wheel_alignment' ? 'ระนาบเสมอ' : `${q.targetValue} ซม.`}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center' }}>
                      {val !== undefined ? `${val} ซม.` : '.............. ซม.'}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '2px 4px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginRight: '6px' }}>
                        <span style={{ width: '9px', height: '9px', border: '1px solid #334155', display: 'inline-block' }}></span> ผ่าน
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <span style={{ width: '9px', height: '9px', border: '1px solid #334155', display: 'inline-block' }}></span> แก้ไข
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* 6. SIGNATURE BLOCK (COMPACT 2 COLUMNS)                    */}
        {/* ========================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginTop: '6px',
            paddingTop: '4px',
            borderTop: '1px solid #94a3b8',
            fontSize: '7.5pt',
            textAlign: 'center',
          }}
        >
          <div>
            <div>ลงชื่อ .............................................................. ช่างผู้ตัดประกอบ</div>
            <div style={{ marginTop: '2px' }}>({measurements.staffName || '........................................................'})</div>
            <div style={{ marginTop: '2px', color: '#64748b', fontSize: '7pt' }}>วันที่ ........ / ........ / ................</div>
          </div>
          <div>
            <div>ลงชื่อ .............................................................. ผู้ตรวจ QC / สัตวแพทย์</div>
            <div style={{ marginTop: '2px' }}>( .............................................................. )</div>
            <div style={{ marginTop: '2px', color: '#64748b', fontSize: '7pt' }}>วันที่ ........ / ........ / ................</div>
          </div>
        </div>
      </div>
    </div>
  );
};
