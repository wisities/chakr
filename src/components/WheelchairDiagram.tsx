import React, { useState } from 'react';
import { CalculationResult, PartKey } from '../types/wheelchair';
import { Layers, Eye, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface WheelchairDiagramProps {
  calculationResult: CalculationResult;
  selectedPartKey?: PartKey | null;
  onSelectPart?: (key: PartKey | null) => void;
}

export const WheelchairDiagram: React.FC<WheelchairDiagramProps> = ({
  calculationResult,
  selectedPartKey,
  onSelectPart,
}) => {
  const [viewMode, setViewMode] = useState<'cad' | 'photo'>('cad');
  const [hoveredKey, setHoveredKey] = useState<PartKey | null>(null);

  const { wheelchairType, pipeSize, parts, pipeConstants } = calculationResult;
  const activeKey = selectedPartKey || hoveredKey;

  // Map to the correct photo asset based on user's 4 model reference photos
  const getReferencePhoto = () => {
    if (wheelchairType === '2_wheel') {
      if (pipeSize === '3_hun') {
        return {
          src: '/images/wheelchair-2wheel-3hun.png',
          title: 'แบบ 2 ล้อ ขนาดท่อ 3 หุน',
          note: 'โครงสร้างวีลแชร์ 2 ล้อหลัง ท่อ PVC 3/8" (สำหรับสัตว์เล็ก 1-6 กก.)',
        };
      } else {
        return {
          src: '/images/wheelchair-2wheel-46hun.png',
          title: `แบบ 2 ล้อ ขนาดท่อ ${pipeSize === '4_hun' ? '4 หุน' : '6 หุน'}`,
          note: `โครงสร้างวีลแชร์ 2 ล้อหลัง ท่อ PVC ${pipeSize === '4_hun' ? '1/2"' : '3/4"'} (สำหรับสุนัขกลาง-ใหญ่)`,
        };
      }
    } else {
      // 4-wheel
      if (pipeSize === '3_hun') {
        return {
          src: '/images/wheelchair-4wheel-3hun.png',
          title: 'แบบ 4 ล้อ ขนาดท่อ 3 หุน',
          note: 'โครงสร้างวีลแชร์ 4 ล้อเต็มตัว ท่อ PVC 3/8" (ล้อหน้าคาสเตอร์ + ล้อหลัง)',
        };
      } else {
        return {
          src: '/images/wheelchair-4wheel-46hun.png',
          title: `แบบ 4 ล้อ ขนาดท่อ ${pipeSize === '4_hun' ? '4 หุน' : '6 หุน'}`,
          note: `โครงสร้างวีลแชร์ 4 ล้อเต็มตัว ท่อ PVC ${pipeSize === '4_hun' ? '1/2"' : '3/4"'} มีเสาค้ำกลาง จ`,
        };
      }
    }
  };

  const photoInfo = getReferencePhoto();

  const getPart = (k: PartKey) => parts.find((p) => p.key === k);

  const getPipeColor = (k: PartKey, defaultCol = '#0284c7') => {
    if (activeKey === k) return '#f59e0b';
    return defaultCol;
  };

  const getPipeStrokeWidth = (k: PartKey, defaultWidth = 9) => {
    if (activeKey === k) return defaultWidth + 4;
    return defaultWidth;
  };

  return (
    <div className="card">
      {/* Card Header with View Mode Switcher */}
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
        <div className="card-title">
          <Layers size={18} style={{ color: 'var(--primary-600)' }} />
          <span>ภาพจำลองการประกอบชิ้นส่วนวีลแชร์ PVC</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge badge-primary">
            {wheelchairType === '2_wheel' ? 'แบบ 2 ล้อหลัง' : 'แบบ 4 ล้อ'} • {pipeConstants.sizeName}
          </span>

          {/* Toggle between Interactive CAD and Real Assembly Photo */}
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
              onClick={() => setViewMode('cad')}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'cad' ? 'var(--primary-600)' : 'transparent',
                color: viewMode === 'cad' ? '#fff' : 'var(--text-secondary)',
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
              <span>ภาพถ่ายชิ้นงานประกอบจริง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      {viewMode === 'photo' ? (
        /* Real Reference Photo Display */
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ marginBottom: '0.5rem', fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
            {photoInfo.title}
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              maxHeight: '440px',
              maxWidth: '100%',
            }}
          >
            <img
              src={photoInfo.src}
              alt={photoInfo.title}
              style={{
                maxHeight: '420px',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem', margin: '0.75rem 0 0 0' }}>
            {photoInfo.note} • แผนผังช่างจากมูลนิธิ ศ.ดร.จักร พิชัยรณรงค์สงคราม
          </p>
        </div>
      ) : (
        /* Interactive Realistic CAD/SVG Assembly Simulation */
        <div
          style={{
            background: 'var(--bg-card-hover)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {wheelchairType === '2_wheel' ? (
            /* =================================================== */
            /* 2-WHEEL ASSEMBLY SCHEMATIC (Based on Photos 3 & 4) */
            /* =================================================== */
            <svg viewBox="0 0 740 370" style={{ width: '100%', maxHeight: '350px', display: 'block' }}>
              <defs>
                <linearGradient id="pvcPipe" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="pvcFitting" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Ground Line */}
              <line x1="30" y1="320" x2="710" y2="320" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 4" />
              <text x="40" y="340" fill="var(--text-muted)" fontSize="11" fontWeight="500">ระดับพื้น (Ground Level)</text>

              {/* Wheels (Dual rear wheels with spokes as seen in photos) */}
              <g id="rear-wheels">
                {/* Rear Far Wheel (Perspective offset) */}
                <circle cx="565" cy="255" r="48" fill="rgba(15, 23, 42, 0.05)" stroke="#64748b" strokeWidth="10" />
                <circle cx="565" cy="255" r="7" fill="#475569" />

                {/* Rear Near Wheel */}
                <circle cx="540" cy="270" r="48" fill="none" stroke="#334155" strokeWidth="12" />
                <circle cx="540" cy="270" r="42" fill="rgba(15, 23, 42, 0.08)" />
                {/* 5 Spokes */}
                <line x1="540" y1="225" x2="540" y2="315" stroke="#94a3b8" strokeWidth="3" />
                <line x1="495" y1="270" x2="585" y2="270" stroke="#94a3b8" strokeWidth="3" />
                <line x1="508" y1="238" x2="572" y2="302" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="508" y1="302" x2="572" y2="238" stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="540" cy="270" r="9" fill="#0f172a" />
                <text x="540" y="338" fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontWeight="bold">
                  ล้อหลังยางตัน R = {pipeConstants.rearWheelRadius} ซม.
                </text>
              </g>

              {/* ---------------- PVC FITTINGS (TEES & ELBOWS) ---------------- */}
              {/* Rear Upper Elbow (Corner behind rear leg) */}
              <rect x="635" y="112" width="22" height="22" rx="4" fill="#475569" />
              {/* Rear Upper Tee (Tee 1 above rear leg) */}
              <rect x="580" y="112" width="24" height="24" rx="4" fill="#475569" />
              {/* Rear Upper Tee 2 (Tee 2 above rear leg) */}
              <rect x="500" y="112" width="24" height="24" rx="4" fill="#475569" />
              {/* Front Tee (Tee above front post จ) */}
              <rect x="250" y="112" width="24" height="24" rx="4" fill="#475569" />

              {/* Part ก : Rear Crossbar (คานขวางด้านหลัง) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ก')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ก' ? null : 'ก')}
                filter={activeKey === 'ก' ? 'url(#glow)' : undefined}
              >
                {/* 3D angled representation */}
                <line
                  x1="645" y1="122" x2="685" y2="105"
                  stroke={getPipeColor('ก', '#8b5cf6')}
                  strokeWidth={getPipeStrokeWidth('ก', 10)}
                  strokeLinecap="round"
                />
                <rect x="645" y="70" width="75" height="24" rx="5" fill={activeKey === 'ก' ? '#f59e0b' : '#8b5cf6'} />
                <text x="682" y="86" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ก : {getPart('ก')?.lengthCm} cm
                </text>
              </g>

              {/* Part ค : Rear connector pipe between Elbow and first Tee */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ค')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ค' ? null : 'ค')}
                filter={activeKey === 'ค' ? 'url(#glow)' : undefined}
              >
                <line
                  x1="604" y1="123" x2="635" y2="123"
                  stroke={getPipeColor('ค', '#0369a1')}
                  strokeWidth={getPipeStrokeWidth('ค', 10)}
                  strokeLinecap="round"
                />
                <rect x="598" y="70" width="45" height="22" rx="4" fill={activeKey === 'ค' ? '#f59e0b' : '#0369a1'} />
                <text x="620" y="85" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  ค : {getPart('ค')?.lengthCm}
                </text>
              </g>

              {/* Part ฉ : Spacer pipe between the two rear vertical leg tees */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ฉ')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ฉ' ? null : 'ฉ')}
                filter={activeKey === 'ฉ' ? 'url(#glow)' : undefined}
              >
                <line
                  x1="524" y1="123" x2="580" y2="123"
                  stroke={getPipeColor('ฉ', '#ec4899')}
                  strokeWidth={getPipeStrokeWidth('ฉ', 10)}
                  strokeLinecap="round"
                />
                <rect x="532" y="70" width="45" height="22" rx="4" fill={activeKey === 'ฉ' ? '#f59e0b' : '#ec4899'} />
                <text x="554" y="85" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  ฉ : {getPart('ฉ')?.lengthCm}
                </text>
              </g>

              {/* Part ข (Dual vertical pipes per side down to wheel axle as in photo) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ข')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ข' ? null : 'ข')}
                filter={activeKey === 'ข' ? 'url(#glow)' : undefined}
              >
                {/* Leg 1 */}
                <line
                  x1="512" y1="136" x2="512" y2="250"
                  stroke={getPipeColor('ข', '#0284c7')}
                  strokeWidth={getPipeStrokeWidth('ข', 9)}
                  strokeLinecap="round"
                />
                {/* Leg 2 */}
                <line
                  x1="592" y1="136" x2="592" y2="250"
                  stroke={getPipeColor('ข', '#0284c7')}
                  strokeWidth={getPipeStrokeWidth('ข', 9)}
                  strokeLinecap="round"
                />
                {/* Bottom axle hub joiner */}
                <line x1="505" y1="250" x2="599" y2="250" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

                <rect x="525" y="175" width="70" height="24" rx="5" fill={activeKey === 'ข' ? '#f59e0b' : '#0284c7'} />
                <text x="560" y="191" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ข : {getPart('ข')?.lengthCm} cm
                </text>
              </g>

              {/* Part ง : Side Horizontal Main Beam(s) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ง')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ง' ? null : 'ง')}
                filter={activeKey === 'ง' ? 'url(#glow)' : undefined}
              >
                <line
                  x1="274" y1="123" x2="500" y2="123"
                  stroke={getPipeColor('ง', '#0ea5e9')}
                  strokeWidth={getPipeStrokeWidth('ง', 10)}
                  strokeLinecap="round"
                />
                <rect x="350" y="90" width="80" height="24" rx="5" fill={activeKey === 'ง' ? '#f59e0b' : '#0ea5e9'} />
                <text x="390" y="106" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ง : {getPart('ง')?.lengthCm} cm
                </text>
              </g>

              {/* Front Clamps & Forward Extension */}
              <g>
                <line x1="180" y1="123" x2="250" y2="123" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" />
                {/* Front Clips / Clamps (ก้ามปูล็อคสายพยุงหน้า) */}
                <rect x="175" y="114" width="16" height="18" rx="3" fill="#38bdf8" />
                <rect x="210" y="114" width="16" height="18" rx="3" fill="#38bdf8" />
                <text x="195" y="95" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ก้ามปู 4 ตัว
                </text>
              </g>

              {/* Part จ : Front Vertical Chest Post (เสาคานหน้าอก) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('จ')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'จ' ? null : 'จ')}
                filter={activeKey === 'จ' ? 'url(#glow)' : undefined}
              >
                <line
                  x1="262" y1="136" x2="262" y2="215"
                  stroke={getPipeColor('จ', '#0d9488')}
                  strokeWidth={getPipeStrokeWidth('จ', 9)}
                  strokeLinecap="round"
                />
                <rect x="225" y="165" width="70" height="24" rx="5" fill={activeKey === 'จ' ? '#f59e0b' : '#0d9488'} />
                <text x="260" y="181" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  จ : {getPart('จ')?.lengthCm} cm
                </text>
              </g>

              {/* Harness Sling (สายรัดพยุงลำตัว) */}
              <path
                d="M 262 215 Q 380 255 512 215"
                fill="none"
                stroke="#d97706"
                strokeWidth="3.5"
                strokeDasharray="5 3"
              />
              <text x="385" y="260" fill="#d97706" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                สายรัดพยุงอกและสะโพก (Harness Straps)
              </text>
            </svg>
          ) : (
            /* =================================================== */
            /* 4-WHEEL ASSEMBLY SCHEMATIC (Based on Photos 2 & 5) */
            /* =================================================== */
            <svg viewBox="0 0 740 370" style={{ width: '100%', maxHeight: '350px', display: 'block' }}>
              <defs>
                <filter id="glow4" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Ground Line */}
              <line x1="30" y1="320" x2="710" y2="320" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 4" />
              <text x="40" y="340" fill="var(--text-muted)" fontSize="11" fontWeight="500">ระดับพื้น (Ground Level)</text>

              {/* Rear Wheels */}
              <g id="rear-wheels-4w">
                <circle cx="560" cy="270" r="48" fill="none" stroke="#334155" strokeWidth="12" />
                <circle cx="560" cy="270" r="42" fill="rgba(15, 23, 42, 0.08)" />
                <line x1="560" y1="225" x2="560" y2="315" stroke="#94a3b8" strokeWidth="3" />
                <line x1="515" y1="270" x2="605" y2="270" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="560" cy="270" r="9" fill="#0f172a" />
                <text x="560" y="338" fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontWeight="bold">
                  ล้อหลัง R = {pipeConstants.rearWheelRadius} cm
                </text>
              </g>

              {/* Front Caster Wheels (Small swivel casters with bracket as seen in photo) */}
              <g id="front-casters-4w">
                {/* Mounting U-fork and wheel */}
                <rect x="180" y="275" width="22" height="15" rx="2" fill="#475569" />
                <circle cx="191" cy="305" r="15" fill="#1e293b" stroke="#64748b" strokeWidth="5" />
                <circle cx="191" cy="305" r="4" fill="#fff" />
                <text x="191" y="338" fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontWeight="bold">
                  ล้อหน้าคาสเตอร์ H = {pipeConstants.frontWheelHeight} cm
                </text>
              </g>

              {/* Rear PVC Fittings */}
              <rect x="645" y="112" width="22" height="22" rx="4" fill="#475569" />
              <rect x="595" y="112" width="24" height="24" rx="4" fill="#475569" />
              <rect x="525" y="112" width="24" height="24" rx="4" fill="#475569" />

              {/* Front PVC Fittings */}
              <rect x="220" y="112" width="24" height="24" rx="4" fill="#475569" />
              <rect x="150" y="112" width="24" height="24" rx="4" fill="#475569" />
              <rect x="85" y="112" width="22" height="22" rx="4" fill="#475569" />

              {/* Part ก : Rear Crossbar (คานขวาง) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ก')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ก' ? null : 'ก')}
                filter={activeKey === 'ก' ? 'url(#glow4)' : undefined}
              >
                <line
                  x1="655" y1="123" x2="695" y2="105"
                  stroke={getPipeColor('ก', '#8b5cf6')}
                  strokeWidth={getPipeStrokeWidth('ก', 10)}
                  strokeLinecap="round"
                />
                <rect x="645" y="70" width="75" height="24" rx="5" fill={activeKey === 'ก' ? '#f59e0b' : '#8b5cf6'} />
                <text x="682" y="86" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ก : {getPart('ก')?.lengthCm} cm
                </text>
              </g>

              {/* Part ค : Rear & Front Connector Pipes */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ค')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ค' ? null : 'ค')}
                filter={activeKey === 'ค' ? 'url(#glow4)' : undefined}
              >
                {/* Rear connector */}
                <line
                  x1="619" y1="123" x2="645" y2="123"
                  stroke={getPipeColor('ค', '#0369a1')}
                  strokeWidth={getPipeStrokeWidth('ค', 10)}
                  strokeLinecap="round"
                />
                {/* Front connector */}
                <line
                  x1="107" y1="123" x2="150" y2="123"
                  stroke={getPipeColor('ค', '#0369a1')}
                  strokeWidth={getPipeStrokeWidth('ค', 10)}
                  strokeLinecap="round"
                />
                <rect x="95" y="70" width="50" height="22" rx="4" fill={activeKey === 'ค' ? '#f59e0b' : '#0369a1'} />
                <text x="120" y="85" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  ค : {getPart('ค')?.lengthCm}
                </text>
              </g>

              {/* Part ฉ : Spacers between leg tees (Front & Rear) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ฉ')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ฉ' ? null : 'ฉ')}
                filter={activeKey === 'ฉ' ? 'url(#glow4)' : undefined}
              >
                {/* Rear spacer */}
                <line
                  x1="549" y1="123" x2="595" y2="123"
                  stroke={getPipeColor('ฉ', '#ec4899')}
                  strokeWidth={getPipeStrokeWidth('ฉ', 10)}
                  strokeLinecap="round"
                />
                {/* Front spacer */}
                <line
                  x1="174" y1="123" x2="220" y2="123"
                  stroke={getPipeColor('ฉ', '#ec4899')}
                  strokeWidth={getPipeStrokeWidth('ฉ', 10)}
                  strokeLinecap="round"
                />
                <rect x="548" y="70" width="45" height="22" rx="4" fill={activeKey === 'ฉ' ? '#f59e0b' : '#ec4899'} />
                <text x="570" y="85" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  ฉ : {getPart('ฉ')?.lengthCm}
                </text>
              </g>

              {/* Part ข : Rear Vertical Leg Pipes (Dual vertical posts) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ข')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ข' ? null : 'ข')}
                filter={activeKey === 'ข' ? 'url(#glow4)' : undefined}
              >
                <line
                  x1="537" y1="136" x2="537" y2="250"
                  stroke={getPipeColor('ข', '#0284c7')}
                  strokeWidth={getPipeStrokeWidth('ข', 9)}
                  strokeLinecap="round"
                />
                <line
                  x1="607" y1="136" x2="607" y2="250"
                  stroke={getPipeColor('ข', '#0284c7')}
                  strokeWidth={getPipeStrokeWidth('ข', 9)}
                  strokeLinecap="round"
                />
                <line x1="530" y1="250" x2="614" y2="250" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

                <rect x="545" y="175" width="70" height="24" rx="5" fill={activeKey === 'ข' ? '#f59e0b' : '#0284c7'} />
                <text x="580" y="191" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ข : {getPart('ข')?.lengthCm} cm
                </text>
              </g>

              {/* Part ช : Front Vertical Caster Leg Pipes (Dual vertical posts to casters) */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ช')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ช' ? null : 'ช')}
                filter={activeKey === 'ช' ? 'url(#glow4)' : undefined}
              >
                <line
                  x1="162" y1="136" x2="162" y2="260"
                  stroke={getPipeColor('ช', '#10b981')}
                  strokeWidth={getPipeStrokeWidth('ช', 9)}
                  strokeLinecap="round"
                />
                <line
                  x1="232" y1="136" x2="232" y2="260"
                  stroke={getPipeColor('ช', '#10b981')}
                  strokeWidth={getPipeStrokeWidth('ช', 9)}
                  strokeLinecap="round"
                />
                {/* U-link at bottom connecting to caster */}
                <path d="M 162 260 Q 197 285 232 260" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

                <rect x="165" y="185" width="70" height="24" rx="5" fill={activeKey === 'ช' ? '#f59e0b' : '#10b981'} />
                <text x="200" y="201" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ช : {getPart('ช')?.lengthCm} cm
                </text>
              </g>

              {/* Part ง : Side Horizontal Main Beam */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('ง')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ง' ? null : 'ง')}
                filter={activeKey === 'ง' ? 'url(#glow4)' : undefined}
              >
                <line
                  x1="244" y1="123" x2="525" y2="123"
                  stroke={getPipeColor('ง', '#0ea5e9')}
                  strokeWidth={getPipeStrokeWidth('ง', 10)}
                  strokeLinecap="round"
                />
                <rect x="350" y="90" width="80" height="24" rx="5" fill={activeKey === 'ง' ? '#f59e0b' : '#0ea5e9'} />
                <text x="390" y="106" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ง : {getPart('ง')?.lengthCm} cm
                </text>
              </g>

              {/* Part จ : Front / Middle Chest Support Post */}
              <g
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredKey('จ')}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'จ' ? null : 'จ')}
                filter={activeKey === 'จ' ? 'url(#glow4)' : undefined}
              >
                <line
                  x1="96" y1="134" x2="96" y2="205"
                  stroke={getPipeColor('จ', '#0d9488')}
                  strokeWidth={getPipeStrokeWidth('จ', 9)}
                  strokeLinecap="round"
                />
                <rect x="65" y="155" width="65" height="24" rx="5" fill={activeKey === 'จ' ? '#f59e0b' : '#0d9488'} />
                <text x="97" y="171" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  จ : {getPart('จ')?.lengthCm} cm
                </text>
              </g>

              {/* Support Straps for 4-wheel */}
              <path
                d="M 100 205 Q 380 250 535 210"
                fill="none"
                stroke="#d97706"
                strokeWidth="3.5"
                strokeDasharray="5 3"
              />
              <text x="380" y="260" fill="#d97706" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                ชุดซับพอร์ตพยุงลำตัว 4 จุด (หน้า-อก-ท้อง-สะโพก)
              </text>
            </svg>
          )}

          {/* Hover / Click Instruction */}
          <div
            style={{
              marginTop: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Eye size={14} />
            <span>นำเมาส์ชี้หรือคลิกที่ชื่อชิ้นส่วนเพื่อไฮไลต์ตำแหน่งท่อจริงบนโครงสร้าง</span>
          </div>
        </div>
      )}

      {/* Part Quick Legend Buttons (ก - ช) */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {parts.map((p) => {
          const isSelected = activeKey === p.key;
          return (
            <button
              key={p.key}
              onClick={() => onSelectPart && onSelectPart(isSelected ? null : p.key)}
              onMouseEnter={() => setHoveredKey(p.key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                border: isSelected ? '2px solid var(--accent-500)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--primary-100)' : 'var(--bg-card)',
                color: isSelected ? 'var(--primary-900)' : 'var(--text-primary)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '5px',
                  background: isSelected ? 'var(--accent-500)' : 'var(--primary-600)',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {p.key}
              </span>
              <span>
                {p.lengthCm} ซม. ({p.count} ชิ้น)
              </span>
              {isSelected && <CheckCircle size={13} style={{ color: 'var(--accent-600)' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
