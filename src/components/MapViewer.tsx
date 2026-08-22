import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { BricsCorridor, Hotspot, SensorNode } from '../types';
import { Eye, ShieldAlert, Wind, Layers, Flame, Radio, Activity } from 'lucide-react';

// Custom Map View Re-center Controller
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

// Create SVG Icon for Hotspots
const createCustomHotspotIcon = (severity: string) => {
  const color = severity === 'Critical' ? '#f43f5e' : severity === 'High' ? '#f59e0b' : '#eab308';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${color}; opacity: 0.3; animation: pulse-ring 1.8s ease-out infinite;"></div>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 12px ${color};"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Create Sensor Marker Icon
const createSensorIcon = (pm25: number) => {
  const color = pm25 > 250 ? '#f43f5e' : pm25 > 100 ? '#f59e0b' : '#10b981';
  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `
      <div style="background: rgba(15, 23, 42, 0.9); border: 1.5px solid ${color}; color: ${color}; font-size: 11px; font-weight: 700; font-family: monospace; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); white-space: nowrap;">
        ${pm25} µg/m³
      </div>
    `,
    iconSize: [60, 20],
    iconAnchor: [30, 10]
  });
};

interface MapViewerProps {
  activeCorridor: BricsCorridor;
  hotspots: Hotspot[];
  sensors: SensorNode[];
  onSelectHotspot: (hotspot: Hotspot) => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  activeCorridor,
  hotspots,
  sensors,
  onSelectHotspot
}) => {
  const [satelliteLayer, setSatelliteLayer] = useState<'copernicus-no2' | 'copernicus-pm25' | 'standard'>('copernicus-pm25');
  const [showPlumes, setShowPlumes] = useState(true);
  const [showSensors, setShowSensors] = useState(true);

  const filteredHotspots = hotspots.filter(h => h.corridorId === activeCorridor.id);

  // Vector line generator for cross-border plume trajectories
  const plumeVectors = filteredHotspots.map(h => {
    const lat = h.location[0];
    const lng = h.location[1];
    // offset plume in wind direction
    return {
      id: h.id,
      path: [
        [lat, lng],
        [lat - 0.25, lng + 0.35],
        [lat - 0.5, lng + 0.75]
      ] as [number, number][]
    };
  });

  return (
    <div className="glass-panel" style={{ height: '540px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Map Control Bar Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} color="var(--primary-cyan)" /> SATELLITE & DATA LAYERS
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setSatelliteLayer('copernicus-pm25')}
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: satelliteLayer === 'copernicus-pm25' ? 'var(--primary-cyan)' : 'var(--border-color)',
              background: satelliteLayer === 'copernicus-pm25' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: satelliteLayer === 'copernicus-pm25' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Sentinel-5P PM2.5
          </button>
          <button
            onClick={() => setSatelliteLayer('copernicus-no2')}
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: satelliteLayer === 'copernicus-no2' ? 'var(--accent-purple)' : 'var(--border-color)',
              background: satelliteLayer === 'copernicus-no2' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
              color: satelliteLayer === 'copernicus-no2' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            TROPOMI NO₂ Column
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showPlumes} onChange={e => setShowPlumes(e.target.checked)} />
            <Wind size={12} color="#38bdf8" /> Trans-Boundary Wind Plumes
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showSensors} onChange={e => setShowSensors(e.target.checked)} />
            <Radio size={12} color="#10b981" /> Ground Sensor Arrays
          </label>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        fontSize: '0.75rem'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="#f59e0b" /> Pollution Level Indicator
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span>&lt; 100 (Moderate)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>101 - 250 (Unhealthy)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
            <span>&gt; 250 (Hazardous)</span>
          </div>
        </div>
      </div>

      {/* Leaflet React Map Container */}
      <MapContainer
        center={activeCorridor.center}
        zoom={activeCorridor.zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <MapController center={activeCorridor.center} zoom={activeCorridor.zoom} />
        
        {/* Dark Matter Base Tile */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> Copernicus BRICS Feed'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Hotspots & Satellite Heat Circles */}
        {filteredHotspots.map(h => (
          <React.Fragment key={h.id}>
            {/* Heatmap radius */}
            <Circle
              center={h.location}
              radius={h.severity === 'Critical' ? 45000 : 25000}
              pathOptions={{
                color: h.severity === 'Critical' ? '#f43f5e' : '#f59e0b',
                fillColor: h.severity === 'Critical' ? '#f43f5e' : '#f59e0b',
                fillOpacity: 0.25,
                weight: 1
              }}
            />

            {/* Hotspot Marker */}
            <Marker
              position={h.location}
              icon={createCustomHotspotIcon(h.severity)}
              eventHandlers={{
                click: () => onSelectHotspot(h)
              }}
            >
              <Popup>
                <div style={{ width: '220px', padding: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className={`badge ${h.severity === 'Critical' ? 'badge-critical' : 'badge-warning'}`}>
                      <Flame size={12} /> {h.severity}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{h.country}</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: 'white', margin: '0 0 6px 0' }}>{h.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '8px' }}>
                    <div><strong>Type:</strong> {h.type}</div>
                    <div><strong>PM2.5:</strong> <span style={{ color: '#f43f5e', fontWeight: 700 }}>{h.pm25} µg/m³</span></div>
                    <div><strong>Plume Vector:</strong> {h.plumeDirection}</div>
                  </div>
                  <button
                    onClick={() => onSelectHotspot(h)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Diagnose Hotspot & Generate Alert
                  </button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Sensor Markers */}
        {showSensors && sensors.map(s => (
          <Marker key={s.id} position={s.location} icon={createSensorIcon(s.pm25)}>
            <Popup>
              <div style={{ fontSize: '0.75rem', color: '#f8fafc' }}>
                <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>{s.name}</div>
                <div>PM2.5: <strong>{s.pm25} µg/m³</strong></div>
                <div>PM10: <strong>{s.pm10} µg/m³</strong></div>
                <div>NO₂: <strong>{s.no2} ppb</strong></div>
                <div>Wind: <strong>{s.windSpeed} km/h</strong> ({s.windDir}°)</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Trans-Boundary Wind Vector Polylines */}
        {showPlumes && plumeVectors.map(vec => (
          <Polyline
            key={`plume-${vec.id}`}
            positions={vec.path}
            pathOptions={{
              color: '#38bdf8',
              weight: 3,
              dashArray: '8, 8',
              opacity: 0.8
            }}
          />
        ))}

      </MapContainer>
    </div>
  );
};
