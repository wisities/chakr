import React, { useState } from 'react';
import { CalculationResult, PartKey } from '../types/wheelchair';
import { Layers, Eye } from 'lucide-react';

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
  const [hoveredKey, setHoveredKey] = useState<PartKey | null>(null);
  const { wheelchairType, parts, pipeConstants } = calculationResult;

  const activeKey = selectedPartKey || hoveredKey;

  const getPart = (k: PartKey) => parts.find((p) => p.key === k);

  const getStroke = (k: PartKey, defaultColor: string) => {
    if (activeKey === k) return '#f59e0b';
    return defaultColor;
  };

  const getStrokeWidth = (k: PartKey, defaultWidth: number) => {
    if (activeKey === k) return defaultWidth + 3;
    return defaultWidth;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Layers size={18} style={{ color: 'var(--primary-600)' }} />
          <span>โครงสร้างวีลแชร์ & ตำแหน่งชิ้นส่วน ก - {wheelchairType === '4_wheel' ? 'ช' : 'ฉ'}</span>
        </div>
        <span className="badge badge-primary">
          {wheelchairType === '2_wheel' ? 'แบบ 2 ล้อหลัง' : 'แบบ 4 ล้อ'} • {pipeConstants.sizeName}
        </span>
      </div>

      {/* SVG Diagram Canvas */}
      <div style={{
        background: 'var(--bg-card-hover)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {wheelchairType === '2_wheel' ? (
          /* 2-Wheel Diagram */
          <svg viewBox="0 0 640 340" style={{ width: '100%', maxHeight: '300px', display: 'block' }}>
            <defs>
              <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Ground Line */}
            <line x1="30" y1="280" x2="610" y2="280" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 4" />
            <text x="40" y="300" fill="var(--text-muted)" fontSize="11">ระดับพื้น (Ground)</text>

            {/* Rear Wheel */}
            <g>
              {/* Wheel Outer */}
              <circle cx="480" cy="235" r="45" fill="none" stroke="#475569" strokeWidth="12" />
              <circle cx="480" cy="235" r="39" fill="rgba(15, 23, 42, 0.08)" />
              {/* Wheel Spokes */}
              <line x1="480" y1="195" x2="480" y2="275" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="440" y1="235" x2="520" y2="235" stroke="#94a3b8" strokeWidth="2.5" />
              <circle cx="480" cy="235" r="7" fill="#0f172a" />
              <text x="480" y="300" fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontWeight="bold">
                ล้อหลัง R = {pipeConstants.rearWheelRadius} ซม.
              </text>
            </g>

            {/* Part ข : Vertical Leg to Wheel (เสาแนวตั้งล้อหลัง) */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ข')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ข' ? null : 'ข')}
            >
              <line
                x1="480" y1="120" x2="480" y2="215"
                stroke={getStroke('ข', '#0284c7')}
                strokeWidth={getStrokeWidth('ข', 8)}
                strokeLinecap="round"
              />
              <rect x="495" y="155" width="60" height="24" rx="5" fill={activeKey === 'ข' ? '#f59e0b' : '#0284c7'} />
              <text x="525" y="171" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ข : {getPart('ข')?.lengthCm} cm
              </text>
            </g>

            {/* Part ค : Axle connector tube (ท่อต่อแกนล้อ/ข้อต่อ) */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ค')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ค' ? null : 'ค')}
            >
              <line
                x1="455" y1="215" x2="505" y2="215"
                stroke={getStroke('ค', '#0369a1')}
                strokeWidth={getStrokeWidth('ค', 7)}
                strokeLinecap="round"
              />
              <rect x="515" y="210" width="55" height="22" rx="4" fill={activeKey === 'ค' ? '#f59e0b' : '#0369a1'} />
              <text x="542" y="225" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ค : {getPart('ค')?.lengthCm} cm
              </text>
            </g>

            {/* Part ง : Side Horizontal Main Beam (คานแนวนอนขนานลำตัว) */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ง')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ง' ? null : 'ง')}
            >
              <line
                x1="220" y1="120" x2="480" y2="120"
                stroke={getStroke('ง', '#0ea5e9')}
                strokeWidth={getStrokeWidth('ง', 8)}
                strokeLinecap="round"
              />
              <rect x="320" y="90" width="80" height="24" rx="5" fill={activeKey === 'ง' ? '#f59e0b' : '#0ea5e9'} />
              <text x="360" y="106" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ง : {getPart('ง')?.lengthCm} cm
              </text>
            </g>

            {/* Part จ : Front Chest Vertical Pillar (เสาปรับระดับคานหน้าอก) */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('จ')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'จ' ? null : 'จ')}
            >
              <line
                x1="220" y1="120" x2="220" y2="185"
                stroke={getStroke('จ', '#0d9488')}
                strokeWidth={getStrokeWidth('จ', 8)}
                strokeLinecap="round"
              />
              <rect x="145" y="140" width="65" height="24" rx="5" fill={activeKey === 'จ' ? '#f59e0b' : '#0d9488'} />
              <text x="177" y="156" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                จ : {getPart('จ')?.lengthCm} cm
              </text>
            </g>

            {/* Part ก : Crossbar (คานขวางด้านบน/อก/หลัง - 3D isometric representation) */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ก')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ก' ? null : 'ก')}
            >
              <line
                x1="220" y1="185" x2="260" y2="175"
                stroke={getStroke('ก', '#8b5cf6')}
                strokeWidth={getStrokeWidth('ก', 7)}
                strokeLinecap="round"
              />
              <rect x="230" y="200" width="65" height="24" rx="5" fill={activeKey === 'ก' ? '#f59e0b' : '#8b5cf6'} />
              <text x="262" y="216" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ก : {getPart('ก')?.lengthCm} cm
              </text>
            </g>

            {/* Part ฉ : Extension/Connector (คานเสริม/ตัวต่อหลัง) */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ฉ')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ฉ' ? null : 'ฉ')}
            >
              <line
                x1="480" y1="120" x2="540" y2="120"
                stroke={getStroke('ฉ', '#ec4899')}
                strokeWidth={getStrokeWidth('ฉ', 8)}
                strokeLinecap="round"
              />
              <rect x="520" y="85" width="60" height="24" rx="5" fill={activeKey === 'ฉ' ? '#f59e0b' : '#ec4899'} />
              <text x="550" y="101" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ฉ : {getPart('ฉ')?.lengthCm} cm
              </text>
            </g>

            {/* Front Support Harness (Harness Sling) */}
            <path
              d="M 220 185 Q 260 215 310 185"
              fill="none"
              stroke="#d97706"
              strokeWidth="4"
              strokeDasharray="4 3"
            />
            <text x="270" y="240" fill="#d97706" fontSize="11" fontWeight="500">สายรัดอก & พยุงตัว</text>
          </svg>
        ) : (
          /* 4-Wheel Diagram */
          <svg viewBox="0 0 640 340" style={{ width: '100%', maxHeight: '300px', display: 'block' }}>
            {/* Ground Line */}
            <line x1="30" y1="280" x2="610" y2="280" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 4" />
            <text x="40" y="300" fill="var(--text-muted)" fontSize="11">ระดับพื้น (Ground)</text>

            {/* Rear Wheel */}
            <g>
              <circle cx="490" cy="235" r="45" fill="none" stroke="#475569" strokeWidth="12" />
              <circle cx="490" cy="235" r="39" fill="rgba(15, 23, 42, 0.08)" />
              <line x1="490" y1="195" x2="490" y2="275" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="450" y1="235" x2="530" y2="235" stroke="#94a3b8" strokeWidth="2.5" />
              <circle cx="490" cy="235" r="7" fill="#0f172a" />
              <text x="490" y="300" fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontWeight="bold">
                ล้อหลัง R = {pipeConstants.rearWheelRadius} cm
              </text>
            </g>

            {/* Front Caster Wheel */}
            <g>
              <circle cx="160" cy="255" r="25" fill="none" stroke="#475569" strokeWidth="8" />
              <circle cx="160" cy="255" r="20" fill="rgba(15, 23, 42, 0.08)" />
              <circle cx="160" cy="255" r="5" fill="#0f172a" />
              <text x="160" y="300" fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontWeight="bold">
                ล้อหน้า H = {pipeConstants.frontWheelHeight} cm
              </text>
            </g>

            {/* Part ข : Rear Vertical Leg */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ข')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ข' ? null : 'ข')}
            >
              <line
                x1="490" y1="120" x2="490" y2="215"
                stroke={getStroke('ข', '#0284c7')}
                strokeWidth={getStrokeWidth('ข', 8)}
                strokeLinecap="round"
              />
              <rect x="505" y="155" width="60" height="24" rx="5" fill={activeKey === 'ข' ? '#f59e0b' : '#0284c7'} />
              <text x="535" y="171" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ข : {getPart('ข')?.lengthCm} cm
              </text>
            </g>

            {/* Part ช : Front Vertical Leg (เสาแนวตั้งล้อหน้า) */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ช')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ช' ? null : 'ช')}
            >
              <line
                x1="160" y1="120" x2="160" y2="230"
                stroke={getStroke('ช', '#10b981')}
                strokeWidth={getStrokeWidth('ช', 8)}
                strokeLinecap="round"
              />
              <rect x="85" y="170" width="65" height="24" rx="5" fill={activeKey === 'ช' ? '#f59e0b' : '#10b981'} />
              <text x="117" y="186" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ช : {getPart('ช')?.lengthCm} cm
              </text>
            </g>

            {/* Part ง : Side Horizontal Main Beam */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ง')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ง' ? null : 'ง')}
            >
              <line
                x1="160" y1="120" x2="490" y2="120"
                stroke={getStroke('ง', '#0ea5e9')}
                strokeWidth={getStrokeWidth('ง', 8)}
                strokeLinecap="round"
              />
              <rect x="300" y="85" width="80" height="24" rx="5" fill={activeKey === 'ง' ? '#f59e0b' : '#0ea5e9'} />
              <text x="340" y="101" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ง : {getPart('ง')?.lengthCm} cm
              </text>
            </g>

            {/* Part ค : Axle / Joint Connector */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ค')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ค' ? null : 'ค')}
            >
              <line
                x1="465" y1="215" x2="515" y2="215"
                stroke={getStroke('ค', '#0369a1')}
                strokeWidth={getStrokeWidth('ค', 7)}
                strokeLinecap="round"
              />
              <rect x="525" y="210" width="55" height="22" rx="4" fill={activeKey === 'ค' ? '#f59e0b' : '#0369a1'} />
              <text x="552" y="225" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ค : {getPart('ค')?.lengthCm} cm
              </text>
            </g>

            {/* Part จ : Middle Support Pillar */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('จ')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'จ' ? null : 'จ')}
            >
              <line
                x1="280" y1="120" x2="280" y2="185"
                stroke={getStroke('จ', '#0d9488')}
                strokeWidth={getStrokeWidth('จ', 8)}
                strokeLinecap="round"
              />
              <rect x="210" y="145" width="65" height="24" rx="5" fill={activeKey === 'จ' ? '#f59e0b' : '#0d9488'} />
              <text x="242" y="161" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                จ : {getPart('จ')?.lengthCm} cm
              </text>
            </g>

            {/* Part ก : Crossbar */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ก')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ก' ? null : 'ก')}
            >
              <line
                x1="280" y1="185" x2="320" y2="175"
                stroke={getStroke('ก', '#8b5cf6')}
                strokeWidth={getStrokeWidth('ก', 7)}
                strokeLinecap="round"
              />
              <rect x="290" y="200" width="65" height="24" rx="5" fill={activeKey === 'ก' ? '#f59e0b' : '#8b5cf6'} />
              <text x="322" y="216" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ก : {getPart('ก')?.lengthCm} cm
              </text>
            </g>

            {/* Part ฉ : Body Extension */}
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredKey('ฉ')}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => onSelectPart && onSelectPart(selectedPartKey === 'ฉ' ? null : 'ฉ')}
            >
              <line
                x1="490" y1="120" x2="550" y2="120"
                stroke={getStroke('ฉ', '#ec4899')}
                strokeWidth={getStrokeWidth('ฉ', 8)}
                strokeLinecap="round"
              />
              <rect x="530" y="85" width="60" height="24" rx="5" fill={activeKey === 'ฉ' ? '#f59e0b' : '#ec4899'} />
              <text x="560" y="101" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                ฉ : {getPart('ฉ')?.lengthCm} cm
              </text>
            </g>
          </svg>
        )}

        {/* Hover / Click Instruction */}
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <Eye size={14} />
          <span>นำเมาส์ชี้หรือคลิกที่ชื่อชิ้นส่วนเพื่อไฮไลต์ตำแหน่งบนโครงสร้าง</span>
        </div>
      </div>

      {/* Part Quick Legend */}
      <div style={{
        marginTop: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
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
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: isSelected ? 'var(--accent-500)' : 'var(--primary-600)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>
                {p.key}
              </span>
              <span>{p.lengthCm} ซม. ({p.count} ชิ้น)</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
