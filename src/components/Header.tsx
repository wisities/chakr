import React from 'react';
import {
  Moon,
  Sun,
  Printer,
  Bookmark,
  HelpCircle,
  HeartHandshake,
  Sparkles,
  Database,
  CloudUpload,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  isSavingSheet: boolean;
  onToggleTheme: () => void;
  onOpenGuide: () => void;
  onOpenSavedCases: () => void;
  onOpenGoogleSheetSync: () => void;
  onSaveToGoogleSheet: () => void;
  onPrint: () => void;
  onLoadPreset: (preset: 'small_cat' | 'small_dog' | 'medium_dog' | 'large_dog') => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  isSavingSheet,
  onToggleTheme,
  onOpenGuide,
  onOpenSavedCases,
  onOpenGoogleSheetSync,
  onSaveToGoogleSheet,
  onPrint,
  onLoadPreset,
}) => {
  return (
    <header className="no-print" style={{
      background: darkMode ? 'rgba(19, 28, 49, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '0.85rem 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Foundation & Project Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.35)'
          }}>
            <HeartHandshake size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
                ระบบคำนวณและ QC วีลแชร์สัตว์พิการ
              </h1>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                PVC Pipe Wheelchair
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              โครงการเพราะมีน้ำใจจึงมีชีวิต (Wheelchair for Pets) • มูลนิธิ ศ.ดร.จักร พิชัยรณรงค์สงคราม
            </p>
          </div>
        </div>

        {/* Quick Actions & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Preset Selector */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-card-hover)', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-500)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ตัวอย่างสัดส่วน:</span>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onLoadPreset(e.target.value as any);
                  e.target.value = '';
                }
              }}
              style={{
                fontSize: '0.78rem',
                padding: '0.15rem 0.35rem',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>-- เลือกเคสตัวอย่าง --</option>
              <option value="small_cat">แมวตัวเล็ก (3 กก. - 3 หุน)</option>
              <option value="small_dog">สุนัขพันธุ์เล็ก (4.5 กก. - 3 หุน)</option>
              <option value="medium_dog">สุนัขพันธุ์กลาง (8.5 กก. - 4 หุน)</option>
              <option value="large_dog">สุนัขพันธุ์ใหญ่ (16 กก. - 6 หุน)</option>
            </select>
          </div>

          {/* Save to Google Sheet Button */}
          <button
            onClick={onSaveToGoogleSheet}
            disabled={isSavingSheet}
            className="btn btn-success"
            title="บันทึกข้อมูลการคำนวณลง Google Sheet ของโครงการ"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          >
            {isSavingSheet ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <CloudUpload size={16} />
            )}
            <span>{isSavingSheet ? 'กำลังบันทึก...' : 'บันทึกลง Google Sheet'}</span>
          </button>

          {/* Search/Sync Google Sheet */}
          <button
            onClick={onOpenGoogleSheetSync}
            className="btn btn-secondary"
            title="ค้นหา/ดึงข้อมูล Case ID จาก Google Sheet หรือตั้งค่า URL"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <Database size={16} style={{ color: 'var(--primary-600)' }} />
            <span>ค้นหา Case ID</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="btn btn-secondary"
            title="คู่มือและวิธีวัดขนาดตัวสัตว์"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <HelpCircle size={16} />
            <span>วิธีวัดตัว</span>
          </button>

          <button
            onClick={onOpenSavedCases}
            className="btn btn-secondary"
            title="เคสที่บันทึกไว้ในเครื่อง"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <Bookmark size={16} />
            <span>เคสในเครื่อง</span>
          </button>

          <button
            onClick={onPrint}
            className="btn btn-primary"
            title="พิมพ์ใบงานตัดท่อและใบ QC สำหรับช่าง"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          >
            <Printer size={16} />
            <span>พิมพ์ใบงาน (A4)</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            title={darkMode ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
            style={{ padding: '0.5rem', width: '36px', height: '36px' }}
          >
            {darkMode ? <Sun size={17} style={{ color: '#f59e0b' }} /> : <Moon size={17} />}
          </button>

        </div>
      </div>
    </header>
  );
};
