import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
  HeartHandshake,
  ShieldCheck,
  Settings,
  AlertCircle,
  HelpCircle,
  Sun,
  Moon,
  LogIn,
} from 'lucide-react';
import {
  UserProfile,
  decodeJwt,
  getStoredGoogleClientId,
  setStoredGoogleClientId,
} from '../utils/auth';

interface LoginScreenProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  clientId: string;
  onUpdateClientId: (newId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  darkMode,
  onToggleTheme,
  onLoginSuccess,
  clientId,
  onUpdateClientId,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(clientId || getStoredGoogleClientId());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual guest login for testing/development if needed
  const [manualName, setManualName] = useState('');
  const [showManualLogin, setShowManualLogin] = useState(false);

  const handleSaveClientId = () => {
    const trimmed = clientIdInput.trim();
    if (!trimmed) {
      setErrorMessage('กรุณาระบุ Google Client ID');
      return;
    }
    setStoredGoogleClientId(trimmed);
    onUpdateClientId(trimmed);
    setShowConfig(false);
    setErrorMessage(null);
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('ไม่พบข้อมูล Token จาก Google');
      }
      const decoded = decodeJwt(credentialResponse.credential);
      if (!decoded || !decoded.name) {
        throw new Error('ไม่สามารถถอดรหัสข้อมูลชื่อจาก Google Token ได้');
      }

      const profile: UserProfile = {
        name: decoded.name,
        email: decoded.email || '',
        picture: decoded.picture,
        sub: decoded.sub || '',
      };

      onLoginSuccess(profile);
    } catch (err: any) {
      setErrorMessage(err.message || 'การเข้าสู่ระบบผ่าน Google ไม่สำเร็จ');
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) {
      setErrorMessage('กรุณาระบุชื่อผู้ใช้งาน');
      return;
    }
    const profile: UserProfile = {
      name: manualName.trim(),
      email: 'manual-user@chakr.org',
      sub: `manual-${Date.now()}`,
    };
    onLoginSuccess(profile);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: darkMode
          ? 'radial-gradient(ellipse at top, #1e293b, #0f172a)'
          : 'radial-gradient(ellipse at top, #f0f9ff, #e2e8f0)',
        position: 'relative',
      }}
    >
      {/* Theme Toggle at top right */}
      <button
        onClick={onToggleTheme}
        className="btn btn-secondary"
        title={darkMode ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          padding: '0.5rem',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
        }}
      >
        {darkMode ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
      </button>

      <div
        className="card animate-fade-in"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '2.25rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Brand Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 16px rgba(2, 132, 199, 0.35)',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <HeartHandshake size={36} />
        </div>

        {/* Titles */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.4rem 0' }}>
          เข้าสู่ระบบเพื่อใช้งานระบบ
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem 0' }}>
          โครงการเพราะมีน้ำใจจึงมีชีวิต • มูลนิธิ ศ.ดร.จักร พิชัยรณรงค์สงคราม
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1.5rem 0' }}>
          ระบบคำนวณและควบคุมคุณภาพการตัดประกอบวีลแชร์ PVC สัตว์พิการ
        </p>

        {/* Security Notice */}
        <div
          style={{
            background: 'var(--bg-card-hover)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            marginBottom: '1.75rem',
            fontSize: '0.825rem',
          }}
        >
          <ShieldCheck size={20} style={{ color: 'var(--primary-600)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>ระบบบันทึกชื่อผู้ปฏิบัติงาน:</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              กรุณาเข้าสู่ระบบด้วยบัญชี Google เพื่อใช้ชื่อและอีเมลของคุณในการระบุตัวตนบนใบงานตัดท่อและบันทึกประวัติลง Google Sheet อัตโนมัติ
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              color: '#dc2626',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Login Button or Config Requirement */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {clientId ? (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setErrorMessage('Google Login ไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Authorized JavaScript origins ใน Google Cloud Console');
                }}
                useOneTap
                theme={darkMode ? 'filled_black' : 'outline'}
                shape="rectangular"
                text="signin_with"
              />
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(234, 88, 12, 0.08)',
                border: '1px solid rgba(234, 88, 12, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                width: '100%',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ fontWeight: 600, color: '#c2410c', marginBottom: '0.35rem' }}>
                ⚠️ ยังไม่ได้กำหนด Google Client ID
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', fontSize: '0.8rem' }}>
                เพื่อเปิดใช้งานการล็อกอินด้วย Google กรุณากรอก Google Client ID ที่ได้จาก Google Cloud Console ด้านล่าง
              </p>
              <button
                type="button"
                onClick={() => setShowConfig(true)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
              >
                <Settings size={15} />
                <span>ตั้งค่า Google Client ID</span>
              </button>
            </div>
          )}
        </div>

        {/* Collapsible Client ID Settings */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: 0,
              }}
            >
              <Settings size={13} />
              <span>{showConfig ? 'ซ่อนการตั้งค่า Client ID' : 'เปลี่ยน/แก้ไข Google Client ID'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowManualLogin(!showManualLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {showManualLogin ? 'ซ่อนโหมดทดสอบ' : 'โหมดทดสอบ (Offline / Dev)'}
            </button>
          </div>

          {showConfig && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.85rem',
                background: 'var(--bg-card-hover)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
              }}
            >
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Google OAuth Client ID:
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="xxxx.apps.googleusercontent.com"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleSaveClientId}
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  บันทึก Client ID
                </button>
              </div>
              <div
                style={{
                  fontSize: '0.73rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.35rem',
                }}
              >
                <HelpCircle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  สร้างได้ที่ Google Cloud Console &gt; Credentials &gt; OAuth 2.0 Client ID (Web Application)
                </span>
              </div>
            </div>
          )}

          {showManualLogin && (
            <form
              onSubmit={handleManualLogin}
              style={{
                marginTop: '0.75rem',
                padding: '0.85rem',
                background: 'var(--bg-card-hover)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <strong>โหมดระบุชื่อโดยตรง:</strong> สำหรับทดสอบระบบหรือในกรณีที่ยังไม่มี Google Client ID
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="ระบุชื่อ-นามสกุล ผู้ปฏิบัติงาน"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                style={{ fontSize: '0.825rem', marginBottom: '0.5rem' }}
              />
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.45rem', fontSize: '0.825rem' }}
              >
                <LogIn size={14} />
                <span>เข้าใช้งานด้วยชื่อนี้</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
