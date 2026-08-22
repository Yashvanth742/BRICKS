import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { ForecastPoint, BricsCorridor } from '../types';
import { TrendingUp, AlertCircle, CloudRain, Thermometer, Wind } from 'lucide-react';

interface ForecastChartProps {
  forecast: ForecastPoint[];
  activeCorridor: BricsCorridor;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, activeCorridor }) => {
  const peakSpike = [...forecast].sort((a, b) => b.pm25 - a.pm25)[0];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <TrendingUp size={22} color="var(--accent-amber)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }} className="gradient-text-fire">
                Corridor Air Quality Spike Predictor (24h Forecast)
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Predictive AI modeling for {activeCorridor.name}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-critical" style={{ padding: '6px 12px' }}>
            <AlertCircle size={14} /> Peak Predicted Spike: {peakSpike.pm25} µg/m³ at {peakSpike.hour}
          </span>
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ height: '260px', width: '100%', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorNo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc' }}
              formatter={(val: number) => [`${val} µg/m³`, '']}
            />
            {/* WHO Guideline Threshold Line */}
            <ReferenceLine y={15} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'WHO 24h Threshold (15 µg/m³)', fill: '#10b981', fontSize: 11 }} />
            
            <Area type="monotone" dataKey="pm25" name="PM2.5 Density" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorPm25)" />
            <Area type="monotone" dataKey="no2" name="NO₂ Concentration" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorNo2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Meteorological Drivers Correlation Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wind size={18} color="var(--primary-cyan)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Wind Vector</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>14 km/h (NW → SE)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Thermometer size={18} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Thermal Inversion</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f43f5e' }}>Strong (450m Cap)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CloudRain size={18} color="var(--accent-purple)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Relative Humidity</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>78% (Aerosol Growth)</div>
          </div>
        </div>
      </div>

    </div>
  );
};
