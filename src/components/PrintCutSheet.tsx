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
            padding: '6px 12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5pt', fontWeight: 800, letterSpacing: '-0.01em' }}>
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
        {/* 2. CASE INFO & MEASUREMENTS CELLS (EXPANDED GRID BOXES)  */}
        {/* ========================================================= */}
        <div
          style={{
            border: '1.5px solid #0284c7',
            borderRadius: '4px',
            marginBottom: '7px',
            background: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {/* General Case Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.3fr 1.3fr 1.2fr',
              background: '#f8fafc',
              borderBottom: '1px solid #cbd5e1',
              fontSize: '7.5pt',
            }}
          >
            <div style={{ padding: '4px 8px', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '6.8pt', fontWeight: 600 }}>ผู้คำนวณ (Staff)</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '1px' }}>
                {measurements.staffName || '-'}
              </div>
            </div>
            <div style={{ padding: '4px 8px', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '6.8pt', fontWeight: 600 }}>ชื่อสัตว์ / ชนิด / น้ำหนัก</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '1px' }}>
                {measurements.petName || '-'} ({measurements.animalType === 'dog' ? 'สุนัข' : 'แมว'} {measurements.weight || 0} กก.)
              </div>
            </div>
            <div style={{ padding: '4px 8px', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '6.8pt', fontWeight: 600 }}>ชื่อเจ้าของ / เบอร์โทร</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '1px' }}>
                {measurements.ownerName || '-'}
              </div>
            </div>
            <div style={{ padding: '4px 8px' }}>
              <div style={{ color: '#64748b', fontSize: '6.8pt', fontWeight: 600 }}>โมเดลวีลแชร์ / ท่อ PVC</div>
              <div style={{ fontWeight: 700, color: '#0284c7', marginTop: '1px' }}>
                {wheelchairType === '2_wheel' ? '2 ล้อหลัง' : '4 ล้อ'} ({pipeConstants.sizeName})
              </div>
            </div>
          </div>

          {/* Measurements 6 Grid Cells */}
          <div style={{ padding: '5px 8px', background: '#ffffff' }}>
            <div style={{ fontSize: '7pt', fontWeight: 700, color: '#0369a1', marginBottom: '3px' }}>
              สัดส่วนวัดตัวสัตว์เลี้ยง (Body Measurements - ซม.):
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '5px',
                textAlign: 'center',
              }}
            >
              {[
                { label: 'A (สูงสะโพก)', val: measurements.A, color: '#0284c7', bg: '#f0f9ff' },
                { label: 'B (สูงท้อง)', val: measurements.B, color: '#0369a1', bg: '#f0f9ff' },
                { label: 'G (กว้างตัว)', val: measurements.G, color: '#0d9488', bg: '#f0fdfa' },
                { label: 'H (รอบอก)', val: measurements.H, color: '#7c3aed', bg: '#f5f3ff' },
                { label: 'E (ยาวลำตัว)', val: measurements.E, color: '#ea580c', bg: '#fff7ed' },
                { label: 'D (สูงอก)', val: measurements.D, color: '#e11d48', bg: '#fff1f2' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    border: `1px solid ${m.color}40`,
                    borderRadius: '4px',
                    background: m.bg,
                    padding: '3px 2px',
                  }}
                >
                  <div style={{ fontSize: '6.5pt', fontWeight: 600, color: '#475569' }}>{m.label}</div>
                  <div style={{ fontSize: '9.5pt', fontWeight: 800, color: m.color, marginTop: '1px' }}>
                    {m.val || 0} <span style={{ fontSize: '6.5pt', fontWeight: 500, color: '#64748b' }}>ซม.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CUTTING PARTS TABLE (ชิ้น ก - ช)                      */}
        {/* ========================================================= */}
        <div style={{ marginBottom: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '3px',
              fontSize: '8pt',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            <span>1. รายการตัดท่อ PVC ขาว (เกรดหนา 8.5/13.5)</span>
            <span style={{ color: '#0369a1', fontSize: '7.5pt' }}>
              ความยาวรวม: <strong>{totalLengthCm} ซม.</strong> ({totalLengthMeters} ม.) • ใช้ท่อมาตรฐาน 4 ม. = <strong>{standardPipesNeeded} เส้น</strong>
            </span>
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '7.5pt',
              textAlign: 'left',
              border: '1px solid #cbd5e1',
            }}
          >
            <thead>
              <tr style={{ background: '#e0f2fe', color: '#0369a1', borderBottom: '1px solid #0284c7' }}>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'center', width: '32px' }}>ชิ้น</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 5px' }}>ตำแหน่งและหน้าที่</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'right', width: '70px' }}>ความยาว (ซม.)</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'center', width: '45px' }}>จำนวน</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'right', width: '65px' }}>รวม (ซม.)</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 5px' }}>สูตรการคำนวณ</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'center', width: '42px' }}>ตัดแล้ว</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, idx) => (
                <tr key={p.key} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'center', fontWeight: 800, color: '#0284c7' }}>
                    {p.key}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '3px 5px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'right', fontWeight: 700 }}>
                    {p.lengthCm}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'center', fontWeight: 600 }}>
                    {p.count}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'right' }}>
                    {(p.lengthCm * p.count).toFixed(1)}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '3px 5px', color: '#475569', fontSize: '7pt' }}>
                    {p.formulaStr}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '3px 5px', textAlign: 'center' }}>
                    <div style={{ width: '11px', height: '11px', border: '1px solid #475569', margin: '0 auto', borderRadius: '1px' }}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* 4. MATERIALS & HARDWARE SUMMARY (2-COLUMN MINI-TABLES)    */}
        {/* ========================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '6px',
            fontSize: '7.5pt',
          }}
        >
          {/* Left: PVC Fittings */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: '#0284c7',
                background: '#f0f9ff',
                padding: '3px 6px',
                borderBottom: '1px solid #cbd5e1',
                fontSize: '7.5pt',
              }}
            >
              ข้อต่อ PVC ({pipeConstants.sizeName})
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.2pt' }}>
              <tbody>
                {fittings.map((f, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: i < fittings.length - 1 ? '1px solid #f1f5f9' : 'none',
                      background: i % 2 === 0 ? '#ffffff' : '#fafafa',
                    }}
                  >
                    <td style={{ padding: '3px 6px', color: '#1e293b' }}>• {f.name}</td>
                    <td
                      style={{
                        padding: '3px 6px',
                        textAlign: 'right',
                        fontWeight: 700,
                        width: '50px',
                        whiteSpace: 'nowrap',
                        color: '#0284c7',
                      }}
                    >
                      {f.count} ตัว
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: Wheels & Harness */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: '#0284c7',
                background: '#f0f9ff',
                padding: '3px 6px',
                borderBottom: '1px solid #cbd5e1',
                fontSize: '7.5pt',
              }}
            >
              ชุดล้อและสายรัดพยุงตัว
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.2pt' }}>
              <tbody>
                {hardware.map((h, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: i < hardware.length - 1 ? '1px solid #f1f5f9' : 'none',
                      background: i % 2 === 0 ? '#ffffff' : '#fafafa',
                    }}
                  >
                    <td style={{ padding: '3px 6px', color: '#1e293b' }}>• {h.name}</td>
                    <td
                      style={{
                        padding: '3px 6px',
                        textAlign: 'right',
                        fontWeight: 700,
                        width: '55px',
                        whiteSpace: 'nowrap',
                        color: '#0284c7',
                      }}
                    >
                      {h.count} {h.name.includes('ล้อ') ? 'ล้อ' : 'ชุด'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. QC INSPECTION CHECKLIST TABLE                          */}
        {/* ========================================================= */}
        <div style={{ marginBottom: '6px' }}>
          <div
            style={{
              fontSize: '8pt',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '3px',
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
              fontSize: '7.5pt',
              textAlign: 'left',
              border: '1px solid #cbd5e1',
            }}
          >
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#334155', borderBottom: '1px solid #94a3b8' }}>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>รายการตรวจสอบ</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', width: '85px', textAlign: 'center' }}>เป้าหมาย</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', width: '80px', textAlign: 'center' }}>วัดได้จริง</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', width: '95px', textAlign: 'center' }}>ผลการตรวจ</th>
              </tr>
            </thead>
            <tbody>
              {qcItems.map((q) => {
                const val = qcMeasuredValues[q.id];
                return (
                  <tr key={q.id}>
                    <td style={{ border: '1px solid #cbd5e1', padding: '4px 6px' }}>
                      <strong style={{ color: '#0f172a' }}>{q.title}</strong>{' '}
                      <span style={{ color: '#64748b', fontSize: '6.8pt' }}>({q.description})</span>
                    </td>
                    <td
                      style={{
                        border: '1px solid #cbd5e1',
                        padding: '4px 6px',
                        textAlign: 'center',
                        fontWeight: 700,
                        color: '#0284c7',
                      }}
                    >
                      {q.id === 'qc_wheel_alignment' ? 'ระนาบเสมอ' : `${q.targetValue} ซม.`}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '4px 6px', textAlign: 'center' }}>
                      {val !== undefined ? `${val} ซม.` : '.............. ซม.'}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '4px 6px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginRight: '8px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            border: '1px solid #334155',
                            display: 'inline-block',
                            borderRadius: '1px',
                          }}
                        ></span>{' '}
                        ผ่าน
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            border: '1px solid #334155',
                            display: 'inline-block',
                            borderRadius: '1px',
                          }}
                        ></span>{' '}
                        แก้ไข
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* 6. NOTES & SIGNATURE BLOCK (STAFF กลุ่ม & ผู้ตรวจ QC)     */}
        {/* ========================================================= */}
        <div
          style={{
            border: '1px dashed #cbd5e1',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '7pt',
            color: '#475569',
            marginBottom: '8px',
            background: '#fafafa',
          }}
        >
          <strong>หมายเหตุเพิ่มเติม / ข้อควรระวัง:</strong>{' '}
          {measurements.notes ||
            '..................................................................................................................................................................................................................................'}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            paddingTop: '8px',
            borderTop: '1px solid #94a3b8',
            fontSize: '7.8pt',
            textAlign: 'center',
          }}
        >
          <div>
            <div>
              ลงชื่อ .............................................................. <strong>Staff กลุ่ม</strong>
            </div>
            <div style={{ marginTop: '3px', color: '#334155' }}>( .............................................................. )</div>
            <div style={{ marginTop: '2px', color: '#64748b', fontSize: '7pt' }}>วันที่ ........ / ........ / ................</div>
          </div>
          <div>
            <div>
              ลงชื่อ .............................................................. <strong>ผู้ตรวจ QC</strong>
            </div>
            <div style={{ marginTop: '3px', color: '#334155' }}>( .............................................................. )</div>
            <div style={{ marginTop: '2px', color: '#64748b', fontSize: '7pt' }}>วันที่ ........ / ........ / ................</div>
          </div>
        </div>
      </div>
    </div>
  );
};
