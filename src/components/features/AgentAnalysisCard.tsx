// AgentAnalysisCard component - Minimalist Design
// Displays analysis results from a single fraud detection agent

import { AgentAnalysis } from '../../types';

interface AgentAnalysisCardProps {
  name: string;
  analysis: AgentAnalysis;
}

function AgentAnalysisCard({ name, analysis }: AgentAnalysisCardProps) {
  const getAgentIcon = (name: string) => {
    const icons: { [key: string]: string } = {
      PatternDetector: '🔍',
      BehavioralAnalyzer: '🧠',
      VelocityChecker: '⚡',
      MerchantRiskAnalyzer: '🏪',
      GeographicAnalyzer: '🌍',
    };
    return icons[name] || '🤖';
  };

  const getColorByScore = (score: number) => {
    if (score >= 75) return '#ef4444';
    if (score >= 50) return '#f59e0b';
    if (score >= 25) return '#eab308';
    return '#10b981';
  };

  const borderColor = getColorByScore(analysis.risk_score);

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.75rem',
      padding: '1.75rem',
      border: '1px solid #f5f5f5',
      borderTop: `3px solid ${borderColor}`,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>{getAgentIcon(name)}</span>
          <div>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#171717', margin: 0 }}>{name}</h4>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#737373',
              marginTop: '0.125rem'
            }}>
              Confidence: {(analysis.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <span style={{
          padding: '0.375rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          background: analysis.recommendation === 'APPROVE' 
            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          color: analysis.recommendation === 'APPROVE' ? '#065f46' : '#991b1b'
        }}>
          {analysis.recommendation}
        </span>
      </div>

      {/* Risk Score */}
      <div style={{
        padding: '1rem',
        background: '#fafafa',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.875rem', color: '#525252', fontWeight: 500 }}>Risk Score</span>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: borderColor
        }}>
          {analysis.risk_score.toFixed(1)}
        </span>
      </div>

      {/* Reasoning */}
      {analysis.reasoning && (
        <div style={{
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '0.5rem',
          borderLeft: '3px solid #3b82f6',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.5rem' }}>
            ANALYSIS
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#525252', 
            lineHeight: 1.6,
            margin: 0
          }}>
            {analysis.reasoning}
          </p>
        </div>
      )}

      {/* Key Findings */}
      {analysis.findings.length > 0 && (
        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            color: '#737373', 
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Key Findings
          </div>
          <ul style={{ 
            margin: 0, 
            padding: 0, 
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {analysis.findings.map((finding, i) => (
              <li key={i} style={{
                fontSize: '0.8125rem',
                color: '#525252',
                paddingLeft: '1.25rem',
                position: 'relative',
                lineHeight: 1.5
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: '#3b82f6',
                  fontWeight: 700
                }}>
                  •
                </span>
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AgentAnalysisCard;
