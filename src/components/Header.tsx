import React, { useState } from 'react';
import { Wind, ShieldAlert, Cpu, Globe2, Camera, Key, CheckCircle, Volume2 } from 'lucide-react';
import { LanguageCode, BricsNation } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';
import { getGeminiApiKey, setGeminiApiKey } from '../services/geminiService';
import { speechService } from '../services/speechService';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenCitizenModal: () => void;
  activeCorridorName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenCitizenModal,
  activeCorridorName
}) => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [keySaved, setKeySaved] = useState(false);

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS['en'];

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput.trim());
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowApiKeyModal(false);
    }, 1200);
  };

  const handleSpeechWelcome = () => {
    const welcomeMsg = `${t.appTitle}. ${t.appSubtitle}. Currently monitoring ${activeCorridorName}.`;
    speechService.speak(welcomeMsg, currentLang);
  };

  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', padding: '14px 24px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
          }}>
            <Wind size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', margin: 0 }} className="gradient-text">
                {t.appTitle}
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                <Cpu size={12} /> Google AI Powered
              </span>
              <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>
                <ShieldAlert size={12} /> BRICS Protocol v2.4
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* BRICS Member Flags & Federated Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Globe2 size={16} color="var(--primary-cyan)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nodes:</span>
          <span title="India" style={{ fontSize: '1rem' }}>🇮🇳</span>
          <span title="China" style={{ fontSize: '1rem' }}>🇨🇳</span>
          <span title="Brazil" style={{ fontSize: '1rem' }}>🇧🇷</span>
          <span title="South Africa" style={{ fontSize: '1rem' }}>🇿🇦</span>
          <span title="Russia" style={{ fontSize: '1rem' }}>🇷🇺</span>
          <span title="UAE" style={{ fontSize: '1rem' }}>🇦🇪</span>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>FEDERATED ACTIVE</span>
        </div>

        {/* Controls: Audio, Language, Citizen Report, Gemini Key */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Audio Readout */}
          <button 
            onClick={handleSpeechWelcome} 
            className="btn-secondary" 
            title="Listen to Audio Summary"
            style={{ padding: '8px 12px' }}
          >
            <Volume2 size={16} color="var(--primary-cyan)" />
          </button>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(30, 41, 59, 0.8)', padding: '4px 8px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>🌐</span>
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="en" style={{ background: '#0f172a' }}>English (EN)</option>
              <option value="hi" style={{ background: '#0f172a' }}>हिंदी (Hindi)</option>
              <option value="zh" style={{ background: '#0f172a' }}>中文 (Mandarin)</option>
              <option value="pt" style={{ background: '#0f172a' }}>Português (BR)</option>
              <option value="ru" style={{ background: '#0f172a' }}>Русский (RU)</option>
              <option value="ar" style={{ background: '#0f172a' }}>العربية (Arabic)</option>
            </select>
          </div>

          {/* Gemini API Key button */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            title="Configure Gemini API Key"
          >
            <Key size={14} color={getGeminiApiKey() ? '#10b981' : '#f59e0b'} />
            {getGeminiApiKey() ? 'API Key Set' : 'Gemini Key'}
          </button>

          {/* Citizen Photo AI button */}
          <button onClick={onOpenCitizenModal} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <Camera size={16} />
            {t.submitReport}
          </button>
        </div>

      </div>

      {/* Gemini Key Modal */}
      {showApiKeyModal && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{ width: '450px', maxWidth: '90%', padding: '24px', position: 'relative' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Key color="var(--primary-cyan)" /> Google Gemini API Key Configuration
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enter your Gemini API key to enable live multimodal image classification and real-time GenAI diplomatic brief generation. (If left blank, intelligent offline simulation engine operates).
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(15, 23, 42, 0.9)',
                color: 'white',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setShowApiKeyModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveApiKey}>
                {keySaved ? <><CheckCircle size={16} /> Saved!</> : 'Save Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
