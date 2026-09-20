import React from 'react';
import { X, Ruler, Info, CheckCircle2 } from 'lucide-react';

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
        <div style={{
          background: 'var(--bg-card-hover)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <svg viewBox="0 0 700 320" style={{ width: '100%', maxHeight: '280px', margin: '0 auto', display: 'block' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
              </marker>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#e11d48" />
              </marker>
              <marker id="arrow-orange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ea580c" />
              </marker>
            </defs>

            {/* Ground Line */}
            <line x1="40" y1="260" x2="660" y2="260" stroke="var(--text-muted)" strokeWidth="2.5" strokeDasharray="6 4" />
            <text x="50" y="280" fill="var(--text-muted)" fontSize="13" fontWeight="500">ระดับพื้น (Ground Level)</text>

            {/* Dog Silhouette Art */}
            <g fill="none" stroke="var(--text-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
              {/* Head & Snout */}
              <path d="M 170 120 Q 150 110 130 115 Q 110 125 105 135 L 125 145 Q 145 150 160 170" fill="rgba(2, 132, 199, 0.08)" />
              {/* Ears */}
              <path d="M 160 115 L 180 85 L 195 110" />
              {/* Back to Hip */}
              <path d="M 180 120 Q 280 110 400 115 Q 460 120 480 150" />
              {/* Tail */}
              <path d="M 480 150 Q 520 120 540 100" strokeWidth="4" />
              {/* Front Leg */}
              <path d="M 220 180 L 220 260" strokeWidth="4" />
              {/* Chest & Belly */}
              <path d="M 160 170 Q 200 210 240 190 Q 320 200 420 180" />
              {/* Rear Leg */}
              <path d="M 460 150 L 470 200 L 465 260" strokeWidth="4" />
            </g>

            {/* Dimension A: Height to Hip */}
            <line x1="500" y1="260" x2="500" y2="120" stroke="#0284c7" strokeWidth="2.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <rect x="510" y="180" width="75" height="26" rx="6" fill="#0284c7" />
            <text x="547" y="198" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">A : สูงสะโพก</text>

            {/* Dimension B: Height to Belly */}
            <line x1="340" y1="260" x2="340" y2="195" stroke="#0369a1" strokeWidth="2.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <rect x="350" y="215" width="65" height="26" rx="6" fill="#0369a1" />
            <text x="382" y="233" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">B : สูงท้อง</text>

            {/* Dimension D: Height to Chest */}
            <line x1="130" y1="260" x2="130" y2="175" stroke="#e11d48" strokeWidth="2.5" markerStart="url(#arrow-red)" markerEnd="url(#arrow-red)" />
            <rect x="75" y="200" width="70" height="26" rx="6" fill="#e11d48" />
            <text x="110" y="218" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">D : สูงอก</text>

            {/* Dimension E: Length from Front Leg to Hip */}
            <line x1="230" y1="90" x2="470" y2="90" stroke="#ea580c" strokeWidth="2.5" markerStart="url(#arrow-orange)" markerEnd="url(#arrow-orange)" />
            <line x1="230" y1="80" x2="230" y2="180" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="470" y1="80" x2="470" y2="150" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="305" y="65" width="100" height="26" rx="6" fill="#ea580c" />
            <text x="355" y="83" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">E : ความยาวลำตัว</text>

            {/* Width G and Circumference H notes */}
            <circle cx="270" cy="165" r="16" fill="#8b5cf6" opacity="0.9" />
            <text x="270" y="170" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">H (รอบอก)</text>
            
            <circle cx="390" cy="140" r="16" fill="#0d9488" opacity="0.9" />
            <text x="390" y="145" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">G (กว้าง)</text>
          </svg>
        </div>

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
