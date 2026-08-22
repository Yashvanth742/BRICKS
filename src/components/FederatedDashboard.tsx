import React, { useState } from 'react';
import { Cpu, ShieldCheck, RefreshCw, Database, Lock, CheckCircle, Network, TrendingUp } from 'lucide-react';
import { FederatedNode } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface FederatedDashboardProps {
  nodes: FederatedNode[];
}

export const FederatedDashboard: React.FC<FederatedDashboardProps> = ({ nodes: initialNodes }) => {
  const [nodes, setNodes] = useState<FederatedNode[]>(initialNodes);
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregationRound, setAggregationRound] = useState(148);

  const handleRunFederatedRound = () => {
    setIsAggregating(true);
    
    // Simulate node state change
    setNodes(prev => prev.map(n => ({ ...n, status: 'Training' })));

    setTimeout(() => {
      setNodes(prev => prev.map(n => ({ ...n, status: 'Aggregating' })));
    }, 1200);

    setTimeout(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        status: 'Synced',
        accuracy: Math.min(99, +(n.accuracy + 0.3).toFixed(1)),
        currentLoss: +(n.currentLoss * 0.94).toFixed(3),
        lastSync: 'Just Now'
      })));
      setAggregationRound(r => r + 1);
      setIsAggregating(false);
    }, 2800);
  };

  const chartData = nodes.map(n => ({
    name: n.country,
    accuracy: n.accuracy,
    loss: +(n.currentLoss * 100).toFixed(1)
  }));

  const totalPoints = nodes.reduce((sum, n) => sum + n.localDataPoints, 0);
  const avgAccuracy = (nodes.reduce((sum, n) => sum + n.accuracy, 0) / nodes.length).toFixed(1);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <Network size={22} color="var(--accent-purple)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }} className="gradient-text">
                BRICS Interoperable Federated AI Engine
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Privacy-Preserving Cross-Border Model Weight Aggregation (Round #{aggregationRound})
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleRunFederatedRound}
            disabled={isAggregating}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
          >
            <RefreshCw size={16} className={isAggregating ? 'spin' : ''} />
            {isAggregating ? 'Aggregating Federated Weights...' : 'Execute Federated Sync Round'}
          </button>
        </div>
      </div>

      {/* Key Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '6px' }}>
            <TrendingUp size={14} color="var(--primary-cyan)" /> Global Model Accuracy
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
            {avgAccuracy}%
          </div>
          <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px' }}>
            +1.4% improvement after round #{aggregationRound}
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '6px' }}>
            <Lock size={14} color="var(--accent-purple)" /> Differential Privacy Guarantee
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            ε = 0.5 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(High Privacy)</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Zero raw citizen data exported across borders
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '6px' }}>
            <Database size={14} color="var(--accent-amber)" /> Shared Training Corpus
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
            {(totalPoints / 1000000).toFixed(2)}M <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>points</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Combined Copernicus & local sensor streams
          </div>
        </div>

      </div>

      {/* Nodes Table & Chart Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        
        {/* Nodes Grid */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={16} color="var(--primary-cyan)" /> Active BRICS Federated AI Nodes
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {nodes.map(node => (
              <div
                key={node.country}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>
                      {node.country === 'India' ? '🇮🇳' : node.country === 'China' ? '🇨🇳' : node.country === 'Brazil' ? '🇧🇷' : node.country === 'South Africa' ? '🇿🇦' : node.country === 'Russia' ? '🇷🇺' : '🇦🇪'}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'white' }}>{node.institution}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Model: <span style={{ color: 'var(--primary-cyan)' }}>{node.modelType}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                    {node.accuracy}% Acc
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Loss: {node.currentLoss}
                  </div>
                </div>

                <div>
                  <span className={`badge ${node.status === 'Synced' ? 'badge-success' : node.status === 'Aggregating' ? 'badge-warning' : 'badge-cyan'}`}>
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Accuracy & Loss Chart */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Node Accuracy Benchmark (%)
          </h4>
          <div style={{ flex: 1, minHeight: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="accuracy" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
