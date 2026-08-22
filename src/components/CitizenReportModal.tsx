import React, { useState } from 'react';
import { Camera, Mic, MicOff, Sparkles, Volume2, X, CheckCircle, AlertTriangle, FileText, Upload } from 'lucide-react';
import { CitizenReport, GeminiVisionResult, LanguageCode, BricsNation } from '../types';
import { analyzeCitizenPhoto } from '../services/geminiService';
import { speechService } from '../services/speechService';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReport: (report: CitizenReport) => void;
  currentLang: LanguageCode;
}

const PRESET_PHOTOS = [
  {
    title: 'Crop Stubble Fire',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    country: 'India' as BricsNation,
    desc: 'Dense farm stubble burning causing thick smog downwind.'
  },
  {
    title: 'Industrial Smoke Stack',
    url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80',
    country: 'China' as BricsNation,
    desc: 'Heavy metallurgical plant emitting dark particulate plume.'
  },
  {
    title: 'Biomass Sugarcane Fire',
    url: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80',
    country: 'Brazil' as BricsNation,
    desc: 'Biomass sugarcane burning obscuring highway visibility.'
  }
];

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onAddReport,
  currentLang
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_PHOTOS[0].url);
  const [description, setDescription] = useState(PRESET_PHOTOS[0].desc);
  const [country, setCountry] = useState<BricsNation>('India');
  const [locationName, setLocationName] = useState('Ludhiana Agro Zone');
  const [reportLang, setReportLang] = useState<LanguageCode>(currentLang);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiVisionResult | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechService.startListening(
        reportLang,
        (transcript) => {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsRecording(false);
        }
      );
    }
  };

  const handleRunGeminiDiagnosis = async () => {
    setIsAnalyzing(true);
    setGeminiResult(null);

    try {
      const result = await analyzeCitizenPhoto(selectedImage, description, country, locationName);
      setGeminiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeakDiagnosis = () => {
    if (!geminiResult) return;
    const text = `Gemini Vision Diagnosis for ${locationName}. Identified ${geminiResult.detectedSources.join(', ')}. Risk level is ${geminiResult.healthRiskLevel}. Estimated AQI impact: ${geminiResult.estimatedAqiImpact}. Recommended intervention: ${geminiResult.recommendedIntervention}`;
    speechService.speak(text, reportLang);
  };

  const handleSubmit = () => {
    const newReport: CitizenReport = {
      id: `cr-${Date.now()}`,
      timestamp: 'Just Now',
      country,
      locationName,
      coordinates: country === 'India' ? [30.9010, 75.8573] : country === 'China' ? [39.6309, 118.1802] : [-21.1775, -47.8103],
      imageUrl: selectedImage,
      rawText: description,
      language: reportLang,
      detectedCategory: geminiResult?.detectedSources[0] || 'Uncategorized Smog',
      confidenceScore: 0.95,
      estimatedPm25: geminiResult?.estimatedAqiImpact || 350,
      status: 'Verified',
      geminiAnalysis: geminiResult || undefined
    };
    onAddReport(newReport);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '780px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <Camera size={22} color="var(--primary-cyan)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }} className="gradient-text">
                Citizen Photo AI & Multilingual Pollution Report
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Powered by Google Gemini Multimodal Vision & BRICS Voice Translation Engine
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Body Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Column 1: Image & Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              1. Upload Photo or Choose Sample
            </label>
            
            {/* Image Preview Box */}
            <div style={{
              height: '200px',
              borderRadius: '12px',
              border: '2px dashed var(--border-color)',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '12px',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedImage ? (
                <img src={selectedImage} alt="Pollution Source" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Upload size={32} style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.8rem' }}>Click or drop photo here</div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            </div>

            {/* Sample Presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {PRESET_PHOTOS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setDescription(preset.desc);
                    setCountry(preset.country);
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: selectedImage === preset.url ? 'var(--primary-cyan)' : 'var(--border-color)',
                    background: 'rgba(30, 41, 59, 0.6)',
                    color: 'var(--text-main)',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            {/* Location & Country */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>BRICS Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as BricsNation)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.9)', color: 'white', border: '1px solid var(--border-color)' }}
                >
                  <option value="India">India 🇮🇳</option>
                  <option value="China">China 🇨🇳</option>
                  <option value="Brazil">Brazil 🇧🇷</option>
                  <option value="South Africa">South Africa 🇿🇦</option>
                  <option value="Russia">Russia 🇷🇺</option>
                  <option value="UAE">UAE 🇦🇪</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Location Name</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.9)', color: 'white', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            {/* Description Textarea + Voice Recording */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Citizen Notes & Speech Input</label>
                <select
                  value={reportLang}
                  onChange={(e) => setReportLang(e.target.value as LanguageCode)}
                  style={{ background: 'transparent', color: 'var(--primary-cyan)', border: 'none', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  <option value="hi" style={{ background: '#0f172a' }}>Hindi</option>
                  <option value="zh" style={{ background: '#0f172a' }}>Mandarin</option>
                  <option value="pt" style={{ background: '#0f172a' }}>Portuguese</option>
                  <option value="ru" style={{ background: '#0f172a' }}>Russian</option>
                  <option value="ar" style={{ background: '#0f172a' }}>Arabic</option>
                  <option value="en" style={{ background: '#0f172a' }}>English</option>
                </select>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible smoke, odors, or burning source..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: 'white',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={handleVoiceRecord}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isRecording ? '#f43f5e' : 'rgba(56, 189, 248, 0.2)',
                  color: isRecording ? 'white' : 'var(--primary-cyan)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isRecording ? <><MicOff size={14} /> Recording...</> : <><Mic size={14} /> Voice Input</>}
              </button>
            </div>

            <button
              onClick={handleRunGeminiDiagnosis}
              disabled={isAnalyzing}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Sparkles size={16} />
              {isAnalyzing ? 'Gemini AI Analyzing Photo...' : 'Diagnose Photo with Gemini AI'}
            </button>

          </div>

          {/* Column 2: Gemini AI Analysis Breakdown Output */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--primary-cyan)" /> Google Gemini Vision Output
              </h4>
              {geminiResult && (
                <button onClick={handleSpeakDiagnosis} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                  <Volume2 size={12} color="var(--primary-cyan)" /> Speak Output
                </button>
              )}
            </div>

            {isAnalyzing ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid rgba(56, 189, 248, 0.3)', borderTopColor: 'var(--primary-cyan)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Running Gemini Multimodal Vision Classifier...</div>
              </div>
            ) : geminiResult ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Risk Level Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.8)', padding: '10px 14px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Health Threat Level</span>
                  <span className={`badge ${geminiResult.healthRiskLevel === 'Hazardous' ? 'badge-critical' : 'badge-warning'}`}>
                    <AlertTriangle size={12} /> {geminiResult.healthRiskLevel}
                  </span>
                </div>

                {/* AQI & Sources */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est. AQI Impact</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f43f5e' }}>
                      {geminiResult.estimatedAqiImpact} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>µg/m³</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Smoke Opacity</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                      {geminiResult.smokeOpacity}
                    </div>
                  </div>
                </div>

                {/* Identified Sources */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Identified Emission Sources:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {geminiResult.detectedSources.map((src, i) => (
                      <span key={i} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>AI Visual Evidence:</strong>
                  {geminiResult.aiExplanation}
                </div>

                {/* Recommended Authority Action */}
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '2px' }}>Recommended Authority Action:</strong>
                  {geminiResult.recommendedIntervention}
                </div>

                <button onClick={handleSubmit} className="btn-primary" style={{ marginTop: 'auto', justifyContent: 'center' }}>
                  <CheckCircle size={16} /> Confirm & Dispatch to BRICS Alert Registry
                </button>

              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', gap: '10px' }}>
                <FileText size={36} opacity={0.4} />
                <div style={{ fontSize: '0.85rem' }}>
                  Upload a photo and click <strong>"Diagnose Photo with Gemini AI"</strong> to generate real-time computer vision classification.
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
