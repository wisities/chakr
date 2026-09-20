import React from 'react';
import { CalculationResult, PartKey } from '../../types/wheelchair';
import { CutResultsTable } from '../CutResultsTable';
import { WheelchairDiagram } from '../WheelchairDiagram';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Step2CutPartsProps {
  calculationResult: CalculationResult;
  selectedPartKey: PartKey | null;
  onSelectPart: (key: PartKey | null) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step2CutParts: React.FC<Step2CutPartsProps> = ({
  calculationResult,
  selectedPartKey,
  onSelectPart,
  onPrevStep,
  onNextStep,
}) => {
  const { wheelchairType, pipeConstants } = calculationResult;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Model Summary Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            {wheelchairType === '2_wheel' ? '🦽' : '🛒'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>โมเดลที่คำนวณ:</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              วีลแชร์ {wheelchairType === '2_wheel' ? 'แบบ 2 ล้อหลัง' : 'แบบ 4 ล้อ'} • ท่อ PVC ขนาด {pipeConstants.sizeName} ({pipeConstants.sizeInch})
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>รัศมีล้อหลัง:</div>
            <strong style={{ fontSize: '1rem' }}>{pipeConstants.rearWheelRadius} ซม.</strong>
          </div>
          {wheelchairType === '4_wheel' && (
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>ความสูงล้อหน้า:</div>
              <strong style={{ fontSize: '1rem' }}>{pipeConstants.frontWheelHeight} ซม.</strong>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Cut Table & Wheelchair Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: '1.25rem' }}>
        
        {/* Cut Table (7 Cols) */}
        <div className="md:col-span-7">
          <CutResultsTable
            calculationResult={calculationResult}
            selectedPartKey={selectedPartKey}
            onSelectPart={onSelectPart}
          />
        </div>

        {/* Diagram (5 Cols) */}
        <div className="md:col-span-5">
          <WheelchairDiagram
            calculationResult={calculationResult}
            selectedPartKey={selectedPartKey}
            onSelectPart={onSelectPart}
          />
        </div>

      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <button
          type="button"
          onClick={onPrevStep}
          className="btn btn-secondary btn-mobile-full"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={16} />
          <span>ย้อนกลับไปแก้ไขสัดส่วน</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="btn btn-primary btn-mobile-full"
          style={{ padding: '0.75rem 1.75rem', fontSize: '1rem', boxShadow: 'var(--shadow-md)' }}
        >
          <span>ถัดไป: สรุปอุปกรณ์ & ท่อ PVC</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
