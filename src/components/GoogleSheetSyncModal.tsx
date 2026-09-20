import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Key,
} from 'lucide-react';
import {
  getAppsScriptUrl,
  setAppsScriptUrl,
  fetchCaseFromGoogleSheet,
  listRecentFromGoogleSheet,
} from '../utils/googleSheets';
import { AnimalMeasurements, WheelchairType, PipeSize } from '../types/wheelchair';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCaseFromSheet: (record: {
    measurements: AnimalMeasurements;
    wheelchairType: WheelchairType;
    pipeSize: PipeSize;
  }) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  onLoadCaseFromSheet,
}) => {
  const [scriptUrl, setScriptUrlInput] = useState('');
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<string | null>(null);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getAppsScriptUrl();
      setScriptUrlInput(current);
      if (current) {
        loadRecent();
      }
    }
  }, [isOpen]);

  const loadRecent = async () => {
    setIsLoadingRecent(true);
    try {
      const records = await listRecentFromGoogleSheet();
      setRecentRecords(records);
    } catch {
      // ignore
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const handleSaveUrl = () => {
    try {
      setAppsScriptUrl(scriptUrl);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      if (scriptUrl) {
        loadRecent();
      }
    } catch (err: any) {
      alert(err.message || 'รูปแบบ URL ไม่ถูกต้อง');
    }
  };

  const handleSearchAndLoad = async (idToSearch?: string) => {
    const id = idToSearch || searchId;
    if (!id.trim()) {
      setSearchError('กรุณากรอก Case ID');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchSuccess(null);

    try {
      const record = await fetchCaseFromGoogleSheet(id);
      
      // Determine pipe size from string
      let pipeSize: PipeSize = '3_hun';
      if (String(record.pipeSize).includes('4') || String(record.pipeSize).includes('1/2')) {
        pipeSize = '4_hun';
      } else if (String(record.pipeSize).includes('6') || String(record.pipeSize).includes('3/4')) {
        pipeSize = '6_hun';
      }

      const measurements: AnimalMeasurements = {
        caseId: record.caseId,
        staffName: record.staffName || '',
        petName: record.petName || '',
        ownerName: record.ownerName || '',
        animalType: record.animalType === 'cat' ? 'cat' : 'dog',
        weight: Number(record.weight) || 0,
        A: Number(record.A) || 0,
        B: Number(record.B) || 0,
        G: Number(record.G) || 0,
        H: Number(record.H) || 0,
        E: Number(record.E) || 0,
        D: Number(record.D) || 0,
        notes: record.notes || '',
      };

      const wheelchairType: WheelchairType =
        record.wheelchairType === '4_wheel' || String(record.wheelchairType).includes('4')
          ? '4_wheel'
          : '2_wheel';

      onLoadCaseFromSheet({
        measurements,
        wheelchairType,
        pipeSize,
      });

      setSearchSuccess(`โหลดข้อมูล Case ID "${record.caseId}" (${record.petName || 'ไม่มีชื่อ'}) สำเร็จแล้ว!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setSearchError(err.message || 'ไม่พบข้อมูล หรือเกิดข้อผิดพลาด');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 60,
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
          maxWidth: '780px',
          width: '100%',
          maxHeight: '88vh',
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
            background: '#0284c7',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
              เชื่อมต่อและค้นหาข้อมูล Google Sheet
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              ค้นหาและซิงค์เคสที่เคยคำนวณไว้ในฐานข้อมูลคลาวด์ของโครงการ
            </p>
          </div>
        </div>

        {/* Search by Case ID Box */}
        <div style={{
          background: 'var(--bg-card-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1.5px solid var(--primary-200)',
          marginBottom: '1.25rem'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Key size={16} style={{ color: 'var(--primary-600)' }} />
            <span>ค้นหาและดึงข้อมูลด้วย Case ID เพื่อแก้ไข</span>
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            กรอก Case ID (เช่น <code>CK-20260920-1234</code>) เพื่อดึงข้อมูลสัตว์เลี้ยง, ขนาดท่อ และสัดส่วนกลับมาใส่ในฟอร์มเพื่อปรับแก้และบันทึกทับได้
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="ระบุ Case ID เช่น CK-20260920-5678"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchAndLoad()}
              style={{ flex: 1, fontWeight: 600 }}
            />
            <button
              onClick={() => handleSearchAndLoad()}
              disabled={isSearching}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.25rem', minWidth: '110px' }}
            >
              {isSearching ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
              <span>{isSearching ? 'กำลังดึง...' : 'ค้นหา & ดึง'}</span>
            </button>
          </div>

          {searchError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.85rem', marginTop: '0.65rem' }}>
              <AlertCircle size={15} />
              <span>{searchError}</span>
            </div>
          )}

          {searchSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.85rem', marginTop: '0.65rem', fontWeight: 500 }}>
              <CheckCircle2 size={16} />
              <span>{searchSuccess}</span>
            </div>
          )}
        </div>

        {/* Recent Cases from Sheet */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>เคสล่าสุดใน Google Sheet</h4>
            <button
              onClick={loadRecent}
              disabled={isLoadingRecent}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
            >
              <RefreshCw size={12} className={isLoadingRecent ? 'animate-spin' : ''} />
              <span>รีเฟรช</span>
            </button>
          </div>

          {recentRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              {isLoadingRecent ? 'กำลังโหลดรายการ...' : 'ยังไม่พบรายการล่าสุด หรือยังไม่ได้ใส่ Web App URL'}
            </div>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentRecords.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>{r.caseId}</strong>
                      <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                        {r.petName || 'ไม่มีชื่อ'} ({r.animalType === 'dog' ? 'สุนัข' : 'แมว'} {r.weight} กก.)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Staff: {r.staffName || '-'} | วีลแชร์: {r.wheelchairType === '2_wheel' ? '2 ล้อ' : '4 ล้อ'} ({r.pipeSize}) | วันที่: {r.timestamp}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSearchAndLoad(r.caseId)}
                    className="btn btn-primary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                  >
                    โหลดมาแก้ไข
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Web App URL Configuration */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
          fontSize: '0.85rem'
        }}>
          <label className="form-label" style={{ fontWeight: 600 }}>
            Google Apps Script Web App URL (Endpoint):
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="url"
              className="input-field"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={scriptUrl}
              onChange={(e) => setScriptUrlInput(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
            <button
              onClick={handleSaveUrl}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              {saveSuccess ? 'บันทึกแล้ว!' : 'บันทึก URL'}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            (โค้ดสคริปต์อยู่ในไฟล์ <code>google_apps_script.js</code> นำไปวางใน Extensions &gt; Apps Script ของ Google Sheet แล้วกด Deploy เป็น Web App)
          </p>
        </div>

      </div>
    </div>
  );
};
