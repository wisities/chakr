import React from 'react';
import { CalculationResult } from '../../types/wheelchair';
import { MaterialsSummary } from '../MaterialsSummary';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Step3MaterialsProps {
  calculationResult: CalculationResult;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step3Materials: React.FC<Step3MaterialsProps> = ({
  calculationResult,
  onPrevStep,
  onNextStep,
}) => {
  const { totalLengthCm, totalLengthMeters, standardPipesNeeded, pipeConstants } = calculationResult;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Quick PVC Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1rem' }}>
        
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-50), var(--bg-card))', border: '1.5px solid var(--primary-200)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ขนาดท่อ PVC ที่ใช้:</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-700)', margin: '0.25rem 0' }}>
            {pipeConstants.sizeName} ({pipeConstants.sizeInch})
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pipeConstants.sizeMm}</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #fef3c7, var(--bg-card))', border: '1.5px solid #fde68a' }}>
          <div style={{ fontSize: '0.8rem', color: '#92400e' }}>ความยาวท่อรวมที่ใช้จริง:</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b45309', margin: '0.25rem 0' }}>
            {totalLengthMeters} เมตร <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>({totalLengthCm} ซม.)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#92400e' }}>คิดเผื่อหัวท้ายและการตัด ~3 มม./ชิ้น</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #d1fae5, var(--bg-card))', border: '1.5px solid #a7f3d0' }}>
          <div style={{ fontSize: '0.8rem', color: '#065f46' }}>จำนวนท่อมาตรฐาน 4 เมตร:</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#047857', margin: '0.25rem 0' }}>
            {standardPipesNeeded} เส้น
          </div>
          <div style={{ fontSize: '0.75rem', color: '#065f46' }}>ซื้อท่อ PVC ขาวชั้นความหนา 8.5 หรือ 13.5</div>
        </div>

      </div>

      {/* Main Materials Breakdown */}
      <MaterialsSummary calculationResult={calculationResult} />

      {/* Step 3 Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <button
          type="button"
          onClick={onPrevStep}
          className="btn btn-secondary btn-mobile-full"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={16} />
          <span>ย้อนกลับไปดูขนาดตัดท่อ</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="btn btn-primary btn-mobile-full"
          style={{ padding: '0.75rem 1.75rem', fontSize: '1rem', boxShadow: 'var(--shadow-md)' }}
        >
          <span>ถัดไป: ตรวจรับรองงาน QC & บันทึกเคส</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
