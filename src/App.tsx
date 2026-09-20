import { useState, useEffect, useMemo } from 'react';
import {
  AnimalMeasurements,
  PartKey,
  PipeSize,
  SavedCase,
  WheelchairType,
} from './types/wheelchair';
import { calculateFullWheelchair } from './utils/calculations';
import {
  buildGoogleSheetPayload,
  generateCaseId,
  saveToGoogleSheet,
} from './utils/googleSheets';
import { Header } from './components/Header';
import { AnimalForm } from './components/AnimalForm';
import { WheelchairDiagram } from './components/WheelchairDiagram';
import { CutResultsTable } from './components/CutResultsTable';
import { MaterialsSummary } from './components/MaterialsSummary';
import { QCChecklist } from './components/QCChecklist';
import { MeasurementGuideModal } from './components/MeasurementGuideModal';
import { SavedCasesModal } from './components/SavedCasesModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { PrintCutSheet } from './components/PrintCutSheet';
import { Heart, Sparkles } from 'lucide-react';

const INITIAL_MEASUREMENTS: AnimalMeasurements = {
  caseId: 'CK-2026-0001',
  staffName: 'ช่างวิชัย (มูลนิธิฯ)',
  petName: 'น้องโชคดี (ตัวอย่าง)',
  ownerName: 'คุณอารีย์ (081-234-5678)',
  animalType: 'dog',
  weight: 4.5,
  A: 28, // ความสูงจากพื้นถึงหลังสะโพก
  B: 16, // ความสูงจากพื้นถึงท้อง
  G: 14, // ความกว้างลำตัว
  H: 35, // ความยาวรอบอก
  E: 24, // ความยาวจากหลังขาหน้าถึงกลางสะโพก
  D: 10, // ความสูงจากพื้นถึงหน้าอก
  notes: 'ขาหลังสองข้างอ่อนแรง ร่าเริง ทานอาหารได้ปกติ',
};

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('chakr_theme') === 'dark';
  });

  const [measurements, setMeasurements] = useState<AnimalMeasurements>(INITIAL_MEASUREMENTS);
  const [wheelchairType, setWheelchairType] = useState<WheelchairType>('2_wheel');
  const [pipeSize, setPipeSize] = useState<PipeSize>('3_hun');
  const [isManualPipeSize, setIsManualPipeSize] = useState<boolean>(false);
  const [selectedPartKey, setSelectedPartKey] = useState<PartKey | null>(null);
  const [qcMeasuredValues, setQcMeasuredValues] = useState<Record<string, number>>({});

  const [savedCases, setSavedCases] = useState<SavedCase[]>(() => {
    try {
      const stored = localStorage.getItem('chakr_saved_cases');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSavedCasesOpen, setIsSavedCasesOpen] = useState<boolean>(false);
  const [isGoogleSheetSyncOpen, setIsGoogleSheetSyncOpen] = useState<boolean>(false);
  const [isSavingSheet, setIsSavingSheet] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('chakr_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('chakr_theme', 'light');
    }
  }, [darkMode]);

  // Sync saved cases to localStorage
  useEffect(() => {
    localStorage.setItem('chakr_saved_cases', JSON.stringify(savedCases));
  }, [savedCases]);

  // Real-time calculation
  const calculationResult = useMemo(() => {
    return calculateFullWheelchair(measurements, wheelchairType, pipeSize);
  }, [measurements, wheelchairType, pipeSize]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateMeasurements = (updated: Partial<AnimalMeasurements>) => {
    setMeasurements((prev) => ({ ...prev, ...updated }));
  };

  const handleChangePipeSize = (size: PipeSize, manual: boolean) => {
    setPipeSize(size);
    setIsManualPipeSize(manual);
  };

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      const newId = generateCaseId();
      setMeasurements({
        caseId: newId,
        staffName: '',
        petName: '',
        ownerName: '',
        animalType: 'dog',
        weight: 0,
        A: 0,
        B: 0,
        G: 0,
        H: 0,
        E: 0,
        D: 0,
        notes: '',
      });
      setWheelchairType('2_wheel');
      setPipeSize('3_hun');
      setIsManualPipeSize(false);
      setQcMeasuredValues({});
      setSelectedPartKey(null);
      showToast('รีเซ็ตข้อมูลเรียบร้อย (สร้าง Case ID ใหม่)');
    }
  };

  const handleLoadPreset = (preset: 'small_cat' | 'small_dog' | 'medium_dog' | 'large_dog') => {
    const cid = generateCaseId();
    if (preset === 'small_cat') {
      setMeasurements({
        caseId: cid,
        staffName: 'ทีมงานคลินิก',
        petName: 'น้องส้ม (แมวไทย)',
        ownerName: 'คุณปิยะ',
        animalType: 'cat',
        weight: 3.2,
        A: 24,
        B: 12,
        G: 11,
        H: 28,
        E: 20,
        D: 8,
      });
      setWheelchairType('2_wheel');
      setPipeSize('3_hun');
      setIsManualPipeSize(false);
    } else if (preset === 'small_dog') {
      setMeasurements({
        caseId: cid,
        staffName: 'ทีมงานมูลนิธิฯ',
        petName: 'น้องปอมปอม (ปอมเมอเรเนียน)',
        ownerName: 'คุณกิตติ',
        animalType: 'dog',
        weight: 4.5,
        A: 28,
        B: 16,
        G: 14,
        H: 34,
        E: 24,
        D: 10,
      });
      setWheelchairType('2_wheel');
      setPipeSize('3_hun');
      setIsManualPipeSize(false);
    } else if (preset === 'medium_dog') {
      setMeasurements({
        caseId: cid,
        staffName: 'ทีมงานสัตวแพทย์',
        petName: 'น้องบราวนี่ (คอร์กี้)',
        ownerName: 'คุณวิภา',
        animalType: 'dog',
        weight: 8.5,
        A: 36,
        B: 18,
        G: 19,
        H: 48,
        E: 32,
        D: 14,
      });
      setWheelchairType('2_wheel');
      setPipeSize('4_hun');
      setIsManualPipeSize(false);
    } else if (preset === 'large_dog') {
      setMeasurements({
        caseId: cid,
        staffName: 'ทีมช่างอาสา',
        petName: 'เจ้าทองเอก (โกลเด้นฯ)',
        ownerName: 'คุณสุชาติ',
        animalType: 'dog',
        weight: 18.0,
        A: 52,
        B: 26,
        G: 25,
        H: 65,
        E: 45,
        D: 22,
      });
      setWheelchairType('4_wheel');
      setPipeSize('6_hun');
      setIsManualPipeSize(false);
    }
    setQcMeasuredValues({});
    showToast('โหลดสัดส่วนตัวอย่างเรียบร้อย');
  };

  const handleSaveToGoogleSheet = async () => {
    let currentCaseId = measurements.caseId;
    if (!currentCaseId) {
      currentCaseId = generateCaseId();
      handleUpdateMeasurements({ caseId: currentCaseId });
    }

    const payload = buildGoogleSheetPayload(
      { ...measurements, caseId: currentCaseId },
      wheelchairType,
      pipeSize,
      calculationResult
    );

    setIsSavingSheet(true);
    try {
      const res = await saveToGoogleSheet(payload);
      showToast(`✅ ${res.message} (Case ID: ${res.caseId})`);
      
      // Also save to local storage as synced
      const localCase: SavedCase = {
        id: res.caseId,
        createdAt: new Date().toISOString(),
        measurements: { ...measurements, caseId: res.caseId },
        wheelchairType,
        pipeSize,
        calculationResult,
        qcResults: { ...qcMeasuredValues },
        syncedToGoogleSheet: true,
      };
      setSavedCases((prev) => [localCase, ...prev.filter((c) => c.id !== res.caseId)]);
    } catch (err: any) {
      // If Web App URL is not set yet, open the modal automatically
      if (err.message && err.message.includes('Web App URL')) {
        setIsGoogleSheetSyncOpen(true);
      } else {
        alert(`เกิดข้อผิดพลาดในการบันทึกลง Google Sheet:\n${err.message}`);
      }
    } finally {
      setIsSavingSheet(false);
    }
  };

  const handleLoadFromGoogleSheet = (record: {
    measurements: AnimalMeasurements;
    wheelchairType: WheelchairType;
    pipeSize: PipeSize;
  }) => {
    setMeasurements(record.measurements);
    setWheelchairType(record.wheelchairType);
    setPipeSize(record.pipeSize);
    setIsManualPipeSize(true);
    showToast(`โหลดเคส "${record.measurements.caseId}" จาก Google Sheet เรียบร้อยแล้ว (สามารถแก้ไขและกดบันทึกใหม่ได้)`);
  };

  const handleSaveCurrentCase = () => {
    const cid = measurements.caseId || generateCaseId();
    const newCase: SavedCase = {
      id: cid,
      createdAt: new Date().toISOString(),
      measurements: { ...measurements, caseId: cid },
      wheelchairType,
      pipeSize,
      calculationResult,
      qcResults: { ...qcMeasuredValues },
    };
    setSavedCases((prev) => [newCase, ...prev.filter((c) => c.id !== cid)]);
    showToast(`บันทึกเคส "${cid}" ในเครื่องเรียบร้อยแล้ว!`);
  };

  const handleLoadCase = (c: SavedCase) => {
    setMeasurements(c.measurements);
    setWheelchairType(c.wheelchairType);
    setPipeSize(c.pipeSize);
    setIsManualPipeSize(true);
    if (c.qcResults) {
      setQcMeasuredValues(c.qcResults);
    } else {
      setQcMeasuredValues({});
    }
    showToast(`โหลดข้อมูลเคส "${c.measurements.petName || c.measurements.caseId}" สำเร็จ`);
  };

  const handleDeleteCase = (id: string) => {
    if (confirm('คุณต้องการลบเคสนี้หรือไม่?')) {
      setSavedCases((prev) => prev.filter((c) => c.id !== id));
      showToast('ลบเคสเรียบร้อย');
    }
  };

  const handleImportCases = (imported: SavedCase[]) => {
    setSavedCases((prev) => [...imported, ...prev]);
    showToast(`นำเข้าสำเร็จ ${imported.length} เคส`);
  };

  const handleUpdateQCValue = (id: string, val: number | undefined) => {
    setQcMeasuredValues((prev) => {
      const copy = { ...prev };
      if (val === undefined) {
        delete copy[id];
      } else {
        copy[id] = val;
      }
      return copy;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Sticky Header */}
      <Header
        darkMode={darkMode}
        isSavingSheet={isSavingSheet}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSavedCases={() => setIsSavedCasesOpen(true)}
        onOpenGoogleSheetSync={() => setIsGoogleSheetSyncOpen(true)}
        onSaveToGoogleSheet={handleSaveToGoogleSheet}
        onPrint={handlePrint}
        onLoadPreset={handleLoadPreset}
      />

      {/* Main App Container */}
      <main className="container no-print" style={{ flex: 1, padding: '1.5rem 1rem' }}>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className="animate-fade-in"
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              background: '#0284c7',
              color: '#ffffff',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            <Sparkles size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: '1.25rem' }}>
          
          {/* Left Column (Inputs Form) */}
          <div className="md:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <AnimalForm
              measurements={measurements}
              wheelchairType={wheelchairType}
              pipeSize={pipeSize}
              isManualPipeSize={isManualPipeSize}
              isSavingSheet={isSavingSheet}
              onChangeMeasurements={handleUpdateMeasurements}
              onChangeWheelchairType={setWheelchairType}
              onChangePipeSize={handleChangePipeSize}
              onReset={handleReset}
              onOpenGuide={() => setIsGuideOpen(true)}
              onSaveToGoogleSheet={handleSaveToGoogleSheet}
            />

            <MaterialsSummary calculationResult={calculationResult} />
          </div>

          {/* Right Column (Diagram, Cutting Table & QC) */}
          <div className="md:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <WheelchairDiagram
              calculationResult={calculationResult}
              selectedPartKey={selectedPartKey}
              onSelectPart={setSelectedPartKey}
            />

            <CutResultsTable
              calculationResult={calculationResult}
              selectedPartKey={selectedPartKey}
              onSelectPart={setSelectedPartKey}
            />

            <QCChecklist
              measurements={measurements}
              wheelchairType={wheelchairType}
              pipeSize={pipeSize}
              qcMeasuredValues={qcMeasuredValues}
              onUpdateQCValue={handleUpdateQCValue}
            />
          </div>

        </div>

      </main>

      {/* Printable Sheet (Visible only when printing) */}
      <PrintCutSheet
        measurements={measurements}
        calculationResult={calculationResult}
        qcMeasuredValues={qcMeasuredValues}
      />

      {/* Measurement Guide Modal */}
      <MeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Saved Cases Modal */}
      <SavedCasesModal
        isOpen={isSavedCasesOpen}
        onClose={() => setIsSavedCasesOpen(false)}
        savedCases={savedCases}
        onLoadCase={handleLoadCase}
        onSaveCurrentCase={handleSaveCurrentCase}
        onDeleteCase={handleDeleteCase}
        onImportCases={handleImportCases}
      />

      {/* Google Sheet Sync Modal */}
      <GoogleSheetSyncModal
        isOpen={isGoogleSheetSyncOpen}
        onClose={() => setIsGoogleSheetSyncOpen(false)}
        onLoadCaseFromSheet={handleLoadFromGoogleSheet}
      />

      {/* Footer */}
      <footer
        className="no-print"
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          padding: '1.25rem 0',
          marginTop: '2rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <span>โครงการเพราะมีน้ำใจจึงมีชีวิต (Wheelchair for Pets)</span>
            <span>•</span>
            <span>มูลนิธิศาสตราจารย์ ดร.จักร พิชัยรณรงค์สงคราม</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>ระบบคำนวณและควบคุมคุณภาพการตัดประกอบวีลแชร์ PVC พร้อมเชื่อมต่อ Google Sheet</span>
            <Heart size={14} style={{ color: '#ef4444' }} />
            <span>GitHub &amp; Vercel Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
