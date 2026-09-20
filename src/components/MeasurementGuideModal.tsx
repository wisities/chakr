import React from 'react';
import { X, Ruler, Info, CheckCircle2 } from 'lucide-react';
import { AnimalMeasurementDiagram } from './AnimalMeasurementDiagram';

interface MeasurementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const guides = [
    {
      code: 'A',
      title: 'ความสูงจากพื้นถึงหลังสะโพก',
      unit: 'ซม. (cm)',
      desc: 'ให้สัตว์ยืนตรงในท่ายืนปกติ (หรือประคอง) วัดจากพื้นแนวดิ่งขึ้นไปจนถึงจุดสูงสุดของหลังบริเวณสะโพก',
      tip: 'สำคัญมากสำหรับกำหนดความสูงของโครงวีลแชร์',
      color: '#0284c7'
    },
    {
      code: 'B',
      title: 'ความสูงจากพื้นถึงท้อง',
      unit: 'ซม. (cm)',
      desc: 'วัดจากพื้นแนวดิ่งขึ้นมาถึงระดับใต้ท้องสัตว์ส่วนที่ต่ำที่สุด เพื่อไม่ให้คานท่อกดหรือครูดท้องสัตว์',
      tip: 'ใช้หาค่าเฉลี่ยความสูง (A + B) / 2',
      color: '#0369a1'
    },
    {
      code: 'G',
      title: 'ความกว้างลำตัว',
      unit: 'ซม. (cm)',
      desc: 'วัดความกว้างของลำตัวสัตว์ส่วนที่กว้างที่สุด (มองจากด้านบนหรือด้านหน้า ซ้ายไปขวา) ขณะยืนตรง',
      tip: 'ใช้ตัดคานขวาง ก เพื่อให้มีช่องว่างพอดีตัวสัตว์ ไม่คับและไม่หลวมเกินไป',
      color: '#0d9488'
    },
    {
      code: 'H',
      title: 'ความยาวรอบอกหรือรอบท้อง',
      unit: 'ซม. (cm)',
      desc: 'ใช้สายวัดพันรอบหน้าอกส่วนที่ลึกที่สุด หรือรอบท้องส่วนที่หนาที่สุด',
      tip: 'ใช้สำหรับตัดเย็บสายรัดพยุงตัว (Harness) และสายคล้องรับน้ำหนัก',
      color: '#8b5cf6'
    },
    {
      code: 'E',
      title: 'ความยาวจากหลังขาหน้าถึงกลางสะโพก',
      unit: 'ซม. (cm)',
      desc: 'วัดระยะในแนวนอนจากจุดหลังข้อศอก/ข้อพับขาหน้า ยาวมาจนถึงกึ่งกลางข้อต่อสะโพกหรือก้น',
      tip: 'ใช้ตัดคานแนวนอน ง เพื่อให้ตำแหน่งแกนล้อตรงกับสะโพกสัตว์พอดี',
      color: '#ea580c'
    },
    {
      code: 'D',
      title: 'ความสูงจากพื้นถึงหน้าอก',
      unit: 'ซม. (cm)',
      desc: 'วัดจากพื้นแนวดิ่งขึ้นมาถึงจุดกึ่งกลางกระดูกอกด้านหน้า (จุดรับสายรัดอก)',
      tip: 'ใช้ตัดเสาคานหน้าอก จ เพื่อป้องกันไม่ให้คานกดหลอดลมหรือคอสัตว์',
      color: '#e11d48'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade-in"
        style={{
          maxWidth: '860px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '1.75rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-card-hover)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Ruler size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>คู่มือตำแหน่งการวัดขนาดตัวสัตว์ (A, B, G, H, E, D)</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              แนะนำให้ใช้สายวัดหรือตลับเมตร และให้สัตว์อยู่ในท่ายืนสี่ขาปกติ (หรือมีคนช่วยพยุง)
            </p>
          </div>
        </div>

        {/* Visual Diagram of Dog Measurement Points */}
        <AnimalMeasurementDiagram showToggle={true} />

        {/* Detail Cards for Each Parameter */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          {guides.map((g) => (
            <div
              key={g.code}
              style={{
                border: `1.5px solid ${g.color}33`,
                background: `${g.color}0a`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: g.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  flexShrink: 0
                }}
              >
                {g.code}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{g.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({g.unit})</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  {g.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: g.color, fontWeight: 500 }}>
                  <Info size={14} />
                  <span>{g.tip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips for Quality Measurement */}
        <div style={{
          background: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}>
          <CheckCircle2 size={20} style={{ color: 'var(--primary-600)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--primary-900)' }}>
            <strong>ข้อแนะนำเพื่อความแม่นยำ:</strong> ให้ผู้ช่วยช่วยประคองให้ขาทั้ง 4 ข้างเหยียดตรงระดับพื้น และวางแนวสายวัดให้ตั้งฉากกับพื้นในแนวดิ่งเสมอ หลีกเลี่ยงการวัดขณะสัตว์นอนงอตัว เพื่อให้ได้ขนาดชิ้นส่วนตัดท่อที่สมดุลและสัตว์ใช้งานได้สบายที่สุด
          </div>
        </div>

      </div>
    </div>
  );
};
