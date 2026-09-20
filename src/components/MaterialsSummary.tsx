import React from 'react';
import { CalculationResult } from '../types/wheelchair';
import { Package, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MaterialsSummaryProps {
  calculationResult: CalculationResult;
}

export const MaterialsSummary: React.FC<MaterialsSummaryProps> = ({ calculationResult }) => {
  const { pipeConstants, fittings, hardware, standardPipesNeeded, totalLengthMeters } = calculationResult;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Package size={18} style={{ color: 'var(--primary-600)' }} />
          <span>3. สรุปรายการอุปกรณ์และข้อต่อ (Bill of Materials)</span>
        </div>
        <span className="badge badge-primary">
          ขนาด {pipeConstants.sizeName} ({pipeConstants.sizeInch})
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.25rem' }}>
        
        {/* PVC Pipes & Fittings Column */}
        <div style={{
          background: 'var(--bg-card-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Wrench size={16} style={{ color: 'var(--primary-600)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>ท่อ PVC และข้อต่อมาตรฐาน</h4>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            {/* PVC Pipe */}
            <li style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div>
                <strong style={{ color: 'var(--primary-700)' }}>ท่อ PVC สีขาว ขนาด {pipeConstants.sizeName}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  ความยาวที่ใช้จริง {totalLengthMeters} ม. (ท่อยาว 4 ม. / เส้น)
                </div>
              </div>
              <span className="badge badge-amber" style={{ fontSize: '0.85rem' }}>
                {standardPipesNeeded} เส้น
              </span>
            </li>

            {/* Fittings */}
            {fittings.map((fit, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: i === fittings.length - 1 ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{fit.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{fit.spec}</div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
                  {fit.count} ตัว
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Wheels & Accessories Column */}
        <div style={{
          background: 'var(--bg-card-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success-600)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>ล้อและอุปกรณ์เสริมเพื่อความปลอดภัย</h4>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            {hardware.map((hw, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: i === hardware.length - 1 ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{hw.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{hw.spec}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                  {hw.count} {hw.name.includes('ล้อ') ? 'ล้อ' : 'ชุด'}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Assembly Tip */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        background: 'var(--primary-50)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--primary-200)',
        fontSize: '0.825rem',
        color: 'var(--primary-900)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <CheckCircle2 size={16} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
        <span>
          <strong>เทคนิคช่าง:</strong> ก่อนทากาวประสานท่อ PVC แนะนำให้ประกอบชิ้นส่วนท่อแบบแห้ง (Dry-fit) เพื่อทดลองนำสัตว์ลงลองและทำ QC ตรวจเช็คขนาดจริงก่อนเสมอ
        </span>
      </div>
    </div>
  );
};
