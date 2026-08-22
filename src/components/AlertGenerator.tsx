import React, { useState } from 'react';
import { ShieldAlert, Sparkles, Send, Download, Volume2, CheckCircle, AlertOctagon, Building, Clock, ChevronRight } from 'lucide-react';
import { BricsCorridor, GeminiAlertBrief, BricsNation, LanguageCode } from '../types';
import { generatePolicyBrief } from '../services/geminiService';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';

interface AlertGeneratorProps {
  activeCorridor: BricsCorridor;
  currentLang: LanguageCode;
}

export const AlertGenerator: React.FC<AlertGeneratorProps> = ({ activeCorridor, currentLang }) => {
  const [brief, setBrief] = useState<GeminiAlertBrief | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const handleGenerateAlert = async () => {
    setIsGenerating(true);
    setDispatched(false);

    try {
      const result = await generatePolicyBrief(
        activeCorridor.name,
        activeCorridor.nations,
        activeCorridor.currentAvgAqi,
        activeCorridor.primarySources
      );
      setBrief(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDispatchAlert = () => {
    setDispatched(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSpeakBrief = () => {
    if (!brief) return;
    const speechText = `${brief.title}. ${brief.summary}. Triggered protocol: ${brief.diplomaticProtocolTriggered}.`;
    speechService.speak(speechText, currentLang);
  };

  const handleExportPrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <ShieldAlert size={22} color="var(--accent-rose)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }} className="gradient-text">
                Gemini GenAI Rapid Intervention & Policy Brief Generator
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Cross-Border Authority Dispatch Protocol for {activeCorridor.name}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleGenerateAlert}
            disabled={isGenerating}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)' }}
          >
            <Sparkles size={16} />
            {isGenerating ? 'Gemini Generating Brief...' : 'Generate GenAI Policy Brief'}
          </button>
        </div>
      </div>

      {/* Brief Content View */}
      {isGenerating ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid rgba(244, 63, 94, 0.3)', borderTopColor: '#f43f5e', borderRadius: '50%', margin: '0 auto 12px auto', animation: 'spin 1s linear infinite' }} />
          <div>Synthesizing satellite vectors, ground sensors, and diplomatic treaties using Google Gemini GenAI...</div>
        </div>
      ) : brief ? (
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
          
          {/* Status Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-critical" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                <AlertOctagon size={14} /> {brief.riskLevel}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Issued: {brief.timestamp}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSpeakBrief} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <Volume2 size={14} color="var(--primary-cyan)" /> Listen Brief
              </button>
              <button onClick={handleExportPrint} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <Download size={14} /> Export Brief (PDF)
              </button>
            </div>
          </div>

          {/* Title & Summary */}
          <h4 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '8px' }}>{brief.title}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
            {brief.summary}
          </p>

          {/* Root Causes & Diplomatic Accord */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '8px' }}>
                IDENTIFIED ROOT CAUSES
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {brief.rootCauses.map((cause, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{cause}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                TRIGGERED DIPLOMATIC ACCORD
              </div>
              <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>
                {brief.diplomaticProtocolTriggered}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Enables automated cross-border resource sharing and mutual environmental monitoring between BRICS secretariats.
              </div>
            </div>

          </div>

          {/* Suggested Actions Table */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
              RECOMMENDED RAPID INTERVENTION ACTIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {brief.suggestedActions.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building size={16} color="var(--primary-cyan)" />
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>{item.authority}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.action}</span>
                    </div>
                  </div>

                  <span className={`badge ${item.priority === 'Immediate' ? 'badge-critical' : 'badge-warning'}`}>
                    <Clock size={12} /> {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Trigger Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(56, 189, 248, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)' }}>
              Ready to transmit verified briefing to BRICS Climate Emergency Dispatch Network?
            </div>
            
            <button
              onClick={handleDispatchAlert}
              disabled={dispatched}
              className="btn-primary"
              style={{ background: dispatched ? '#10b981' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
            >
              {dispatched ? <><CheckCircle size={16} /> Alert Dispatched to Authorities!</> : <><Send size={16} /> Dispatch Emergency Alert</>}
            </button>
          </div>

        </div>
      ) : (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}>
          <div>Click <strong>"Generate GenAI Policy Brief"</strong> to synthesize Gemini AI diplomatic emergency briefs for this economic corridor.</div>
        </div>
      )}

    </div>
  );
};
