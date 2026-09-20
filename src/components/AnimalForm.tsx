import React from 'react';
import {
  AnimalMeasurements,
  AnimalType,
  PipeSize,
  WheelchairType,
} from '../types/wheelchair';
import {
  Dog,
  Cat,
  Settings2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  UserCheck,
  Hash,
} from 'lucide-react';
import { determinePipeSize, PIPE_CONSTANTS_MAP } from '../utils/calculations';

interface AnimalFormProps {
  measurements: AnimalMeasurements;
  wheelchairType: WheelchairType;
  pipeSize: PipeSize;
  isManualPipeSize: boolean;
  isSavingSheet?: boolean;
  onChangeMeasurements: (updated: Partial<AnimalMeasurements>) => void;
  onChangeWheelchairType: (type: WheelchairType) => void;
  onChangePipeSize: (size: PipeSize, manual: boolean) => void;
  onReset: () => void;
  onOpenGuide: () => void;
  onSaveToGoogleSheet?: () => void;
}

export const AnimalForm: React.FC<AnimalFormProps> = ({
  measurements,
  wheelchairType,
  pipeSize,
  isManualPipeSize,
  onChangeMeasurements,
  onChangeWheelchairType,
  onChangePipeSize,
  onReset,
  onOpenGuide,
}) => {
  const autoPipeSize = determinePipeSize(measurements.animalType, measurements.weight);

  const handleAnimalTypeChange = (type: AnimalType) => {
    const newAuto = determinePipeSize(type, measurements.weight);
    onChangeMeasurements({ animalType: type });
    if (!isManualPipeSize) {
      onChangePipeSize(newAuto, false);
    }
  };

  const handleWeightChange = (weight: number) => {
    onChangeMeasurements({ weight });
    if (!isManualPipeSize) {
      const newAuto = determinePipeSize(measurements.animalType, weight);
      onChangePipeSize(newAuto, false);
    }
  };

  // Warnings for physical consistency
  const warnings: string[] = [];
  if (measurements.B >= measurements.A && measurements.A > 0 && measurements.B > 0) {
    warnings.push('ค่า B (ความสูงถึงท้อง) ไม่ควรสูงกว่าหรือเท่ากับค่า A (ความสูงถึงหลังสะโพก)');
  }
  const avgAB = (measurements.A + measurements.B) / 2;
  if (measurements.D >= avgAB && measurements.D > 0 && avgAB > 0) {
    warnings.push('ค่า D (ความสูงถึงหน้าอก) สูงกว่าระดับกึ่งกลางลำตัว ((A+B)/2) อาจทำให้ชิ้นส่วน จ ติดลบ');
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span>1. ข้อมูลเคส & สัดส่วนร่างกายสัตว์</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-secondary"
            title="ล้างข้อมูลและเริ่มใหม่"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} />
            <span>รีเซ็ต</span>
          </button>
        </div>
      </div>

      {/* Staff Name & Case ID Row */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '0.875rem', marginBottom: '1rem', background: 'var(--bg-card-hover)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <UserCheck size={15} style={{ color: 'var(--primary-600)' }} />
            <span>ชื่อ Staff ผู้คำนวณ (Staff Name)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="เช่น ช่างวิชัย, หมอแนน, อาสาสมัครสมชาย"
            value={measurements.staffName || ''}
            onChange={(e) => onChangeMeasurements({ staffName: e.target.value })}
            style={{ fontWeight: 500 }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <Hash size={15} style={{ color: 'var(--accent-500)' }} />
            <span>รหัสเคส (Case ID)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="ระบบจะสร้างให้อัตโนมัติ เช่น CK-2026-001"
            value={measurements.caseId || ''}
            onChange={(e) => onChangeMeasurements({ caseId: e.target.value })}
            style={{ fontWeight: 600, color: 'var(--primary-700)' }}
          />
        </div>
      </div>

      {/* Pet Name & Owner Details */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '0.875rem', marginBottom: '1rem' }}>
        <div className="form-group">
          <label className="form-label">ชื่อสัตว์เลี้ยง (Pet Name)</label>
          <input
            type="text"
            className="input-field"
            placeholder="เช่น เจ้าขาว, บราวนี่, เจ้าเต้าหู้"
            value={measurements.petName}
            onChange={(e) => onChangeMeasurements({ petName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">ชื่อผู้ดูแล / เบอร์ติดต่อ (Owner)</label>
          <input
            type="text"
            className="input-field"
            placeholder="เช่น คุณสมชาย (081-xxx-xxxx)"
            value={measurements.ownerName}
            onChange={(e) => onChangeMeasurements({ ownerName: e.target.value })}
          />
        </div>
      </div>

      {/* Animal Type & Weight Selector */}
      <div style={{
        background: 'var(--bg-card-hover)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem', alignItems: 'center' }}>
          
          {/* Animal Type Toggle */}
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>ประเภทสัตว์ (Animal Type)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleAnimalTypeChange('dog')}
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: measurements.animalType === 'dog' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                  background: measurements.animalType === 'dog' ? 'var(--primary-50)' : 'var(--bg-card)',
                  color: measurements.animalType === 'dog' ? 'var(--primary-700)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Dog size={20} />
                <span>สุนัข (Dog)</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnimalTypeChange('cat')}
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: measurements.animalType === 'cat' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                  background: measurements.animalType === 'cat' ? 'var(--primary-50)' : 'var(--bg-card)',
                  color: measurements.animalType === 'cat' ? 'var(--primary-700)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Cat size={20} />
                <span>แมว (Cat)</span>
              </button>
            </div>
          </div>

          {/* Weight in KG */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>น้ำหนักตัว (Weight)</label>
              <span className="badge badge-primary">กก. (kg)</span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="100"
              className="input-field"
              placeholder="เช่น 4.5 หรือ 12"
              value={measurements.weight || ''}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
              style={{ fontWeight: 600, fontSize: '1.05rem' }}
            />
          </div>

        </div>

        {/* Selected / Recommended Pipe Badge */}
        <div style={{
          marginTop: '0.85rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-500)' }} />
            <span>
              ขนาดท่อที่แนะนำ: <strong>{PIPE_CONSTANTS_MAP[autoPipeSize].sizeName} ({PIPE_CONSTANTS_MAP[autoPipeSize].sizeInch})</strong>
              {measurements.animalType === 'cat' ? ' (แมวใช้ 3 หุนทั้งหมด)' : ` (สุนัขน้ำหนัก ${measurements.weight || 0} กก.)`}
            </span>
          </div>

          {/* Manual override toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings2 size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ปรับท่อเอง:</span>
            <select
              value={pipeSize}
              onChange={(e) => onChangePipeSize(e.target.value as PipeSize, true)}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                border: '1.5px solid var(--border-color)',
                background: isManualPipeSize ? 'var(--primary-100)' : 'var(--bg-card)',
                color: isManualPipeSize ? 'var(--primary-900)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="3_hun">3 หุน (3/8") - สุนัขเล็ก / แมว</option>
              <option value="4_hun">4 หุน (1/2") - สุนัข 6-10 กก.</option>
              <option value="6_hun">6 หุน (3/4") - สุนัข &gt; 10 กก.</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wheelchair Configuration (2 Wheels vs 4 Wheels) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          รูปแบบล้อของวีลแชร์ (Wheelchair Configuration)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => onChangeWheelchairType('2_wheel')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: wheelchairType === '2_wheel' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              background: wheelchairType === '2_wheel' ? 'linear-gradient(to bottom, var(--primary-50), var(--bg-card))' : 'var(--bg-card)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <strong style={{ color: wheelchairType === '2_wheel' ? 'var(--primary-700)' : 'var(--text-primary)' }}>
                🦽 2 ล้อหลัง (2-Wheel)
              </strong>
              {wheelchairType === '2_wheel' && <span className="badge badge-primary">เลือกอยู่</span>}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              สำหรับสัตว์ที่ขาหน้ายังแข็งแรง ขาหลังอ่อนแรงหรือเป็นอัมพาต
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChangeWheelchairType('4_wheel')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: wheelchairType === '4_wheel' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              background: wheelchairType === '4_wheel' ? 'linear-gradient(to bottom, var(--primary-50), var(--bg-card))' : 'var(--bg-card)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <strong style={{ color: wheelchairType === '4_wheel' ? 'var(--primary-700)' : 'var(--text-primary)' }}>
                🛒 4 ล้อเต็มตัว (4-Wheel)
              </strong>
              {wheelchairType === '4_wheel' && <span className="badge badge-primary">เลือกอยู่</span>}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              สำหรับสัตว์ที่ขาหน้าและขาหลังอ่อนแรงทั้ง 4 ขา พยุงลำตัวเต็มรูปแบบ
            </p>
          </button>
        </div>
      </div>

      {/* Measurement Inputs (A, B, G, H, E, D) */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
            กรอกสัดส่วนจากการวัดตัว (หน่วย: เซนติเมตร - cm)
          </label>
          <button
            type="button"
            onClick={onOpenGuide}
            style={{
              background: 'none',
              color: 'var(--primary-600)',
              fontSize: '0.825rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <HelpCircle size={15} />
            <span>ดูภาพจุดวัดตัว A-D, E, G, H</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: '0.75rem' }}>
          
          {/* A */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>A</strong>: พื้นถึงหลังสะโพก</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ซม."
              value={measurements.A || ''}
              onChange={(e) => onChangeMeasurements({ A: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* B */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>B</strong>: พื้นถึงท้อง</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ซม."
              value={measurements.B || ''}
              onChange={(e) => onChangeMeasurements({ B: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* G */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>G</strong>: ความกว้างลำตัว</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ซม."
              value={measurements.G || ''}
              onChange={(e) => onChangeMeasurements({ G: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* H */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>H</strong>: รอบอก/รอบท้อง</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ซม."
              value={measurements.H || ''}
              onChange={(e) => onChangeMeasurements({ H: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* E */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>E</strong>: ขาหน้าถึงสะโพก</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ซม."
              value={measurements.E || ''}
              onChange={(e) => onChangeMeasurements({ E: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* D */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>D</strong>: พื้นถึงหน้าอก</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ซม."
              value={measurements.D || ''}
              onChange={(e) => onChangeMeasurements({ D: parseFloat(e.target.value) || 0 })}
            />
          </div>

        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginTop: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {warnings.map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: '0.825rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
