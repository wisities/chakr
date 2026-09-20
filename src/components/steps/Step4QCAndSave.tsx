import React from 'react';
import { AnimalMeasurements, CalculationResult, PipeSize, WheelchairType } from '../../types/wheelchair';
import { QCChecklist } from '../QCChecklist';
import { ArrowLeft, CloudUpload, Printer, Bookmark, RotateCcw, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Step4QCAndSaveProps {
  measurements: AnimalMeasurements;
  wheelchairType: WheelchairType;
  pipeSize: PipeSize;
  calculationResult: CalculationResult;
  qcMeasuredValues: Record<string, number>;
  isSavingSheet: boolean;
  onUpdateQCValue: (id: string, val: number | undefined) => void;
  onSaveToGoogleSheet: () => void;
  onSaveLocalCase: () => void;
  onPrint: () => void;
  onResetNewCase: () => void;
  onPrevStep: () => void;
}

export const Step4QCAndSave: React.FC<Step4QCAndSaveProps> = ({
  measurements,
  wheelchairType,
  pipeSize,
  qcMeasuredValues,
  isSavingSheet,
  onUpdateQCValue,
  onSaveToGoogleSheet,
  onSaveLocalCase,
  onPrint,
  onResetNewCase,
  onPrevStep,
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* QC Checklist Component */}
      <QCChecklist
        measurements={measurements}
        wheelchairType={wheelchairType}
        pipeSize={pipeSize}
        qcMeasuredValues={qcMeasuredValues}
        onUpdateQCValue={onUpdateQCValue}
      />

      {/* Completion & Action Hub Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-card), var(--bg-card-hover))',
        border: '1.5px solid var(--primary-300)',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--success-500)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              บันทึกข้อมูลและส่งมอบงานวีลแชร์
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              เคส: <strong>{measurements.caseId || '-'}</strong> ({measurements.petName || 'ไม่มีชื่อ'}) • ผู้คำนวณ: <strong>{measurements.staffName || '-'}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '0.85rem' }}>
          
          {/* Save to Google Sheet (Primary) */}
          <button
            onClick={onSaveToGoogleSheet}
            disabled={isSavingSheet}
            className="btn btn-success"
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.25rem', height: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {isSavingSheet ? <RefreshCw size={18} className="animate-spin" /> : <CloudUpload size={18} />}
              <span>{isSavingSheet ? 'กำลังบันทึก...' : 'บันทึกลง Google Sheet'}</span>
            </div>
            <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 400 }}>
              ซิงค์ข้อมูลเข้าตารางโครงการทันที
            </span>
          </button>

          {/* Print A4 */}
          <button
            onClick={onPrint}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.25rem', height: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Printer size={18} />
              <span>พิมพ์ใบงานช่าง (A4)</span>
            </div>
            <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 400 }}>
              พร้อมตารางตัดท่อและใบเซ็นต์ QC
            </span>
          </button>

          {/* Save in Browser */}
          <button
            onClick={onSaveLocalCase}
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.25rem', height: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bookmark size={18} />
              <span>บันทึกในเครื่อง</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              เก็บประวัติไว้ในเบราว์เซอร์
            </span>
          </button>

          {/* New Case */}
          <button
            onClick={onResetNewCase}
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.25rem', height: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCcw size={18} />
              <span>เริ่มคำนวณเคสใหม่</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              ล้างฟอร์มและสร้าง Case ID ใหม่
            </span>
          </button>

        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '0.5rem' }}>
        <button
          type="button"
          onClick={onPrevStep}
          className="btn btn-secondary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={16} />
          <span>ย้อนกลับไปดูสรุปอุปกรณ์</span>
        </button>
      </div>

    </div>
  );
};
