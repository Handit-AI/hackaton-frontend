// AgentScoreBar component - Minimalist Design
// Displays a horizontal score bar for agent performance visualization

import { AgentAnalysis } from '../../types';

interface AgentScoreBarProps {
  name: string;
  analysis: AgentAnalysis;
}

function AgentScoreBar({ name, analysis }: AgentScoreBarProps) {
  const score = analysis.risk_score;
  const width = `${score}%`;

  // Color based on score
  const getColors = (score: number) => {
    if (score >= 75) return { bar: '#ef4444', bg: '#fef2f2', text: '#991b1b' };
    if (score >= 50) return { bar: '#f59e0b', bg: '#fff7ed', text: '#9a3412' };
    if (score >= 25) return { bar: '#eab308', bg: '#fefce8', text: '#854d0e' };
    return { bar: '#10b981', bg: '#f0fdf4', text: '#065f46' };
  };

  const colors = getColors(score);

  return (
    <div style={{
      padding: '1.25rem',
      borderRadius: '0.75rem',
      background: colors.bg,
      border: '1px solid',
      borderColor: score >= 50 ? '#fecaca' : '#d1fae5',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 600, color: '#171717', fontSize: '0.9375rem' }}>{name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            fontSize: '1.125rem', 
            fontWeight: 700, 
            color: colors.text 
          }}>
            {score.toFixed(1)}
          </span>
          <span style={{ 
            fontSize: '0.875rem',
            padding: '0.25rem 0.625rem',
            borderRadius: '0.375rem',
            background: analysis.recommendation === 'APPROVE' ? '#d1fae5' : '#fee2e2',
            color: analysis.recommendation === 'APPROVE' ? '#065f46' : '#991b1b',
            fontWeight: 600
          }}>
            {analysis.recommendation === 'APPROVE' ? '✓' : '✗'}
          </span>
        </div>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '8px', 
        background: '#e5e5e5', 
        borderRadius: '1rem',
        overflow: 'hidden'
      }}>
        <div 
          style={{ 
            height: '100%', 
            background: colors.bar,
            borderRadius: '1rem',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            width 
          }}
        ></div>
      </div>
    </div>
  );
}

export default AgentScoreBar;
