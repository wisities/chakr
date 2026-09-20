import React from 'react';
import {
  Moon,
  Sun,
  Printer,
  Bookmark,
  HeartHandshake,
  Database,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';
import { UserProfile } from '../utils/auth';

interface HeaderProps {
  darkMode: boolean;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onToggleTheme: () => void;
  onOpenSavedCases: () => void;
  onOpenGoogleSheetSync: () => void;
  onPrint: () => void;
  onLoadPreset: (preset: 'small_cat' | 'small_dog' | 'medium_dog' | 'large_dog') => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  userProfile,
  onLogout,
  onToggleTheme,
  onOpenSavedCases,
  onOpenGoogleSheetSync,
  onPrint,
  onLoadPreset,
}) => {
  return (
    <header className="no-print" style={{
      background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '0.65rem 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
        
        {/* Brand & Project Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 3px 8px rgba(2, 132, 199, 0.35)',
            flexShrink: 0
          }}>
            <HeartHandshake size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
                ระบบคำนวณและ QC วีลแชร์สัตว์พิการ
              </h1>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                PVC Pipes
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              โครงการเพราะมีน้ำใจจึงมีชีวิต • มูลนิธิ ศ.ดร.จักร พิชัยรณรงค์สงคราม
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          
          {/* Preset Selector */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'var(--bg-card-hover)',
            padding: '0.2rem 0.45rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <Sparkles size={13} style={{ color: 'var(--accent-500)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ตัวอย่าง:</span>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onLoadPreset(e.target.value as any);
                  e.target.value = '';
                }
              }}
              style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.3rem',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>-- เลือกขนาด --</option>
              <option value="small_cat">แมว (3 กก. - 3 หุน)</option>
              <option value="small_dog">สุนัขเล็ก (4.5 กก. - 3 หุน)</option>
              <option value="medium_dog">สุนัขกลาง (8.5 กก. - 4 หุน)</option>
              <option value="large_dog">สุนัขใหญ่ (18 กก. - 6 หุน)</option>
            </select>
          </div>

          {/* Search/Sync Google Sheet */}
          <button
            onClick={onOpenGoogleSheetSync}
            className="btn btn-secondary"
            title="ค้นหา/ดึง Case ID จาก Google Sheet"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            <Database size={14} style={{ color: 'var(--primary-600)' }} />
            <span>ค้นหา Case ID</span>
          </button>

          <button
            onClick={onOpenSavedCases}
            className="btn btn-secondary"
            title="เคสที่บันทึกไว้ในเครื่อง"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            <Bookmark size={14} />
            <span>เคสที่เซฟ</span>
          </button>

          <button
            onClick={onPrint}
            className="btn btn-primary"
            title="พิมพ์ใบงานตัดท่อและใบ QC สำหรับช่าง"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Printer size={14} />
            <span>พิมพ์ใบงาน (A4)</span>
          </button>

          {userProfile && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--bg-card-hover)',
                padding: '0.2rem 0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem',
              }}
            >
              {userProfile.picture ? (
                <img
                  src={userProfile.picture}
                  alt={userProfile.name}
                  style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                />
              ) : (
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--primary-600)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  <User size={12} />
                </div>
              )}
              <span style={{ fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={userProfile.name}>
                {userProfile.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-secondary"
                title="ออกจากระบบ Google"
                style={{ padding: '0.2rem 0.35rem', fontSize: '0.72rem', border: 'none', background: 'transparent' }}
              >
                <LogOut size={13} style={{ color: '#ef4444' }} />
              </button>
            </div>
          )}

          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            title={darkMode ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
            style={{ padding: '0.4rem', width: '32px', height: '32px' }}
          >
            {darkMode ? <Sun size={15} style={{ color: '#f59e0b' }} /> : <Moon size={15} />}
          </button>

        </div>
      </div>
    </header>
  );
};
