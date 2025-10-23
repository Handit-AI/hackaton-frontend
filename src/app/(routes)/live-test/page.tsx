// Live Test page component - ACE Modes Comparison
// Compares Vanilla Agent vs Offline ACE vs Online ACE in real-time streaming

'use client';

import { useState } from 'react';
import { FraudAnalysisResult, Transaction } from '../../../types';
import { Upload, Play, BarChart3, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Mock results for different ACE modes
const generateMockResult = (
  transaction: Transaction,
  mode: 'vanilla' | 'offline_ace' | 'online_ace'
): FraudAnalysisResult => {
  const isFraudulent = transaction.user_id === 'sketchy_alice';
  
  // Different accuracy levels per mode
  const modeConfig = {
    vanilla: { baseAccuracy: 0.60, riskMultiplier: 0.7 },
    offline_ace: { baseAccuracy: 0.80, riskMultiplier: 0.9 },
    online_ace: { baseAccuracy: 0.90, riskMultiplier: 1.0 }
  };

  const config = modeConfig[mode];
  const baseRisk = isFraudulent ? 87.5 : 15.2;
  const risk_score = baseRisk * config.riskMultiplier;
  const decision = risk_score > 50 ? 'DECLINE' : 'APPROVE';

  return {
    transaction,
    decision: decision as 'APPROVE' | 'DECLINE',
    confidence: config.baseAccuracy + (Math.random() * 0.1),
    risk_score,
    reasoning: isFraudulent
      ? `High-risk transaction detected with ${mode.replace('_', ' ').toUpperCase()}: New user account, high transaction amount, suspicious merchant activity, and unusual geographic patterns.`
      : `Low-risk transaction validated by ${mode.replace('_', ' ').toUpperCase()}: Established user account, consistent transaction history, reputable merchant, and normal geographic patterns.`,
    analyzer_results: {
      PatternDetector: {
        name: 'PatternDetector',
        risk_score: isFraudulent ? 85 * config.riskMultiplier : 12,
        findings: isFraudulent
          ? ['First transaction on new account', 'Unusually high transaction amount', 'Pattern matches fraud signatures']
          : ['Consistent transaction pattern', 'Amount within normal range', 'No suspicious patterns'],
        recommendation: risk_score > 50 ? 'DECLINE' : 'APPROVE',
        confidence: config.baseAccuracy,
        reasoning: 'Pattern analysis complete',
      },
      BehavioralAnalyzer: {
        name: 'BehavioralAnalyzer',
        risk_score: isFraudulent ? 92 * config.riskMultiplier : 8,
        findings: isFraudulent
          ? ['Very new account (8 days)', 'No transaction history', 'Sudden high-value anomaly']
          : ['Well-established account', 'Strong transaction history', 'Consistent behavior'],
        recommendation: risk_score > 50 ? 'DECLINE' : 'APPROVE',
        confidence: config.baseAccuracy + 0.05,
        reasoning: 'Behavioral analysis complete',
      },
      VelocityChecker: {
        name: 'VelocityChecker',
        risk_score: isFraudulent ? 78 * config.riskMultiplier : 18,
        findings: isFraudulent
          ? ['First transaction with no velocity data', 'Amount significantly higher than typical']
          : ['Transaction velocity within normal parameters', 'Amount consistent with history'],
        recommendation: risk_score > 50 ? 'DECLINE' : 'APPROVE',
        confidence: config.baseAccuracy - 0.05,
        reasoning: 'Velocity check complete',
      },
      MerchantRiskAnalyzer: {
        name: 'MerchantRiskAnalyzer',
        risk_score: isFraudulent ? 94 * config.riskMultiplier : 5,
        findings: isFraudulent
          ? ['Merchant rating very low (2.1/5.0)', '23 fraud reports', 'High-risk category']
          : ['Excellent merchant rating (4.8/5.0)', 'No fraud reports', 'Reputable merchant'],
        recommendation: risk_score > 50 ? 'DECLINE' : 'APPROVE',
        confidence: config.baseAccuracy + 0.08,
        reasoning: 'Merchant risk analysis complete',
      },
      GeographicAnalyzer: {
        name: 'GeographicAnalyzer',
        risk_score: isFraudulent ? 88 * config.riskMultiplier : 10,
        findings: isFraudulent
          ? ['Drastic location change', 'High-risk geographic region', 'Suspicious transaction time']
          : ['Location consistent', 'Appropriate transaction time', 'No geographic anomalies'],
        recommendation: risk_score > 50 ? 'DECLINE' : 'APPROVE',
        confidence: config.baseAccuracy + 0.02,
        reasoning: 'Geographic analysis complete',
      },
    },
    risk_breakdown: {
      PatternDetector: { score: isFraudulent ? 85 * config.riskMultiplier : 12, contribution: 0.20, findings_count: 3 },
      BehavioralAnalyzer: { score: isFraudulent ? 92 * config.riskMultiplier : 8, contribution: 0.22, findings_count: 3 },
      VelocityChecker: { score: isFraudulent ? 78 * config.riskMultiplier : 18, contribution: 0.20, findings_count: 2 },
      MerchantRiskAnalyzer: { score: isFraudulent ? 94 * config.riskMultiplier : 5, contribution: 0.18, findings_count: 3 },
      GeographicAnalyzer: { score: isFraudulent ? 88 * config.riskMultiplier : 10, contribution: 0.20, findings_count: 3 },
    },
    timestamp: new Date().toISOString(),
  };
};

type ModeResult = {
  mode: 'vanilla' | 'offline_ace' | 'online_ace';
  status: 'pending' | 'analyzing' | 'streaming' | 'complete';
  result: FraudAnalysisResult | null;
  progress: number;
  streamingAgents: string[];
  currentAgent: string | null;
};

function LiveTest() {
  const [transaction, setTransaction] = useState<Partial<Transaction>>({});
  const [modes, setModes] = useState<('vanilla' | 'offline_ace' | 'online_ace')[]>(['online_ace']);
  const [modeResults, setModeResults] = useState<ModeResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!transaction || Object.keys(transaction).length === 0) {
      setError('Please upload a JSON file first');
      return;
    }

    if (modes.length === 0) {
      setError('Please select at least one analysis mode');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const agentNames = ['PatternDetector', 'BehavioralAnalyzer', 'VelocityChecker', 'MerchantRiskAnalyzer', 'GeographicAnalyzer'];

    // Initialize mode results
    const initialResults: ModeResult[] = modes.map(mode => ({
      mode,
      status: 'pending',
      result: null,
      progress: 0,
      streamingAgents: [],
      currentAgent: null,
    }));
    setModeResults(initialResults);

    // Generate all results upfront
    const allFullResults = modes.map(mode => ({
      mode,
      result: generateMockResult(transaction as Transaction, mode)
    }));

    // Start all modes simultaneously (initial phase)
    await new Promise(resolve => setTimeout(resolve, 200));
    setModeResults(prev => prev.map(r => ({ ...r, status: 'analyzing', progress: 10 })));

    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Start streaming all modes in parallel
    setModeResults(prev => prev.map(r => ({ ...r, status: 'streaming', progress: 20 })));

    // Stream each agent across all modes in parallel
    for (let agentIdx = 0; agentIdx < agentNames.length; agentIdx++) {
      const agentName = agentNames[agentIdx];
      const progress = 20 + ((agentIdx + 1) / agentNames.length) * 70; // 20% to 90%

      // Show current agent being analyzed across all modes
      setModeResults(prev => prev.map(r => ({
        ...r,
        currentAgent: agentName,
        progress: Math.floor(progress)
      })));

      await new Promise(resolve => setTimeout(resolve, 500));

      // Add agent to completed list for all modes
      const streamedAgents = agentNames.slice(0, agentIdx + 1);
      
      setModeResults(prev => prev.map((r, idx) => {
        const fullResult = allFullResults[idx].result;
        const partialResult: FraudAnalysisResult = {
          ...fullResult,
          analyzer_results: Object.fromEntries(
            streamedAgents.map(name => [
              name,
              fullResult.analyzer_results[name as keyof typeof fullResult.analyzer_results]
            ])
          ) as any,
        };

        return {
          ...r,
          streamingAgents: streamedAgents,
          result: partialResult,
          progress: Math.floor(progress)
        };
      }));

      await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Finalize all modes with decision
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setModeResults(prev => prev.map((r, idx) => ({
      ...r,
      status: 'complete',
      result: allFullResults[idx].result,
      progress: 100,
      currentAgent: null,
      streamingAgents: agentNames
    })));

    setIsAnalyzing(false);
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
        
        setTimeout(() => {
          setTransaction(jsonData);
          setModeResults([]);
          setError(null);
          setIsUploading(false);
        }, 1000);
        
      } catch (err) {
        setTimeout(() => {
          setError('Invalid JSON format');
          setIsUploading(false);
        }, 500);
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

    const files = e.dataTransfer.files;
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
    setModeResults([]);
    setError(null);
  };

  const getModeLabel = (mode: string) => {
    const labels = {
      vanilla: 'Vanilla Agent',
      offline_ace: 'Offline ACE',
      online_ace: 'Online ACE',
    };
    return labels[mode as keyof typeof labels];
  };

  const getModeDescription = (mode: string) => {
    const descriptions = {
      vanilla: 'Baseline performance without learning capabilities (~55-65% accuracy)',
      offline_ace: 'Pre-trained on historical fraud data (~75-85% accuracy)',
      online_ace: 'Real-time learning and adaptation (~85-90% accuracy)',
    };
    return descriptions[mode as keyof typeof descriptions];
  };

  return (
    <div className="container" style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          color: '#171717', 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <BarChart3 size={36} strokeWidth={2.5} color="#3b82f6" />
          ACE Mode Comparison
        </h1>
        <p style={{ color: '#737373', fontSize: '1.125rem' }}>
          Compare fraud detection performance across Vanilla Agent, Offline ACE, and Online ACE modes
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
        {/* Left Panel - Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Upload Section */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f5f5f5'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '1.5rem' }}>
              Transaction Data
            </h2>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragOver ? '#3b82f6' : '#d4d4d4'}`,
                borderRadius: '0.75rem',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: isDragOver ? '#eff6ff' : '#fafafa',
                transition: 'all 0.2s',
                cursor: 'pointer',
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
              
              <Upload 
                size={32} 
                color={isDragOver ? '#3b82f6' : (transaction && Object.keys(transaction).length > 0 ? '#10b981' : '#737373')} 
                strokeWidth={1.5}
                style={{ margin: '0 auto 1rem' }}
              />
              
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: '#171717', 
                marginBottom: '0.5rem' 
              }}>
                {isDragOver 
                  ? 'Drop JSON file here' 
                  : (transaction && Object.keys(transaction).length > 0 
                    ? 'Upload New Transaction' 
                    : 'Upload Transaction JSON')
                }
              </h3>
              
              <p style={{ 
                color: '#737373', 
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {transaction && Object.keys(transaction).length > 0 
                  ? 'Replace current transaction data'
                  : 'Drag and drop or click to browse'
                }
              </p>

              <button
                type="button"
                style={{
                  padding: '0.625rem 1.25rem',
                  background: transaction && Object.keys(transaction).length > 0 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {transaction && Object.keys(transaction).length > 0 ? 'Choose New File' : 'Choose File'}
              </button>

              <div style={{ 
                marginTop: '0.75rem', 
                fontSize: '0.75rem', 
                color: '#a3a3a3'
              }}>
                Accepted format: .json
              </div>

              {transaction && Object.keys(transaction).length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearTransaction();
                  }}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <XCircle size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Clear Transaction
                </button>
              )}
            </div>

            {/* Loading State */}
            {isUploading && (
              <div style={{
                marginTop: '1rem',
                padding: '1.5rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <Upload size={32} color="#3b82f6" strokeWidth={1.5} style={{ margin: '0 auto 0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                  Processing JSON...
                </div>
                <div style={{ 
                  width: '100%',
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '0.75rem'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6)',
                    backgroundSize: '200% 100%',
                    borderRadius: '3px',
                    animation: 'loadingBar 2s ease-in-out infinite',
                    width: '100%'
                  }}></div>
                </div>
              </div>
            )}

            {/* Transaction Preview */}
            {transaction && Object.keys(transaction).length > 0 && !isUploading && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#475569', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle size={14} color="#10b981" />
                  Transaction Loaded
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#64748b',
                  fontFamily: 'monospace',
                  background: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  overflow: 'auto',
                  maxHeight: '150px',
                  lineHeight: '1.4'
                }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '0.75rem' }}>
              Analysis Modes
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '1.5rem' }}>
              Select one or more modes to compare
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { value: 'vanilla', label: 'Vanilla Agent', icon: TrendingUp },
                { value: 'offline_ace', label: 'Offline ACE', icon: BarChart3 },
                { value: 'online_ace', label: 'Online ACE', icon: TrendingUp },
              ].map((m) => {
                const isSelected = modes.includes(m.value as any);
                const Icon = m.icon;
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
                      padding: '1rem',
                      border: `2px solid ${isSelected ? '#3b82f6' : '#e5e5e5'}`,
                      borderRadius: '0.75rem',
                      background: isSelected ? '#eff6ff' : 'white',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}>
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          width: '18px',
                          height: '18px',
                          background: '#3b82f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckCircle size={12} color="white" strokeWidth={3} />
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Icon size={16} color={isSelected ? '#3b82f6' : '#737373'} strokeWidth={2} />
                        <div style={{ fontWeight: 600, color: '#171717', fontSize: '0.9375rem' }}>{m.label}</div>
                      </div>
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
                fontSize: '0.8125rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={14} color="#991b1b" />
                <span style={{ color: '#991b1b' }}>Select at least one mode</span>
              </div>
            )}
          </div>

          {/* Run Analysis Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !transaction || Object.keys(transaction).length === 0 || modes.length === 0}
            style={{
              width: '100%',
              padding: '1.125rem',
              background: isAnalyzing || !transaction || Object.keys(transaction).length === 0 || modes.length === 0
                ? '#9ca3af'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isAnalyzing || !transaction || Object.keys(transaction).length === 0 || modes.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: isAnalyzing || !transaction || Object.keys(transaction).length === 0 || modes.length === 0
                ? 'none'
                : '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s',
              opacity: isAnalyzing || !transaction || Object.keys(transaction).length === 0 || modes.length === 0 ? 0.6 : 1
            }}
          >
            <Play size={20} fill="white" />
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </button>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.75rem',
              color: '#991b1b',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
        </div>

        {/* Right Panel - Results Comparison */}
        <div style={{ minHeight: '600px' }}>
          {modeResults.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '4rem 2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f5f5f5',
              textAlign: 'center',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={64} color="#d4d4d4" strokeWidth={1.5} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#525252', marginBottom: '0.75rem' }}>
                Ready to Compare
              </h3>
              <p style={{ color: '#737373', fontSize: '1rem', maxWidth: '400px' }}>
                Upload a transaction JSON file, select your analysis modes, and run the comparison to see how different ACE approaches detect fraud.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {modeResults.map((modeResult, index) => (
                <ModeComparisonCard 
                  key={index}
                  modeResult={modeResult}
                  getModeLabel={getModeLabel}
                  getModeDescription={getModeDescription}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes loadingBar {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

// Mode Comparison Card Component
function ModeComparisonCard({ 
  modeResult, 
  getModeLabel, 
  getModeDescription 
}: { 
  modeResult: ModeResult;
  getModeLabel: (mode: string) => string;
  getModeDescription: (mode: string) => string;
}) {
  const { mode, status, result, progress, streamingAgents, currentAgent } = modeResult;
  
  const getStatusColor = () => {
    if (status === 'complete' && result) {
      return result.decision === 'APPROVE' ? '#10b981' : '#ef4444';
    }
    return '#3b82f6';
  };

  const getStatusIcon = () => {
    if (status === 'analyzing') return <TrendingUp size={20} color="#3b82f6" />;
    if (status === 'complete' && result) {
      return result.decision === 'APPROVE' 
        ? <CheckCircle size={20} color="#10b981" />
        : <XCircle size={20} color="#ef4444" />;
    }
    return <BarChart3 size={20} color="#737373" />;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `2px solid ${status === 'complete' ? getStatusColor() : '#f5f5f5'}`,
      transition: 'all 0.3s'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {getStatusIcon()}
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', margin: 0 }}>
              {getModeLabel(mode)}
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#737373', margin: 0 }}>
            {getModeDescription(mode)}
          </p>
        </div>
        {status === 'complete' && result && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '0.25rem' }}>
              Confidence
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getStatusColor() }}>
              {(result.confidence * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {(status === 'analyzing' || status === 'streaming') && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#737373', marginBottom: '0.5rem' }}>
            <span>
              {status === 'analyzing' 
                ? 'Initializing analysis...'
                : currentAgent 
                  ? `Analyzing: ${currentAgent}`
                  : 'Processing agents...'}
            </span>
            <span>{progress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              borderRadius: '4px',
              transition: 'width 0.3s ease-out'
            }}></div>
          </div>
          {status === 'streaming' && streamingAgents.length > 0 && (
            <div style={{ 
              marginTop: '0.75rem', 
              fontSize: '0.75rem', 
              color: '#525252',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {['PatternDetector', 'BehavioralAnalyzer', 'VelocityChecker', 'MerchantRiskAnalyzer', 'GeographicAnalyzer'].map(agent => (
                <span 
                  key={agent}
                  style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: '0.375rem',
                    background: streamingAgents.includes(agent) 
                      ? '#10b981' 
                      : currentAgent === agent 
                        ? '#3b82f6'
                        : '#e5e7eb',
                    color: streamingAgents.includes(agent) || currentAgent === agent ? 'white' : '#737373',
                    fontWeight: currentAgent === agent ? 600 : 400,
                    transition: 'all 0.3s'
                  }}
                >
                  {agent === currentAgent && '⟳ '}
                  {agent.replace(/([A-Z])/g, ' $1').trim()}
                  {streamingAgents.includes(agent) && agent !== currentAgent && ' ✓'}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results - Show during streaming and when complete */}
      {(status === 'streaming' || status === 'complete') && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Decision Banner - Only show when complete */}
          {status === 'complete' && (
            <div style={{
              padding: '1.5rem',
              background: result.decision === 'APPROVE' 
                ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderRadius: '0.75rem',
              border: `2px solid ${result.decision === 'APPROVE' ? '#10b981' : '#ef4444'}`,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {result.decision === 'APPROVE' 
                  ? <CheckCircle size={32} color="#10b981" strokeWidth={2.5} />
                  : <XCircle size={32} color="#ef4444" strokeWidth={2.5} />
                }
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 800, 
                  color: result.decision === 'APPROVE' ? '#10b981' : '#ef4444'
                }}>
                  {result.decision}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', color: '#737373' }}>Risk Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
                  {result.risk_score.toFixed(1)}
                </div>
              </div>
            </div>
            <div style={{ 
              fontSize: '0.9375rem', 
              color: result.decision === 'APPROVE' ? '#166534' : '#991b1b',
              lineHeight: 1.6 
            }}>
              {result.reasoning}
            </div>
          </div>
          )}

          {/* Agent Scores - Show as they stream in */}
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#171717', marginBottom: '1rem' }}>
              Agent Risk Scores {status === 'streaming' && `(${Object.keys(result.analyzer_results).length}/5)`}
            </h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {Object.entries(result.analyzer_results).map(([name, analysis], idx) => (
                <div key={name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: currentAgent === name ? '#eff6ff' : '#fafafa',
                  borderRadius: '0.5rem',
                  border: `1px solid ${currentAgent === name ? '#3b82f6' : '#e5e5e5'}`,
                  animation: 'slideIn 0.3s ease-out',
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'backwards'
                }}>
                  <div style={{ flex: '0 0 180px', fontSize: '0.875rem', fontWeight: 600, color: '#171717' }}>
                    {name}
                  </div>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${analysis.risk_score}%`,
                        background: analysis.risk_score >= 75 
                          ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                          : analysis.risk_score >= 50
                          ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                          : 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-out'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ flex: '0 0 60px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                    {analysis.risk_score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Findings - Only show when complete */}
          {status === 'complete' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#171717', marginBottom: '1rem' }}>
              Key Findings
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {Object.entries(result.analyzer_results).slice(0, 3).map(([name, analysis]) => (
                <div key={name} style={{
                  padding: '1rem',
                  background: '#fafafa',
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e5e5'
                }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#737373', marginBottom: '0.5rem' }}>
                    {name}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#525252', lineHeight: 1.6 }}>
                    {analysis.findings.slice(0, 2).map((finding, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem' }}>{finding}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LiveTest;
