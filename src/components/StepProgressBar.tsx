import React from 'react';
import { Ruler, Scissors, Package, Award, Check } from 'lucide-react';

export type StepNumber = 1 | 2 | 3 | 4;

interface StepProgressBarProps {
  currentStep: StepNumber;
  onSelectStep: (step: StepNumber) => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const steps = [
    {
      number: 1 as StepNumber,
      title: 'สัดส่วนสัตว์ & โมเดล',
      desc: 'วัดตัว A-D, E, G, H',
      icon: Ruler,
    },
    {
      number: 2 as StepNumber,
      title: 'ขนาดตัดท่อ PVC',
      desc: 'ชิ้นส่วน ก - ช & โครงสร้าง',
      icon: Scissors,
    },
    {
      number: 3 as StepNumber,
      title: 'สรุปอุปกรณ์ & ข้อต่อ',
      desc: 'ท่อ 4ม. ล้อ และน็อต',
      icon: Package,
    },
    {
      number: 4 as StepNumber,
      title: 'ตรวจ QC & บันทึกข้อมูล',
      desc: 'ตรวจงาน & ซิงค์ชีต',
      icon: Award,
    },
  ];

  return (
    <div className="no-print card stepper-card" style={{
      padding: '0.85rem 1.25rem',
      marginBottom: '1.25rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div
        className="stepper-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          alignItems: 'center'
        }}
      >
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              onClick={() => onSelectStep(step.number)}
              className="stepper-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary-50), var(--bg-card))'
                  : 'transparent',
                border: isActive
                  ? '2px solid var(--primary-600)'
                  : isCompleted
                  ? '1px solid var(--success-500)'
                  : '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Step Circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCompleted
                    ? 'var(--success-500)'
                    : isActive
                    ? 'var(--primary-600)'
                    : 'var(--bg-card-hover)',
                  color: isActive || isCompleted ? '#ffffff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: isActive ? '0 2px 6px rgba(2, 132, 199, 0.35)' : 'none'
                }}
              >
                {isCompleted ? <Check size={16} /> : <Icon size={16} />}
              </div>

              {/* Title & Desc */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? 'var(--primary-700)' : isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}>
                  {step.number}. {step.title}
                </div>
                <div
                  className="stepper-item-desc"
                  style={{
                    fontSize: '0.725rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {step.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
