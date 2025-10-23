// Live Test page component - Minimalist Design
// This page allows users to run live fraud detection tests

import { useState } from 'react';
import { FraudAnalysisResult, Transaction } from '../../../types';
import AgentAnalysisCard from '../../../components/features/AgentAnalysisCard';
import AgentScoreBar from '../../../components/features/AgentScoreBar';

// Mock data for testing
const MOCK_RESULT: FraudAnalysisResult = {
  transaction: {
    user_id: 'sketchy_alice',
    user_age_days: 8,
    total_transactions: 1,
    amount: 7500,
    time: '03:45',
    merchant: 'CryptoCash Exchange',
    merchant_rating: 2.1,
    merchant_fraud_reports: 23,
    location: 'Lagos, Nigeria',
    previous_location: 'California, USA',
  },
  decision: 'DECLINE',
  confidence: 0.92,
  risk_score: 87.5,
  reasoning: 'High-risk transaction detected: New user account (8 days), first transaction with high amount ($7,500), unusual merchant with low rating and multiple fraud reports, suspicious location change from USA to Nigeria, transaction at odd hours (3:45 AM).',
  analyzer_results: {
    PatternDetector: {
      name: 'PatternDetector',
      risk_score: 85,
      findings: [
        'First transaction on new account (high risk)',
        'Unusually high transaction amount for new user',
        'Transaction pattern matches known fraud signatures',
      ],
      recommendation: 'DECLINE',
      confidence: 0.88,
      reasoning: 'New account with high-value first transaction raises red flags',
    },
    BehavioralAnalyzer: {
      name: 'BehavioralAnalyzer',
      risk_score: 92,
      findings: [
        'User age only 8 days (very new account)',
        'No transaction history to establish normal behavior',
        'Sudden high-value transaction anomaly',
      ],
      recommendation: 'DECLINE',
      confidence: 0.95,
      reasoning: 'Behavioral patterns indicate likely fraudulent activity',
    },
    VelocityChecker: {
      name: 'VelocityChecker',
      risk_score: 78,
      findings: [
        'First transaction with no velocity data',
        'Amount significantly higher than typical first transactions',
      ],
      recommendation: 'DECLINE',
      confidence: 0.82,
      reasoning: 'Transaction velocity outside normal parameters',
    },
    MerchantRiskAnalyzer: {
      name: 'MerchantRiskAnalyzer',
      risk_score: 94,
      findings: [
        'Merchant rating very low (2.1/5.0)',
        '23 fraud reports associated with this merchant',
        'Merchant in high-risk category (cryptocurrency exchange)',
      ],
      recommendation: 'DECLINE',
      confidence: 0.97,
      reasoning: 'Merchant has extremely high fraud risk profile',
    },
    GeographicAnalyzer: {
      name: 'GeographicAnalyzer',
      risk_score: 88,
      findings: [
        'Drastic location change: California, USA → Lagos, Nigeria',
        'Transaction in high-risk geographic region',
        'Transaction time suspicious for location (3:45 AM)',
      ],
      recommendation: 'DECLINE',
      confidence: 0.91,
      reasoning: 'Geographic anomalies suggest potential account takeover',
    },
  },
  risk_breakdown: {
    PatternDetector: { score: 85, contribution: 0.18, findings_count: 3 },
    BehavioralAnalyzer: { score: 92, contribution: 0.22, findings_count: 3 },
    VelocityChecker: { score: 78, contribution: 0.15, findings_count: 2 },
    MerchantRiskAnalyzer: { score: 94, contribution: 0.24, findings_count: 3 },
    GeographicAnalyzer: { score: 88, contribution: 0.21, findings_count: 3 },
  },
  timestamp: new Date().toISOString(),
};


