import React, { useState } from 'react';
import { CalculationResult, PartKey } from '../types/wheelchair';
import { Scissors, Copy, Check, CheckSquare, Square, AlertTriangle } from 'lucide-react';

interface CutResultsTableProps {
  calculationResult: CalculationResult;
  selectedPartKey?: PartKey | null;
  onSelectPart?: (key: PartKey | null) => void;
}

export const CutResultsTable: React.FC<CutResultsTableProps> = ({
  calculationResult,
  selectedPartKey,
  onSelectPart,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedParts, setCheckedParts] = useState<Record<string, boolean>>({});

  const { parts, pipeConstants, wheelchairType, totalLengthCm, totalLengthMeters, standardPipesNeeded } = calculationResult;

  const toggleCheck = (key: string) => {
    setCheckedParts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const copyToClipboard = () => {
    const lines = [
      `รายการตัดท่อ PVC วีลแชร์สัตว์พิการ (${wheelchairType === '2_wheel' ? '2 ล้อ' : '4 ล้อ'} ขนาด ${pipeConstants.sizeName})`,
      '--------------------------------------------------',
    ];
    parts.forEach((p) => {
      lines.push(`ชิ้น [ ${p.key} ] : ยาว ${p.lengthCm} ซม. x จำนวน ${p.count} ชิ้น (${p.name})`);
    });
    lines.push('--------------------------------------------------');
    lines.push(`ความยาวรวมท่อ: ${totalLengthCm} ซม. (${totalLengthMeters} เมตร)`);
    lines.push(`จำนวนท่อ PVC มาตรฐาน (4 เมตร) ที่ต้องใช้: ${standardPipesNeeded} เส้น`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const allChecked = parts.every((p) => checkedParts[p.key]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Scissors size={18} style={{ color: 'var(--primary-600)' }} />
          <span>2. รายการคำนวณขนาดตัดท่อ PVC (ก - {wheelchairType === '4_wheel' ? 'ช' : 'ฉ'})</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={copyToClipboard}
            className="btn btn-secondary"
            title="คัดลอกรายการตัดท่อทั้งหมด"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--success-500)' }} /> : <Copy size={14} />}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกรายการ'}</span>
          </button>
        </div>
      </div>

      {/* Cutting Parts Table */}
      <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{
              background: 'var(--bg-card-hover)',
              borderBottom: '2px solid var(--border-color)',
              color: 'var(--text-secondary)'
            }}>
              <th style={{ padding: '0.65rem 0.75rem', width: '40px', textAlign: 'center' }}>ตัดแล้ว</th>
              <th style={{ padding: '0.65rem 0.75rem', width: '60px', textAlign: 'center' }}>ชิ้น</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>หน้าที่ / รายละเอียด</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>ความยาวที่ต้องตัด</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center', width: '70px' }}>จำนวน</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>ความยาวรวม</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>สูตรการคำนวณ</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => {
              const isChecked = !!checkedParts[part.key];
              const isSelected = selectedPartKey === part.key;
              const isInvalid = part.lengthCm <= 0;

              return (
                <tr
                  key={part.key}
                  onClick={() => onSelectPart && onSelectPart(isSelected ? null : part.key)}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: isSelected
                      ? 'var(--primary-100)'
                      : isChecked
                      ? 'rgba(16, 185, 129, 0.05)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); toggleCheck(part.key); }}>
                    {isChecked ? (
                      <CheckSquare size={18} style={{ color: 'var(--success-500)' }} />
                    ) : (
                      <Square size={18} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </td>

                  {/* Part Key Badge */}
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: isSelected ? 'var(--accent-500)' : 'var(--primary-600)',
                        color: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}
                    >
                      {part.key}
                    </span>
                  </td>

                  {/* Name & Role */}
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {part.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {part.role}
                    </div>
                  </td>

                  {/* Cut Length */}
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>
                    {isInvalid ? (
                      <span style={{ color: '#ef4444', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <AlertTriangle size={14} />
                        {part.lengthCm} ซม. (ค่าติดลบ!)
                      </span>
                    ) : (
                      <strong style={{ fontSize: '1.05rem', color: 'var(--primary-700)' }}>
                        {part.lengthCm} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>ซม.</span>
                      </strong>
                    )}
                  </td>

                  {/* Count */}
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                    <span className="badge badge-amber" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      {part.count} ชิ้น
                    </span>
                  </td>

                  {/* Subtotal Length */}
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {(part.lengthCm * part.count).toFixed(1)} ซม.
                  </td>

                  {/* Formula Note */}
                  <td style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <code>{part.formulaStr}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer Bar */}
      <div style={{
        marginTop: '1rem',
        padding: '0.85rem 1rem',
        background: 'var(--bg-card-hover)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {allChecked ? (
            <span style={{ color: 'var(--success-500)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Check size={16} /> ตัดท่อครบทุกชิ้นเรียบร้อย!
            </span>
          ) : (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              (ติ๊กถูกที่ช่องซ้ายมือเมื่อตัดแต่ละชิ้นเสร็จ)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.9rem' }}>
          <div>
            ความยาวท่อรวม: <strong>{totalLengthCm} ซม. ({totalLengthMeters} เมตร)</strong>
          </div>
          <div>
            ท่อ PVC 4 เมตร: <strong style={{ color: 'var(--primary-600)' }}>{standardPipesNeeded} เส้น</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
