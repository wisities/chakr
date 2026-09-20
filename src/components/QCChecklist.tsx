import React, { useEffect, useState } from 'react';
import { AnimalMeasurements, PipeSize, WheelchairType } from '../types/wheelchair';
import { calculateQCTargets, evaluateQCItem } from '../utils/qc';
import { CheckCircle, XCircle, Award, Sparkles, CheckSquare, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QCChecklistProps {
  measurements: AnimalMeasurements;
  wheelchairType: WheelchairType;
  pipeSize: PipeSize;
  qcMeasuredValues: Record<string, number>;
  onUpdateQCValue: (id: string, val: number | undefined) => void;
}

export const QCChecklist: React.FC<QCChecklistProps> = ({
  measurements,
  wheelchairType,
  pipeSize,
  qcMeasuredValues,
  onUpdateQCValue,
}) => {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const qcItems = calculateQCTargets(measurements, wheelchairType, pipeSize);

  // Evaluate items
  const evaluationResults = qcItems.map((item) => {
    const val = qcMeasuredValues[item.id];
    const isPassed = evaluateQCItem(item, val);
    const hasValue = val !== undefined && !isNaN(val);
    const diff = hasValue && item.id !== 'qc_wheel_alignment' ? Math.round((val - item.targetValue) * 10) / 10 : 0;

    return {
      ...item,
      measuredValue: val,
      isPassed,
      hasValue,
      diff,
    };
  });

  const totalItems = qcItems.length;
  const passedCount = evaluationResults.filter((r) => r.isPassed).length;
  const isAllPassed = passedCount === totalItems;

  useEffect(() => {
    if (isAllPassed && !hasCelebrated) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setHasCelebrated(true);
    } else if (!isAllPassed) {
      setHasCelebrated(false);
    }
  }, [isAllPassed, hasCelebrated]);

  const handleFillAllTargets = () => {
    qcItems.forEach((item) => {
      if (item.id === 'qc_wheel_alignment') {
        onUpdateQCValue(item.id, 1);
      } else {
        onUpdateQCValue(item.id, item.targetValue);
      }
    });
  };

  const handleClearQC = () => {
    qcItems.forEach((item) => {
      onUpdateQCValue(item.id, undefined);
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Award size={20} style={{ color: 'var(--success-600)' }} />
          <span>4. ระบบตรวจรับงานและตรวจสอบคุณภาพหลังประกอบ (QC Checklist)</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleFillAllTargets}
            className="btn btn-secondary"
            title="ใส่ค่าตามเป้าหมายเพื่อทดสอบ"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            <Sparkles size={14} style={{ color: 'var(--accent-500)' }} />
            <span>กรอกค่ามาตรฐานทั้งหมด</span>
          </button>
          <button
            onClick={handleClearQC}
            className="btn btn-secondary"
            title="ล้างค่าที่กรอกตรวจ QC"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} />
            <span>ล้างค่า</span>
          </button>
        </div>
      </div>

      {/* QC Status Banner */}
      <div style={{
        background: isAllPassed ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-card-hover)',
        color: isAllPassed ? '#ffffff' : 'var(--text-primary)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.25rem',
        border: isAllPassed ? 'none' : '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAllPassed ? (
            <CheckCircle size={32} />
          ) : (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              {passedCount}/{totalItems}
            </div>
          )}
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: isAllPassed ? '#ffffff' : 'var(--text-primary)' }}>
              {isAllPassed ? '🎉 ผ่านการตรวจรับรองมาตรฐาน QC ครบทุกข้อเรียบร้อย!' : 'อยู่ระหว่างการตรวจวัดขนาดจริงหลังประกอบ'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: isAllPassed ? 0.9 : 0.7 }}>
              {isAllPassed
                ? 'วีลแชร์มีความสมดุล ขนาดตรงตามสัดส่วนร่างกายสัตว์ พร้อมส่งมอบให้สัตว์เลี้ยงใช้งาน'
                : `ผ่านแล้ว ${passedCount} จาก ${totalItems} รายการ (เกณฑ์ยอมรับได้: คลาดเคลื่อนไม่เกิน ±0.5 ซม.)`}
            </p>
          </div>
        </div>

        <span className={isAllPassed ? 'badge' : 'badge badge-primary'} style={{
          background: isAllPassed ? 'rgba(255, 255, 255, 0.25)' : undefined,
          color: isAllPassed ? '#ffffff' : undefined,
          fontSize: '0.85rem'
        }}>
          {isAllPassed ? 'QC PASSED' : 'QC IN PROGRESS'}
        </span>
      </div>

      {/* QC Items Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {evaluationResults.map((item) => (
          <div
            key={item.id}
            style={{
              border: item.isPassed
                ? '1.5px solid #10b981'
                : item.hasValue
                ? '1.5px solid #ef4444'
                : '1px solid var(--border-color)',
              background: item.isPassed
                ? 'rgba(16, 185, 129, 0.04)'
                : item.hasValue
                ? 'rgba(239, 68, 68, 0.04)'
                : 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            {/* Description & Target */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{item.title}</strong>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  ค่ามาตรฐาน: {item.id === 'qc_wheel_alignment' ? 'ระนาบเสมอ' : `${item.targetValue} ซม.`}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 0.35rem 0' }}>
                {item.description}
              </p>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>สูตรตรวจสอบ:</strong> <code>{item.formulaDescription}</code>
              </div>
            </div>

            {/* Input & Evaluation Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {item.id === 'qc_wheel_alignment' ? (
                <button
                  type="button"
                  onClick={() => onUpdateQCValue(item.id, item.measuredValue === 1 ? 0 : 1)}
                  className={item.isPassed ? 'btn btn-success' : 'btn btn-secondary'}
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                >
                  {item.isPassed ? <CheckSquare size={16} /> : <CheckSquare size={16} style={{ opacity: 0.5 }} />}
                  <span>{item.isPassed ? 'ทุกล้อแตะพื้นเสมอ (ผ่าน)' : 'คลิกเพื่อยืนยันระนาบล้อ'}</span>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                      วัดได้จริง (ซม.):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="ซม."
                      value={item.measuredValue !== undefined ? item.measuredValue : ''}
                      onChange={(e) => {
                        const v = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        onUpdateQCValue(item.id, v);
                      }}
                      style={{
                        width: '90px',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        border: item.isPassed
                          ? '2px solid #10b981'
                          : item.hasValue
                          ? '2px solid #ef4444'
                          : '1px solid var(--border-color)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textAlign: 'right'
                      }}
                    />
                  </div>

                  {/* Pass / Fail Icon */}
                  <div style={{ width: '32px', textAlign: 'center' }}>
                    {item.isPassed ? (
                      <CheckCircle size={24} style={{ color: '#10b981' }} />
                    ) : item.hasValue ? (
                      <XCircle size={24} style={{ color: '#ef4444' }} />
                    ) : null}
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
