import React, { useState } from 'react';
import { Header } from './components/Header';
import { CorridorSelector } from './components/CorridorSelector';
import { MapViewer } from './components/MapViewer';
import { CitizenReportModal } from './components/CitizenReportModal';
import { FederatedDashboard } from './components/FederatedDashboard';
import { ForecastChart } from './components/ForecastChart';
import { AlertGenerator } from './components/AlertGenerator';

import {
  BRICS_CORRIDORS,
  MOCK_HOTSPOTS,
  MOCK_SENSORS,
  MOCK_CITIZEN_REPORTS,
  MOCK_FEDERATED_NODES,
  MOCK_24H_FORECAST,
  UI_TRANSLATIONS
} from './data/mockData';

import { BricsCorridor, Hotspot, CitizenReport, LanguageCode } from './types';
import { Flame, ShieldAlert, Cpu, Activity, Camera, CheckCircle2, ChevronRight, Layers, Eye } from 'lucide-react';

export function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeCorridor, setActiveCorridor] = useState<BricsCorridor>(BRICS_CORRIDORS[0]);
  const [hotspots, setHotspots] = useState<Hotspot[]>(MOCK_HOTSPOTS);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(MOCK_CITIZEN_REPORTS);
  
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const [activeTab, setActiveTab] = useState<'map' | 'federated' | 'forecast' | 'alerts'>('map');

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS['en'];

  const handleAddCitizenReport = (newReport: CitizenReport) => {
    setCitizenReports([newReport, ...citizenReports]);

    // Create a new hotspot automatically from citizen report!
    const newHotspot: Hotspot = {
      id: `hs-${Date.now()}`,
      title: `Citizen Verified Hotspot - ${newReport.locationName}`,
      corridorId: activeCorridor.id,
      location: newReport.coordinates,
      country: newReport.country,
      type: newReport.detectedCategory as any,
      severity: 'Critical',
      pm25: newReport.estimatedPm25,
      no2: 95,
      so2: 40,
      detectedAt: 'Just Now (Citizen Photo AI + Sentinel-5P)',
      satelliteVerified: true,
      citizenReportCount: 1,
      affectedNeighbors: [newReport.country],
      plumeDirection: 'NW -> SE'
    };

    setHotspots([newHotspot, ...hotspots]);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px 40px 16px' }}>
      
      {/* Top Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenCitizenModal={() => setIsCitizenModalOpen(true)}
        activeCorridorName={activeCorridor.name}
      />

      {/* Main Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        
        <div className="glass-panel glass-panel-hover" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <Flame size={24} color="#f43f5e" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detected Pollution Hotspots</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
              {hotspots.length} <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>Active Fires/Smelters</span>
            </div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <Camera size={24} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gemini Verified Citizen Photos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
              {citizenReports.length} <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Reports</span>
            </div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <Cpu size={24} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BRICS Federated Training Sync</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
              95.4% <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Accuracy</span>
            </div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <ShieldAlert size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WHO Exceedance Factor</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
              22.8x <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>above 15µg limit</span>
            </div>
          </div>
        </div>

      </div>

      {/* Corridor Selector Switcher */}
      <CorridorSelector
        corridors={BRICS_CORRIDORS}
        activeCorridorId={activeCorridor.id}
        onSelectCorridor={(c) => {
          setActiveCorridor(c);
          setSelectedHotspot(null);
        }}
      />

      {/* Primary Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('map')}
          className={activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 18px', fontSize: '0.9rem' }}
        >
          <Layers size={16} /> Command Map & Hotspot Matrix
        </button>

        <button
          onClick={() => setActiveTab('federated')}
          className={activeTab === 'federated' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 18px', fontSize: '0.9rem', background: activeTab === 'federated' ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' : undefined }}
        >
          <Cpu size={16} /> Federated AI Interoperability Hub
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={activeTab === 'forecast' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 18px', fontSize: '0.9rem' }}
        >
          <Activity size={16} /> Predictive Spike Forecast (24h)
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 18px', fontSize: '0.9rem', background: activeTab === 'alerts' ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' : undefined }}
        >
          <ShieldAlert size={16} /> Gemini GenAI Policy Briefs
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'map' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
          
          {/* Main Leaflet Map */}
          <MapViewer
            activeCorridor={activeCorridor}
            hotspots={hotspots}
            sensors={MOCK_SENSORS}
            onSelectHotspot={(h) => setSelectedHotspot(h)}
          />

          {/* Side Panel: Selected Hotspot or Citizen Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Selected Hotspot Detail Card */}
            {selectedHotspot ? (
              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f43f5e' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-critical">
                    <Flame size={12} /> {selectedHotspot.severity} HOTSPOT
                  </span>
                  <button onClick={() => setSelectedHotspot(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Close</button>
                </div>
                <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '8px' }}>{selectedHotspot.title}</h4>
                
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Location:</strong> {selectedHotspot.country} ({selectedHotspot.location[0].toFixed(2)}, {selectedHotspot.location[1].toFixed(2)})</div>
                  <div><strong>Pollution Type:</strong> {selectedHotspot.type}</div>
                  <div><strong>PM2.5 Density:</strong> <span style={{ color: '#f43f5e', fontWeight: 700 }}>{selectedHotspot.pm25} µg/m³</span></div>
                  <div><strong>Plume Drift:</strong> {selectedHotspot.plumeDirection}</div>
                  <div><strong>Satellite Verified:</strong> Copernicus Sentinel-5P TROPOMI Feed</div>
                </div>

                <button
                  onClick={() => setActiveTab('alerts')}
                  className="btn-danger"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  <ShieldAlert size={16} /> Generate Gemini Emergency Brief
                </button>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={16} color="#f43f5e" /> Active Hotspot Matrix
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {hotspots.filter(h => h.corridorId === activeCorridor.id).map(h => (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHotspot(h)}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{h.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h.type}</div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e' }}>{h.pm25} µg/m³</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Citizen Feed */}
            <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={16} color="var(--primary-cyan)" /> Live Citizen Photo Submissions
                </h4>
                <button onClick={() => setIsCitizenModalOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-cyan)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                  + Submit
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                {citizenReports.map(report => (
                  <div key={report.id} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
                    {report.imageUrl && (
                      <img src={report.imageUrl} alt="Citizen report" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.8rem', color: 'white' }}>{report.locationName} ({report.country})</strong>
                        <span style={{ fontSize: '0.65rem', color: '#10b981' }}>Verified</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 4px 0' }}>{report.rawText}</p>
                      {report.geminiAnalysis && (
                        <div style={{ fontSize: '0.65rem', color: 'var(--primary-cyan)' }}>
                          Gemini Vision: {report.geminiAnalysis.detectedSources.join(', ')} ({report.geminiAnalysis.healthRiskLevel})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'federated' && (
        <FederatedDashboard nodes={MOCK_FEDERATED_NODES} />
      )}

      {activeTab === 'forecast' && (
        <ForecastChart forecast={MOCK_24H_FORECAST} activeCorridor={activeCorridor} />
      )}

      {activeTab === 'alerts' && (
        <AlertGenerator activeCorridor={activeCorridor} currentLang={currentLang} />
      )}

      {/* Citizen Photo Upload Modal */}
      <CitizenReportModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        onAddReport={handleAddCitizenReport}
        currentLang={currentLang}
      />

    </div>
  );
}

export default App;
