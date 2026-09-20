import React, { useState } from 'react';
import { AnimalMeasurements } from '../types/wheelchair';
import { Eye, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AnimalMeasurementDiagramProps {
  activeField?: 'A' | 'B' | 'G' | 'H' | 'E' | 'D' | null;
  onSelectField?: (field: 'A' | 'B' | 'G' | 'H' | 'E' | 'D') => void;
  measurements?: Partial<AnimalMeasurements>;
  showToggle?: boolean;
}

export const AnimalMeasurementDiagram: React.FC<AnimalMeasurementDiagramProps> = ({
  activeField,
  onSelectField,
  measurements = {},
  showToggle = true,
}) => {
  const [viewMode, setViewMode] = useState<'svg' | 'photo'>('svg');
  const [hoveredField, setHoveredField] = useState<'A' | 'B' | 'G' | 'H' | 'E' | 'D' | null>(null);

  const currentActive = hoveredField || activeField;

  const getColor = (field: 'A' | 'B' | 'G' | 'H' | 'E' | 'D', defaultColor: string) => {
    if (currentActive === field) return '#f59e0b';
    return defaultColor;
  };

  const getStrokeWidth = (field: 'A' | 'B' | 'G' | 'H' | 'E' | 'D', defaultWidth: number) => {
    if (currentActive === field) return defaultWidth + 2;
    return defaultWidth;
  };

  const handleFieldClick = (field: 'A' | 'B' | 'G' | 'H' | 'E' | 'D') => {
    if (onSelectField) {
      onSelectField(field);
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-card-hover)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1rem',
        position: 'relative',
      }}
    >
      {/* Top Controls: Title & View Mode Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700 }}>
          <Sparkles size={16} style={{ color: 'var(--primary-600)' }} />
          <span>แผนผังตำแหน่งการวัดตัวสัตว์เลี้ยง (ในท่ายืน)</span>
        </div>

        {showToggle && (
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-card)',
              padding: '2px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('svg')}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'svg' ? 'var(--primary-600)' : 'transparent',
                color: viewMode === 'svg' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Eye size={13} />
              <span>ภาพจำลอง Interactive</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('photo')}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'photo' ? 'var(--primary-600)' : 'transparent',
                color: viewMode === 'photo' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <ImageIcon size={13} />
              <span>ภาพต้นฉบับคู่มือ</span>
            </button>
          </div>
        )}
      </div>

      {viewMode === 'photo' ? (
        /* Authentic Photo Mode from Foundation */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <img
            src="/images/measurement-guide.png"
            alt="คู่มือการวัดตัวสุนัขในท่ายืน"
            style={{
              maxWidth: '100%',
              maxHeight: '340px',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', textAlign: 'center' }}>
            ภาพร่างตำแหน่งการวัดสัดส่วนสุนัขในท่ายืน • มูลนิธิ ศ.ดร.จักร พิชัยรณรงค์สงคราม
          </div>
        </div>
      ) : (
        /* High-Definition Interactive Vector Diagram */
        <div style={{ width: '100%' }}>
          <svg
            viewBox="0 0 880 370"
            style={{
              width: '100%',
              maxHeight: '360px',
              display: 'block',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <defs>
              <marker id="arr-A" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={getColor('A', '#0284c7')} />
              </marker>
              <marker id="arr-B" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={getColor('B', '#0369a1')} />
              </marker>
              <marker id="arr-D" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={getColor('D', '#e11d48')} />
              </marker>
              <marker id="arr-E" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={getColor('E', '#ea580c')} />
              </marker>
              <marker id="arr-G" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={getColor('G', '#0d9488')} />
              </marker>
            </defs>

            {/* ======================================================== */}
            {/* LEFT PANEL: SIDE VIEW (มุมมองด้านข้าง - A, B, E, D, H) */}
            {/* ======================================================== */}
            <g id="side-view">
              {/* Ground Line */}
              <line x1="20" y1="310" x2="620" y2="310" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 4" />
              <text x="30" y="330" fill="var(--text-muted)" fontSize="11" fontWeight="500">ระดับพื้น (Ground)</text>

              {/* Title label */}
              <text x="30" y="32" fill="var(--text-primary)" fontSize="13" fontWeight="bold">
                1. มุมมองด้านข้าง (Side View - ให้วัดในท่ายืน)
              </text>

              {/* Dog Body Contour (Anatomical sketch based on user's manual) */}
              <g
                fill="rgba(2, 132, 199, 0.04)"
                stroke="var(--text-primary)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              >
                {/* Snout & Head */}
                <path d="M 470 145 C 500 135 525 150 535 160 C 545 170 540 175 525 180 C 510 185 490 185 480 200" />
                {/* Nose & Mouth */}
                <ellipse cx="538" cy="162" rx="4" ry="3" fill="var(--text-primary)" />
                <path d="M 525 178 Q 532 185 538 180" fill="none" />
                {/* Ears */}
                <path d="M 465 140 C 460 120 445 125 440 150 Z" fill="rgba(2, 132, 199, 0.1)" />
                <path d="M 490 140 C 495 120 510 125 505 150 Z" fill="rgba(2, 132, 199, 0.1)" />
                {/* Neck & Chest Front */}
                <path d="M 480 200 C 460 215 440 220 420 230" />
                {/* Front Left Leg */}
                <path d="M 420 230 L 415 280 L 410 310 L 425 310 L 430 280 L 440 240" />
                {/* Front Right Leg (Background) */}
                <path d="M 445 235 L 448 280 L 452 310 L 465 310 L 460 280 L 455 240" strokeWidth="1.5" opacity="0.6" />
                {/* Withers / Top of shoulder C */}
                <path d="M 440 145 Q 400 140 370 145" />
                {/* Backline to Hip A */}
                <path d="M 370 145 C 320 150 250 145 200 140" />
                {/* Croup & Tail */}
                <path d="M 200 140 C 160 140 135 160 125 190" />
                <path d="M 130 170 C 110 180 95 210 100 240" strokeWidth="3" />
                {/* Rear Left Leg */}
                <path d="M 125 190 C 130 220 140 250 170 275 L 175 310 L 195 310 L 190 280 C 185 250 195 230 205 210" />
                {/* Rear Right Leg (Background) */}
                <path d="M 160 200 C 165 230 170 260 190 285 L 195 310 L 210 310 L 205 285 L 215 220" strokeWidth="1.5" opacity="0.6" />
                {/* Abdomen / Belly curve B */}
                <path d="M 205 210 C 230 230 270 245 330 240 C 370 238 400 232 420 230" />
              </g>

              {/* Shaded Girth Loops from Image 1: H (Chest), I (Abdomen), J (Thigh), K (Armpit) */}
              {/* Girth H : Chest Circumference */}
              <ellipse
                cx="380"
                cy="195"
                rx="22"
                ry="46"
                fill={currentActive === 'H' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(139, 92, 246, 0.15)'}
                stroke={getColor('H', '#8b5cf6')}
                strokeWidth={getStrokeWidth('H', 2)}
                strokeDasharray="4 3"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredField('H')}
                onMouseLeave={() => setHoveredField(null)}
                onClick={() => handleFieldClick('H')}
              />
              {/* Girth I : Abdomen Circumference */}
              <ellipse cx="235" cy="185" rx="16" ry="38" fill="rgba(148, 163, 184, 0.15)" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Girth J : Thigh */}
              <ellipse cx="165" cy="205" rx="28" ry="14" fill="rgba(148, 163, 184, 0.15)" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Girth K : Front armpit */}
              <ellipse cx="430" cy="235" rx="15" ry="12" fill="rgba(148, 163, 184, 0.15)" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Reference markers C, I, J, K */}
              <text x="370" y="132" fill="var(--text-muted)" fontSize="11" fontWeight="bold">C (ไหล่)</text>
              <line x1="360" y1="140" x2="380" y2="140" stroke="var(--text-muted)" strokeWidth="2" />

              <text x="248" y="195" fill="#64748b" fontSize="11" fontWeight="bold">I</text>
              <text x="160" y="210" fill="#64748b" fontSize="11" fontWeight="bold">J</text>
              <text x="445" y="240" fill="#64748b" fontSize="11" fontWeight="bold">K</text>

              {/* Dimension A : Hip Height (พื้นถึงหลังสะโพก) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredField('A')}
                onMouseLeave={() => setHoveredField(null)}
                onClick={() => handleFieldClick('A')}
              >
                <line x1="180" y1="135" x2="220" y2="135" stroke={getColor('A', '#0284c7')} strokeWidth="2" />
                <line
                  x1="200"
                  y1="135"
                  x2="200"
                  y2="310"
                  stroke={getColor('A', '#0284c7')}
                  strokeWidth={getStrokeWidth('A', 2.5)}
                  markerStart="url(#arr-A)"
                  markerEnd="url(#arr-A)"
                />
                <rect x="155" y="68" width="88" height="24" rx="5" fill={currentActive === 'A' ? '#f59e0b' : '#0284c7'} />
                <text x="199" y="84" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  A : สูงสะโพก {measurements.A ? `(${measurements.A})` : ''}
                </text>
              </g>

              {/* Dimension B : Belly Height (พื้นถึงใต้ท้อง) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredField('B')}
                onMouseLeave={() => setHoveredField(null)}
                onClick={() => handleFieldClick('B')}
              >
                <line x1="225" y1="222" x2="245" y2="222" stroke={getColor('B', '#0369a1')} strokeWidth="1.5" />
                <line
                  x1="235"
                  y1="222"
                  x2="235"
                  y2="310"
                  stroke={getColor('B', '#0369a1')}
                  strokeWidth={getStrokeWidth('B', 2.5)}
                  markerStart="url(#arr-B)"
                  markerEnd="url(#arr-B)"
                />
                <rect x="245" y="255" width="75" height="22" rx="4" fill={currentActive === 'B' ? '#f59e0b' : '#0369a1'} />
                <text x="282" y="270" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  B : ท้อง {measurements.B ? `(${measurements.B})` : ''}
                </text>
              </g>

              {/* Dimension D : Chest Height (พื้นถึงหน้าอก) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredField('D')}
                onMouseLeave={() => setHoveredField(null)}
                onClick={() => handleFieldClick('D')}
              >
                <line x1="400" y1="230" x2="425" y2="230" stroke={getColor('D', '#e11d48')} strokeWidth="1.5" />
                <line
                  x1="410"
                  y1="230"
                  x2="410"
                  y2="310"
                  stroke={getColor('D', '#e11d48')}
                  strokeWidth={getStrokeWidth('D', 2.5)}
                  markerStart="url(#arr-D)"
                  markerEnd="url(#arr-D)"
                />
                <rect x="360" y="270" width="70" height="22" rx="4" fill={currentActive === 'D' ? '#f59e0b' : '#e11d48'} />
                <text x="395" y="285" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  D : อก {measurements.D ? `(${measurements.D})` : ''}
                </text>
              </g>

              {/* Dimension E : Length from Front Leg to Mid Hip (ขาหน้าถึงสะโพก) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredField('E')}
                onMouseLeave={() => setHoveredField(null)}
                onClick={() => handleFieldClick('E')}
              >
                {/* Horizontal distance line at mid body */}
                <line x1="200" y1="175" x2="200" y2="105" stroke={getColor('E', '#ea580c')} strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="420" y1="220" x2="420" y2="105" stroke={getColor('E', '#ea580c')} strokeWidth="1.5" strokeDasharray="3 3" />
                <line
                  x1="200"
                  y1="110"
                  x2="420"
                  y2="110"
                  stroke={getColor('E', '#ea580c')}
                  strokeWidth={getStrokeWidth('E', 2.5)}
                  markerStart="url(#arr-E)"
                  markerEnd="url(#arr-E)"
                />
                <rect x="270" y="98" width="95" height="24" rx="5" fill={currentActive === 'E' ? '#f59e0b' : '#ea580c'} />
                <text x="317" y="114" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  E : ลำตัว {measurements.E ? `(${measurements.E} cm)` : ''}
                </text>
              </g>

              {/* Dimension H : Chest Girth callout button */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredField('H')}
                onMouseLeave={() => setHoveredField(null)}
                onClick={() => handleFieldClick('H')}
              >
                <rect x="345" y="180" width="70" height="24" rx="5" fill={currentActive === 'H' ? '#f59e0b' : '#8b5cf6'} />
                <text x="380" y="196" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  H : รอบอก
                </text>
              </g>
            </g>

            {/* ======================================================== */}
            {/* RIGHT PANEL: FRONT VIEW (มุมมองด้านหน้า - G & L) */}
            {/* ======================================================== */}
            <g id="front-view" transform="translate(630, 0)">
              {/* Vertical divider */}
              <line x1="-15" y1="20" x2="-15" y2="330" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Title label */}
              <text x="15" y="32" fill="var(--text-primary)" fontSize="13" fontWeight="bold">
                2. มุมมองด้านหน้า (Front View)
              </text>

              {/* Ground Line */}
              <line x1="5" y1="310" x2="225" y2="310" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 4" />

              {/* Dog Front Contour (from Image 1 right illustration) */}
              <g
                fill="rgba(13, 148, 136, 0.05)"
                stroke="var(--text-primary)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              >
                {/* Head Top & Ears */}
                <path d="M 80 130 C 95 110 135 110 150 130" />
                <path d="M 75 130 C 60 140 55 170 70 175 C 80 175 85 160 85 145" fill="rgba(13, 148, 136, 0.12)" />
                <path d="M 155 130 C 170 140 175 170 160 175 C 150 175 145 160 145 145" fill="rgba(13, 148, 136, 0.12)" />
                {/* Cheeks & Chin */}
                <path d="M 85 145 C 80 170 100 185 115 185 C 130 185 150 170 145 145" />
                {/* Eyes & Nose & Smile */}
                <circle cx="98" cy="142" r="3" fill="var(--text-primary)" />
                <circle cx="132" cy="142" r="3" fill="var(--text-primary)" />
                <ellipse cx="115" cy="155" rx="5" ry="3.5" fill="var(--text-primary)" />
                <path d="M 107 165 Q 115 172 123 165" fill="none" />
                {/* Broad Shoulders / Body Sides G */}
                <path d="M 68 180 C 50 200 48 240 52 280" />
                <path d="M 162 180 C 180 200 182 240 178 280" />
                {/* Front Left Leg */}
                <path d="M 52 280 L 55 310 L 75 310 L 78 280 L 82 230" />
                {/* Front Right Leg */}
                <path d="M 178 280 L 175 310 L 155 310 L 152 280 L 148 230" />
                {/* Inner Chest & Belly */}
                <path d="M 82 230 C 95 240 115 250 115 260 C 115 250 135 240 148 230" />
              </g>

              {/* Dimension G : Body Width (กว้างลำตัว) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredField('G')}
                onMouseLeave={() => setHoveredField(null)}
                onClick={() => handleFieldClick('G')}
              >
                {/* Two vertical tangent caliper lines bounding the body */}
                <line x1="45" y1="85" x2="45" y2="280" stroke={getColor('G', '#0d9488')} strokeWidth="1.5" />
                <line x1="185" y1="85" x2="185" y2="280" stroke={getColor('G', '#0d9488')} strokeWidth="1.5" />
                {/* Horizontal width arrow */}
                <line
                  x1="45"
                  y1="90"
                  x2="185"
                  y2="90"
                  stroke={getColor('G', '#0d9488')}
                  strokeWidth={getStrokeWidth('G', 2.5)}
                  markerStart="url(#arr-G)"
                  markerEnd="url(#arr-G)"
                />
                <rect x="70" y="78" width="90" height="24" rx="5" fill={currentActive === 'G' ? '#f59e0b' : '#0d9488'} />
                <text x="115" y="94" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  G : กว้างลำตัว {measurements.G ? `(${measurements.G})` : ''}
                </text>
              </g>

              {/* Reference Dimension L : Distance between front legs */}
              <g opacity="0.8">
                <line x1="78" y1="245" x2="152" y2="245" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="115" y="240" fill="#64748b" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  L (ระหว่างขาหน้า)
                </text>
              </g>
            </g>
          </svg>

          {/* Quick Helper Subtitle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem',
              padding: '0 0.25rem',
            }}
          >
            <span>💡 คลิกหรือชี้ที่ค่า A, B, G, H, E, D บนแผนผังเพื่อดูตำแหน่งวัด</span>
            <span>ความกว้าง G สัมพันธ์กับรอบอก H (รอบอก ÷ 3.14 ≈ G)</span>
          </div>
        </div>
      )}
    </div>
  );
};
