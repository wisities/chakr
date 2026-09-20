import React, { useRef } from 'react';
import { SavedCase } from '../types/wheelchair';
import { X, Trash2, Download, Upload, FolderOpen, Plus, Calendar, Dog, Cat } from 'lucide-react';

interface SavedCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCases: SavedCase[];
  onLoadCase: (c: SavedCase) => void;
  onSaveCurrentCase: () => void;
  onDeleteCase: (id: string) => void;
  onImportCases: (imported: SavedCase[]) => void;
}

export const SavedCasesModal: React.FC<SavedCasesModalProps> = ({
  isOpen,
  onClose,
  savedCases,
  onLoadCase,
  onSaveCurrentCase,
  onDeleteCase,
  onImportCases,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedCases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chakr_wheelchair_cases_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportCases(parsed);
        } else if (parsed && parsed.id) {
          onImportCases([parsed]);
        }
      } catch (err) {
        alert('ไฟล์ JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        className="card animate-fade-in modal-card-mobile"
        style={{
          maxWidth: '720px',
          width: '100%',
          maxHeight: '85vh',
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
            <FolderOpen size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>ประวัติและบันทึกเคสสัตว์เลี้ยง</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              บันทึกเก็บไว้ในเบราว์เซอร์เพื่อเปิดดูย้อนหลัง หรือสำรองข้อมูลเป็นไฟล์ JSON
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <button
            onClick={onSaveCurrentCase}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
          >
            <Plus size={16} />
            <span>บันทึกเคสปัจจุบัน</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={exportJSON}
              disabled={savedCases.length === 0}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem', opacity: savedCases.length === 0 ? 0.5 : 1 }}
            >
              <Download size={15} />
              <span>ส่งออก JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
            >
              <Upload size={15} />
              <span>นำเข้า JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Cases List */}
        {savedCases.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            color: 'var(--text-muted)'
          }}>
            <FolderOpen size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
            <p style={{ fontSize: '0.95rem', margin: 0 }}>ยังไม่มีเคสที่บันทึกไว้</p>
            <p style={{ fontSize: '0.8rem' }}>กรอกสัดส่วนแล้วกดปุ่ม "บันทึกเคสปัจจุบัน" ด้านบนได้เลย</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {savedCases.map((c) => (
              <div
                key={c.id}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card-hover)',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    {c.measurements.animalType === 'dog' ? <Dog size={16} style={{ color: 'var(--primary-600)' }} /> : <Cat size={16} style={{ color: 'var(--accent-500)' }} />}
                    <strong style={{ fontSize: '0.95rem' }}>{c.measurements.petName || 'ไม่ระบุชื่อ'}</strong>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      {c.wheelchairType === '2_wheel' ? '2 ล้อ' : '4 ล้อ'} • {c.calculationResult?.pipeConstants?.sizeName || 'ท่อ PVC'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    ผู้ดูแล: {c.measurements.ownerName || '-'} | นน. {c.measurements.weight || 0} กก. | สัดส่วน: A={c.measurements.A}, B={c.measurements.B}, G={c.measurements.G}, E={c.measurements.E}, D={c.measurements.D}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <Calendar size={12} />
                    <span>บันทึกเมื่อ: {new Date(c.createdAt).toLocaleString('th-TH')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      onLoadCase(c);
                      onClose();
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  >
                    โหลดเคสนี้
                  </button>
                  <button
                    onClick={() => onDeleteCase(c.id)}
                    className="btn btn-secondary"
                    title="ลบเคสนี้"
                    style={{ padding: '0.35rem', color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