function LiveTest() {
  const [transaction, setTransaction] = useState<Partial<Transaction>>({});
  const [modes, setModes] = useState<('vanilla' | 'offline_ace' | 'online_ace')[]>(['online_ace']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleAnalyze = async () => {
    // Functionality removed - button does nothing
  };


  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/json') {
      setError('Please upload a valid JSON file');
      return;
    }

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Add artificial delay to show loading animation
        setTimeout(() => {
          setTransaction(jsonData);
          setResult(null);
          setError(null);
          setIsUploading(false);
        }, 2000); // 2 second delay
        
      } catch (err) {
        setTimeout(() => {
          setError('Invalid JSON format');
          setIsUploading(false);
        }, 1000); // 1 second delay for errors
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const clearTransaction = () => {
    setTransaction({});
    setResult(null);
    setError(null);
  };

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#171717',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '2.5rem' }}>🧪</span>
          Live Transaction Test
        </h1>
        <p style={{ fontSize: '1.0625rem', color: '#737373', fontWeight: 400 }}>
          Test the multi-agent fraud detection system in real-time with custom or example transactions
        </p>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* JSON Upload Area */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f5f5f5'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', margin: 0 }}>
              Upload Transaction Data
            </h2>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragOver ? '#3b82f6' : '#d4d4d4'}`,
              borderRadius: '0.75rem',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: isDragOver ? '#eff6ff' : '#fafafa',
              transition: 'all 0.2s',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".json"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {isDragOver ? '📁' : (transaction && Object.keys(transaction).length > 0 ? '✅' : '📄')}
            </div>
            
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#171717', 
              marginBottom: '0.5rem' 
            }}>
              {isDragOver 
                ? 'Drop JSON file here' 
                : (transaction && Object.keys(transaction).length > 0 
                  ? 'Upload New JSON File' 
                  : 'Upload Transaction JSON')
              }
            </h3>
            
            <p style={{ 
              color: '#737373', 
              marginBottom: '1.5rem',
              fontSize: '0.9375rem'
            }}>
              {transaction && Object.keys(transaction).length > 0 
                ? 'Replace current file or upload a new one'
                : 'Drag and drop a JSON file or click to browse'
              }
            </p>

            <button
              type="button"
              style={{
                padding: '0.75rem 1.5rem',
                background: transaction && Object.keys(transaction).length > 0 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = transaction && Object.keys(transaction).length > 0
                  ? '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                  : '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {transaction && Object.keys(transaction).length > 0 ? 'Choose New File' : 'Choose File'}
            </button>

            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.8125rem', 
              color: '#a3a3a3',
              marginBottom: transaction && Object.keys(transaction).length > 0 ? '1rem' : '0'
            }}>
              Accepted format: .json
            </div>

            {/* Clear Button - Only show when file is loaded */}
            {transaction && Object.keys(transaction).length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the file input
                  clearTransaction();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: '#ef4444',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.borderColor = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#fecaca';
                }}
              >
                🗑️ Clear Current File
              </button>
            )}
          </div>


          {/* Current Transaction Display */}
          {isUploading && (
            <div style={{
              marginTop: '1.5rem',
              padding: '2rem',
              background: '#f8fafc',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '1.5rem'
              }}>
                📄
              </div>
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: '#475569',
                marginBottom: '1rem'
              }}>
                Processing JSON...
              </div>
              
              {/* Loading Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6)',
                  backgroundSize: '200% 100%',
                  borderRadius: '4px',
                  animation: 'loadingBar 2s ease-in-out infinite',
                  width: '100%'
                }}></div>
              </div>
              
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#64748b'
              }}>
                Please wait while we load your data
              </div>
            </div>
          )}

          {transaction && Object.keys(transaction).length > 0 && !isUploading && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: '#f8fafc',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: '#475569', 
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>📋</span>
                Current Transaction
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#374151',
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                overflow: 'auto',
                maxHeight: '300px',
                lineHeight: '1.6'
              }}>
                <pre style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                }}>
                  {JSON.stringify(transaction, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f5f5f5'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '1.5rem' }}>
            Analysis Modes
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '1.5rem' }}>
            Select one or more analysis modes to compare results
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { value: 'vanilla', label: 'Vanilla Agent', desc: 'No learning', icon: '⚙️' },
              { value: 'offline_ace', label: 'Offline ACE', desc: 'Pre-trained', icon: '📚' },
              { value: 'online_ace', label: 'Online ACE', desc: 'Real-time learning', icon: '🚀' },
            ].map((m) => {
              const isSelected = modes.includes(m.value as any);
              return (
                <label key={m.value} style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    value={m.value}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setModes([...modes, m.value as any]);
                      } else {
                        setModes(modes.filter(mode => mode !== m.value));
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    padding: '1.25rem',
                    border: `2px solid ${isSelected ? '#3b82f6' : '#e5e5e5'}`,
                    borderRadius: '0.75rem',
                    background: isSelected ? '#eff6ff' : '#fafafa',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '20px',
                        height: '20px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'white'
                      }}>
                        ✓
                      </div>
                    )}
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{m.icon}</div>
                    <div style={{ fontWeight: 600, color: '#171717', marginBottom: '0.25rem' }}>{m.label}</div>
                    <div style={{ fontSize: '0.875rem', color: '#737373' }}>{m.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
          {modes.length === 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              color: '#991b1b',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              ⚠️ Please select at least one analysis mode
            </div>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        style={{
          width: '100%',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '0.75rem',
          fontSize: '1.0625rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.2s',
          marginBottom: '2rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>▶</span>
        Run Analysis
      </button>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes loadingBar {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>

      {/* Error */}
      {error && (
        <div style={{
          padding: '1rem 1.5rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.75rem',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          fontSize: '0.9375rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          {/* Final Decision Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f5f5f5',
            borderLeft: `4px solid ${result.decision === 'APPROVE' ? '#10b981' : '#ef4444'}`,
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  background: result.decision === 'APPROVE' 
                    ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
                    : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '2rem' }}>{result.decision === 'APPROVE' ? '✅' : '⛔'}</span>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: result.decision === 'APPROVE' ? '#065f46' : '#991b1b'
                  }}>
                    {result.decision}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '0.25rem' }}>Confidence</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717' }}>
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '0.25rem' }}>Risk Score</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: result.risk_score >= 50 ? '#ef4444' : '#10b981' }}>
                      {result.risk_score.toFixed(1)}/100
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#525252', marginBottom: '0.75rem' }}>
                  💡 Analysis Reasoning
                </div>
                <p style={{ color: '#525252', lineHeight: 1.7, margin: 0 }}>{result.reasoning}</p>
              </div>
            </div>
          </div>

          {/* Agent Scores Overview */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f5f5f5',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '1.5rem' }}>
              📊 Agent Risk Scores
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Object.entries(result.analyzer_results).map(([name, analysis]) => (
                <AgentScoreBar key={name} name={name} analysis={analysis} />
              ))}
            </div>
          </div>

          {/* Detailed Agent Analysis Cards */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '1.5rem' }}>
              🔍 Detailed Agent Analysis
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: '1.5rem'
            }}>
              {Object.entries(result.analyzer_results).map(([name, analysis]) => (
                <AgentAnalysisCard key={name} name={name} analysis={analysis} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default LiveTest;
