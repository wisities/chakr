import React, { useState } from 'react';
import {
  AnimalMeasurements,
  AnimalType,
  PipeSize,
  WheelchairType,
} from '../../types/wheelchair';
import {
  Dog,
  Cat,
  Settings2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  UserCheck,
  Hash,
  ArrowRight,
  Ruler,
  Lock,
} from 'lucide-react';
import { determinePipeSize, PIPE_CONSTANTS_MAP } from '../../utils/calculations';

interface Step1MeasurementsProps {
  measurements: AnimalMeasurements;
  wheelchairType: WheelchairType;
  pipeSize: PipeSize;
  isManualPipeSize: boolean;
  onChangeMeasurements: (updated: Partial<AnimalMeasurements>) => void;
  onChangeWheelchairType: (type: WheelchairType) => void;
  onChangePipeSize: (size: PipeSize, manual: boolean) => void;
  onReset: () => void;
  onOpenGuide: () => void;
  onNextStep: () => void;
}

export const Step1Measurements: React.FC<Step1MeasurementsProps> = ({
  measurements,
  wheelchairType,
  pipeSize,
  isManualPipeSize,
  onChangeMeasurements,
  onChangeWheelchairType,
  onChangePipeSize,
  onReset,
  onOpenGuide,
  onNextStep,
}) => {
  const [activeMeasurementTab, setActiveMeasurementTab] = useState<'A' | 'B' | 'G' | 'H' | 'E' | 'D'>('A');

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

  const isFormValid =
    measurements.A > 0 &&
    measurements.B > 0 &&
    measurements.G > 0 &&
    measurements.E > 0 &&
    measurements.D > 0;

  // Warnings
  const warnings: string[] = [];
  if (measurements.B >= measurements.A && measurements.A > 0 && measurements.B > 0) {
    warnings.push('ค่า B (ความสูงถึงท้อง) ไม่ควรสูงกว่าหรือเท่ากับค่า A (ความสูงถึงหลังสะโพก)');
  }
  const avgAB = (measurements.A + measurements.B) / 2;
  if (measurements.D >= avgAB && measurements.D > 0 && avgAB > 0) {
    warnings.push('ค่า D (ความสูงถึงหน้าอก) สูงกว่าระดับกึ่งกลางลำตัว ((A+B)/2) อาจทำให้ชิ้นส่วน จ ติดลบ');
  }
  // ตรวจสอบ G vs H/π: H (รอบอก) หารด้วย π ควรใกล้เคียงกับ G
  if (measurements.G > 0 && measurements.H > 0) {
    const estimatedG = Math.round((measurements.H / Math.PI) * 10) / 10;
    const diff = Math.abs(measurements.G - estimatedG);
    const tolerance = Math.max(2, estimatedG * 0.25); // คลาดเคลื่อน 25% หรือ 2 ซม.
    if (diff > tolerance) {
      warnings.push(`คำแนะนำ: ค่า G (ความกว้าง ${measurements.G} ซม.) ไม่สอดคล้องกับค่า H/π (รอบอก ${measurements.H} ÷ 3.14 ≈ ${estimatedG} ซม.) กรุณาตรวจสอบการวัดค่า G และ H อีกครั้ง`);
    }
  }

  const measurementDescriptions: Record<string, { title: string; desc: string; tip: string }> = {
    A: { title: 'A : ความสูงจากพื้นถึงหลังสะโพก', desc: 'วัดจากพื้นในแนวดิ่งขึ้นมาถึงระดับสูงสุดของหลังส่วนสะโพก', tip: 'ใช้กำหนดความสูงเสาข้างล้อหลัง ข' },
    B: { title: 'B : ความสูงจากพื้นถึงท้อง', desc: 'วัดจากพื้นขึ้นมาถึงใต้ท้องส่วนที่ต่ำที่สุด เพื่อไม่ให้คานท่อกดหรือครูดท้องสัตว์', tip: 'ใช้หาความสูงสมดุลกึ่งกลางลำตัว' },
    G: { title: 'G : ความกว้างลำตัว', desc: 'วัดความกว้างของลำตัวสัตว์ส่วนที่กว้างที่สุด ซ้ายไปขวา ขณะยืนตรง', tip: 'ใช้ตัดคานขวาง ก' },
    H: { title: 'H : ความยาวรอบอกหรือรอบท้อง', desc: 'ใช้สายวัดพันรอบหน้าอกหรือรอบท้องส่วนที่หนาที่สุด', tip: 'ใช้ตัดเย็บสายรัดพยุงตัว (Harness)' },
    E: { title: 'E : ความยาวจากหลังขาหน้าถึงกลางสะโพก', desc: 'วัดระยะในแนวนอนจากหลังข้อพับขาหน้ามาถึงกึ่งกลางสะโพก', tip: 'ใช้ตัดคานแนวนอน ง' },
    D: { title: 'D : ความสูงจากพื้นถึงหน้าอก', desc: 'วัดจากพื้นในแนวดิ่งขึ้นมาถึงจุดกึ่งกลางกระดูกอกด้านหน้า', tip: 'ใช้ตัดเสาคานหน้าอก จ' },
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Card: Basic Case Info & Animal Selection */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span style={{
              background: 'var(--primary-600)',
              color: '#fff',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>1</span>
            <span>ข้อมูลเคส & สัตว์เลี้ยง</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-secondary"
            title="ล้างข้อมูลและเริ่มใหม่"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} />
            <span>รีเซ็ต</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '0.85rem' }}>
          
          {/* Case ID */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Hash size={14} style={{ color: 'var(--accent-500)' }} />
              <span>รหัสเคส (Case ID)</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="CK-20260920-xxxx"
              value={measurements.caseId || ''}
              onChange={(e) => onChangeMeasurements({ caseId: e.target.value })}
              style={{ fontWeight: 600, color: 'var(--primary-700)' }}
            />
          </div>

          {/* Staff Name (Locked by Google Login) */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={14} style={{ color: 'var(--primary-600)' }} />
                <span>Staff ผู้คำนวณ</span>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Lock size={10} /> บัญชี Google
              </span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="ชื่อผู้ใช้งานจากบัญชี Google"
              value={measurements.staffName || ''}
              readOnly
              title="ชื่อผู้ใช้งานถูกล็อกตามบัญชี Google ที่เข้าสู่ระบบ"
              style={{
                fontWeight: 600,
                background: 'var(--bg-card-hover)',
                cursor: 'not-allowed',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Pet Name */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>ชื่อสัตว์เลี้ยง (Pet Name)</label>
            <input
              type="text"
              className="input-field"
              placeholder="เช่น เจ้าขาว, บราวนี่"
              value={measurements.petName}
              onChange={(e) => onChangeMeasurements({ petName: e.target.value })}
            />
          </div>

          {/* Owner Info */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>เจ้าของ / เบอร์ติดต่อ</label>
            <input
              type="text"
              className="input-field"
              placeholder="คุณสมชาย (081-xxx-xxxx)"
              value={measurements.ownerName}
              onChange={(e) => onChangeMeasurements({ ownerName: e.target.value })}
            />
          </div>

        </div>

        {/* Animal Type & Weight Row */}
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem 1rem',
          background: 'var(--bg-card-hover)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1.5fr',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Type Toggle */}
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>ประเภทสัตว์:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleAnimalTypeChange('dog')}
                style={{
                  padding: '0.45rem',
                  borderRadius: '6px',
                  border: measurements.animalType === 'dog' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                  background: measurements.animalType === 'dog' ? 'var(--primary-50)' : 'var(--bg-card)',
                  color: measurements.animalType === 'dog' ? 'var(--primary-700)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <Dog size={16} /> <span>สุนัข</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnimalTypeChange('cat')}
                style={{
                  padding: '0.45rem',
                  borderRadius: '6px',
                  border: measurements.animalType === 'cat' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                  background: measurements.animalType === 'cat' ? 'var(--primary-50)' : 'var(--bg-card)',
                  color: measurements.animalType === 'cat' ? 'var(--primary-700)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <Cat size={16} /> <span>แมว</span>
              </button>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>น้ำหนักตัว (กก.):</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              className="input-field"
              placeholder="กก."
              value={measurements.weight || ''}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
              style={{ fontWeight: 700, fontSize: '1rem' }}
            />
          </div>

          {/* Recommended Pipe Size */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--primary-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ขนาดท่อที่เลือกใช้:</div>
              <strong style={{ color: 'var(--primary-700)', fontSize: '0.95rem' }}>
                ท่อ PVC {PIPE_CONSTANTS_MAP[pipeSize].sizeName} ({PIPE_CONSTANTS_MAP[pipeSize].sizeInch})
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Settings2 size={13} style={{ color: 'var(--text-muted)' }} />
              <select
                value={pipeSize}
                onChange={(e) => onChangePipeSize(e.target.value as PipeSize, true)}
                style={{
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  background: isManualPipeSize ? 'var(--primary-100)' : 'var(--bg-card)',
                  color: isManualPipeSize ? 'var(--primary-900)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                <option value="3_hun">3 หุน (แมว/สุนัขเล็ก 1-6 กก.)</option>
                <option value="4_hun">4 หุน (สุนัขกลาง 7-12 กก.)</option>
                <option value="6_hun">6 หุน (สุนัขใหญ่ &gt; 12 กก.)</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Card: Wheelchair Configuration & Measurements */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span style={{
              background: 'var(--primary-600)',
              color: '#fff',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>2</span>
            <span>รูปแบบวีลแชร์ & กรอกสัดส่วนร่างกาย ($A, B, G, H, E, D$)</span>
          </div>

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
            <span>ดูภาพตำแหน่งวัดตัว</span>
          </button>
        </div>

        {/* Wheelchair Configuration (2 Wheels vs 4 Wheels) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => onChangeWheelchairType('2_wheel')}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: wheelchairType === '2_wheel' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              background: wheelchairType === '2_wheel' ? 'linear-gradient(to bottom, var(--primary-50), var(--bg-card))' : 'var(--bg-card)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: wheelchairType === '2_wheel' ? 'var(--primary-700)' : 'var(--text-primary)' }}>
                🦽 วีลแชร์ 2 ล้อหลัง (2-Wheel)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                สำหรับสัตว์ที่ขาหน้ายังเดินได้ปกติ ขาหลังอ่อนแรง
              </div>
            </div>
            {wheelchairType === '2_wheel' && <span className="badge badge-primary">เลือกอยู่</span>}
          </button>

          <button
            type="button"
            onClick={() => onChangeWheelchairType('4_wheel')}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: wheelchairType === '4_wheel' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              background: wheelchairType === '4_wheel' ? 'linear-gradient(to bottom, var(--primary-50), var(--bg-card))' : 'var(--bg-card)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: wheelchairType === '4_wheel' ? 'var(--primary-700)' : 'var(--text-primary)' }}>
                🛒 วีลแชร์ 4 ล้อเต็มตัว (4-Wheel)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                สำหรับสัตว์ที่อ่อนแรงทั้ง 4 ขา พยุงลำตัวเต็มรูปแบบ
              </div>
            </div>
            {wheelchairType === '4_wheel' && <span className="badge badge-primary">เลือกอยู่</span>}
          </button>
        </div>

        {/* 6 Measurement Input Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
          
          {/* A */}
          <div
            style={{
              border: activeMeasurementTab === 'A' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              background: activeMeasurementTab === 'A' ? 'var(--primary-50)' : 'var(--bg-card)'
            }}
            onClick={() => setActiveMeasurementTab('A')}
          >
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span><strong style={{ color: '#0284c7' }}>A</strong> : สูงถึงหลังสะโพก</span>
              <span className="badge badge-primary">ซม.</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ความสูงซม."
              value={measurements.A || ''}
              onChange={(e) => onChangeMeasurements({ A: parseFloat(e.target.value) || 0 })}
              style={{ fontWeight: 700, fontSize: '1.1rem' }}
            />
          </div>

          {/* B */}
          <div
            style={{
              border: activeMeasurementTab === 'B' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              background: activeMeasurementTab === 'B' ? 'var(--primary-50)' : 'var(--bg-card)'
            }}
            onClick={() => setActiveMeasurementTab('B')}
          >
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span><strong style={{ color: '#0369a1' }}>B</strong> : สูงถึงท้อง</span>
              <span className="badge badge-primary">ซม.</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ความสูงซม."
              value={measurements.B || ''}
              onChange={(e) => onChangeMeasurements({ B: parseFloat(e.target.value) || 0 })}
              style={{ fontWeight: 700, fontSize: '1.1rem' }}
            />
          </div>

          {/* G */}
          <div
            style={{
              border: activeMeasurementTab === 'G' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              background: activeMeasurementTab === 'G' ? 'var(--primary-50)' : 'var(--bg-card)'
            }}
            onClick={() => setActiveMeasurementTab('G')}
          >
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span><strong style={{ color: '#0d9488' }}>G</strong> : ความกว้างลำตัว</span>
              <span className="badge badge-primary">ซม.</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ความกว้างซม."
              value={measurements.G || ''}
              onChange={(e) => onChangeMeasurements({ G: parseFloat(e.target.value) || 0 })}
              style={{ fontWeight: 700, fontSize: '1.1rem' }}
            />
          </div>

          {/* H */}
          <div
            style={{
              border: activeMeasurementTab === 'H' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              background: activeMeasurementTab === 'H' ? 'var(--primary-50)' : 'var(--bg-card)'
            }}
            onClick={() => setActiveMeasurementTab('H')}
          >
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span><strong style={{ color: '#8b5cf6' }}>H</strong> : รอบอก/รอบท้อง</span>
              <span className="badge badge-primary">ซม.</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ความยาวรอบซม."
              value={measurements.H || ''}
              onChange={(e) => onChangeMeasurements({ H: parseFloat(e.target.value) || 0 })}
              style={{ fontWeight: 700, fontSize: '1.1rem' }}
            />
          </div>

          {/* E */}
          <div
            style={{
              border: activeMeasurementTab === 'E' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              background: activeMeasurementTab === 'E' ? 'var(--primary-50)' : 'var(--bg-card)'
            }}
            onClick={() => setActiveMeasurementTab('E')}
          >
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span><strong style={{ color: '#ea580c' }}>E</strong> : ขาหน้าถึงสะโพก</span>
              <span className="badge badge-primary">ซม.</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ความยาวซม."
              value={measurements.E || ''}
              onChange={(e) => onChangeMeasurements({ E: parseFloat(e.target.value) || 0 })}
              style={{ fontWeight: 700, fontSize: '1.1rem' }}
            />
          </div>

          {/* D */}
          <div
            style={{
              border: activeMeasurementTab === 'D' ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              background: activeMeasurementTab === 'D' ? 'var(--primary-50)' : 'var(--bg-card)'
            }}
            onClick={() => setActiveMeasurementTab('D')}
          >
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span><strong style={{ color: '#e11d48' }}>D</strong> : สูงถึงหน้าอก</span>
              <span className="badge badge-primary">ซม.</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              placeholder="ความสูงซม."
              value={measurements.D || ''}
              onChange={(e) => onChangeMeasurements({ D: parseFloat(e.target.value) || 0 })}
              style={{ fontWeight: 700, fontSize: '1.1rem' }}
            />
          </div>

        </div>

        {/* Selected Field Helper Box */}
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--bg-card-hover)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem'
        }}>
          <Ruler size={18} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
          <div>
            <strong>{measurementDescriptions[activeMeasurementTab].title}:</strong>{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{measurementDescriptions[activeMeasurementTab].desc}</span>{' '}
            <span style={{ color: 'var(--primary-700)', fontWeight: 500 }}>({measurementDescriptions[activeMeasurementTab].tip})</span>
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

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button
          type="button"
          onClick={onNextStep}
          disabled={!isFormValid}
          className="btn btn-primary"
          style={{
            padding: '0.75rem 1.75rem',
            fontSize: '1rem',
            opacity: isFormValid ? 1 : 0.6,
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <span>ถัดไป: ดูขนาดการตัดท่อ (ก - ช)</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
