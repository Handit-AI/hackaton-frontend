# Oliver's Implementation Guide: Frontend & Visualization Lead

**Role:** Frontend Developer + Data Visualization  
**Time:** 7 hours  
**Responsibility:** Build interactive demo UI for multi-agent fraud detection with ACE experiments  
**Reports to:** Cristhian (Algorithm & Infrastructure Lead)

---

## Executive Summary

You are building the **judge-facing interface** for a multi-agent fraud detection system with Agentic Context Engineering (ACE). Your UI will be the main demo tool, allowing judges to:

1. Test individual transactions in real-time (see all 5 agents work in parallel)
2. Run full experiments comparing: **Vanilla Agent** vs **Offline ACE** vs **Online ACE**
3. Visualize learning curves and performance metrics
4. Explore the playbook and see what the system learned

**Your work is what judges remember!** Make it impressive, intuitive, and visually stunning.

---

## System Overview

### What You're Building

**4 Main Pages:**

```
┌────────────────────────────────────────┐
│         Navigation Bar                 │
│  🏠 Home | 🧪 Live Test |             │
│  📊 Experiments | 📖 Playbook          │
└────────────────────────────────────────┘
```

1. **Home** - Landing page with system overview + quick stats
2. **Live Test** - Real-time transaction analysis (main demo interface)
3. **Experiments** - Run full dataset comparisons (Vanilla vs ACE modes)
4. **Playbook** - Explore learned insights (bullets) by node

---

## Deliverables Checklist

By end of 7 hours, you must have:

- [ ] **Home page** - Hero section + system overview
- [ ] **Live Test page** - Multi-agent real-time analysis UI
- [ ] **Experiments page** - 3-mode comparison runner
- [ ] **Playbook page** - Node-by-node insights explorer
- [ ] **API integration** - All Cristhian's endpoints connected
- [ ] **Charts** - Accuracy curves, agent scores, learning progress
- [ ] **Responsive design** - Works on laptop + projector
- [ ] **Polish** - Loading states, animations, error handling

---

## The 3 ACE Modes (Key Concept)

Judges will compare these three modes:

| Mode | Description | What It Shows |
|------|-------------|---------------|
| **Vanilla Agent** | No ACE, no learning | Baseline performance (~55-65% accuracy) |
| **Offline ACE** | Pre-trained on dataset | ACE with historical data (~75-85% accuracy) |
| **Online ACE** | Learns during test | ACE adapting in real-time (~70-80% → 85%+) |

**Your job:** Make these differences **visually obvious** in the UI

---

## Hour-by-Hour Implementation Plan

### **HOUR 0:00 - 1:30 | Setup + Home Page**

#### Task 1: Project Setup (20 minutes)

```bash
# Create Next.js app
npx create-next-app@latest ace-fraud-detection --typescript --tailwind --app

cd ace-fraud-detection

# Install dependencies
npm install axios recharts framer-motion lucide-react @tanstack/react-query
```

**Project structure:**
```
ace-fraud-detection/
├── app/
│   ├── page.tsx                    (Home)
│   ├── layout.tsx                  (Root + Nav)
│   └── (routes)/
│       ├── live-test/page.tsx
│       ├── experiments/page.tsx
│       └── playbook/page.tsx
├── components/
│   ├── ui/                         (Reusable UI)
│   └── features/
│       ├── AgentAnalysisCard.tsx   (Shows 1 agent's result)
│       ├── AgentScoreBar.tsx       (Horizontal score bar)
│       ├── ComparisonChart.tsx     (3-line chart)
│       ├── BulletCard.tsx          (Playbook bullet)
│       └── ExperimentRunner.tsx    (Experiment controller)
├── lib/
│   └── api.ts                      (API client)
└── types/
    └── index.ts                    (TypeScript types)
```

#### Task 2: TypeScript Types (15 minutes)

Create `types/index.ts`:

```typescript
// types/index.ts

// Agent analysis result for one node
export interface AgentAnalysis {
  name: string; // "PatternDetector", "BehavioralAnalyzer", etc.
  risk_score: number; // 0-100
  findings: string[];
  recommendation: "APPROVE" | "DECLINE";
  confidence: number; // 0.0-1.0
  reasoning: string;
}

// Complete multi-agent result
export interface FraudAnalysisResult {
  transaction: Transaction;
  decision: "APPROVE" | "DECLINE";
  confidence: number;
  risk_score: number;
  reasoning: string;
  analyzer_results: {
    PatternDetector: AgentAnalysis;
    BehavioralAnalyzer: AgentAnalysis;
    VelocityChecker: AgentAnalysis;
    MerchantRiskAnalyzer: AgentAnalysis;
    GeographicAnalyzer: AgentAnalysis;
  };
  risk_breakdown: {
    [key: string]: {
      score: number;
      contribution: number;
      findings_count: number;
    };
  };
  timestamp: string;
}

// Transaction input
export interface Transaction {
  user_id: string;
  user_age_days: number;
  total_transactions: number;
  amount: number;
  time: string;
  merchant: string;
  merchant_rating: number;
  merchant_fraud_reports: number;
  location: string;
  previous_location?: string;
}

// Experiment result (for comparison)
export interface ExperimentResult {
  mode: "vanilla" | "offline_ace" | "online_ace";
  problems_processed: number;
  final_accuracy: number;
  iteration_metrics: IterationMetric[];
  playbook_size: number;
  execution_time: number;
}

export interface IterationMetric {
  iteration: number;
  accuracy: number;
  playbook_size: number;
  is_correct: boolean;
}

// Playbook bullet
export interface Bullet {
  id: string;
  content: string;
  node: string; // Which analyzer node uses this
  helpful_count: number;
  harmful_count: number;
  success_rate: number;
  times_selected: number;
  created_at: string;
}
```

#### Task 3: API Client (20 minutes)

Create `lib/api.ts`:

```typescript
// lib/api.ts

import axios from 'axios';
import { FraudAnalysisResult, Transaction, ExperimentResult, Bullet } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Analyze single transaction
export const analyzeTransaction = async (
  transaction: Transaction,
  mode: 'vanilla' | 'offline_ace' | 'online_ace' = 'online_ace'
): Promise<FraudAnalysisResult> => {
  const response = await api.post('/api/v1/analyze', {
    transaction,
    mode,
  });
  return response.data;
};

// Run full experiment
export const runExperiment = async (
  mode: 'vanilla' | 'offline_ace' | 'online_ace'
): Promise<ExperimentResult> => {
  const response = await api.post('/api/v1/train', { mode });
  return response.data;
};

// Get playbook by node
export const getPlaybookByNode = async (node: string): Promise<Bullet[]> => {
  const response = await api.get(`/api/v1/playbook/${node}`);
  return response.data;
};

// Get all playbook stats
export const getPlaybookStats = async () => {
  const response = await api.get('/api/v1/playbook/stats');
  return response.data;
};
```

#### Task 4: Home Page (35 minutes)

Create `app/page.tsx`:

```typescript
// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Brain, TrendingUp, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Multi-Agent Fraud Detection
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            with Agentic Context Engineering (ACE)
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            5 specialized AI agents working in parallel, continuously learning from every transaction
          </p>
        </div>

        {/* System Architecture Diagram */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">System Architecture</h2>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-100 rounded-lg px-6 py-3 text-blue-900 font-semibold">
                Transaction Input
              </div>
            </div>
            <div className="flex justify-center">
              <div className="text-gray-400 text-2xl">↓</div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {['Pattern', 'Behavioral', 'Velocity', 'Merchant', 'Geographic'].map((name) => (
                <div key={name} className="bg-purple-100 rounded-lg px-3 py-4 text-center">
                  <div className="text-xs font-semibold text-purple-900">{name}</div>
                  <div className="text-xs text-purple-600 mt-1">Analyzer</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="text-gray-400 text-2xl">↓</div>
            </div>
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-lg px-6 py-3 text-green-900 font-semibold">
                Final Decision: APPROVE / DECLINE
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<Brain className="w-10 h-10" />}
            title="5 Specialized Agents"
            description="Each agent focuses on one fraud detection domain: patterns, behavior, velocity, merchants, geography"
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10" />}
            title="Continuous Learning"
            description="ACE system learns from every transaction, building a playbook of fraud detection insights"
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10" />}
            title="Parallel Execution"
            description="All agents analyze simultaneously for sub-2-second response time"
          />
        </div>

        {/* ACE Modes Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">ACE Learning Modes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ModeCard
              title="Vanilla Agent"
              description="No learning, baseline performance"
              accuracy="55-65%"
              color="gray"
            />
            <ModeCard
              title="Offline ACE"
              description="Pre-trained on historical data"
              accuracy="75-85%"
              color="blue"
            />
            <ModeCard
              title="Online ACE"
              description="Learns in real-time during operation"
              accuracy="85-90%"
              color="green"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/live-test')}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
          >
            Try Live Test
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/experiments')}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg"
          >
            Run Experiments
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ModeCard({ title, description, accuracy, color }: any) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-900',
    blue: 'bg-blue-100 text-blue-900',
    green: 'bg-green-100 text-green-900',
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className={`inline-block px-4 py-2 rounded-lg font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
        {accuracy} accuracy
      </div>
    </div>
  );
}
```

**Checkpoint:** Home page complete with visual architecture

---

### **HOUR 1:30 - 3:30 | Live Test Page (Main Demo Interface)**

This is your **most important page** - the live transaction analyzer.

#### Complete Implementation:

Create `app/(routes)/live-test/page.tsx`:

```typescript
// app/(routes)/live-test/page.tsx
'use client';

import { useState } from 'react';
import { analyzeTransaction } from '@/lib/api';
import { FraudAnalysisResult, Transaction } from '@/types';
import { Loader2, Play, AlertCircle } from 'lucide-react';
import AgentAnalysisCard from '@/components/features/AgentAnalysisCard';
import AgentScoreBar from '@/components/features/AgentScoreBar';

const EXAMPLE_TRANSACTIONS: Transaction[] = [
  {
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
  {
    user_id: 'john_verified',
    user_age_days: 1250,
    total_transactions: 456,
    amount: 180,
    time: '14:30',
    merchant: 'Amazon.com',
    merchant_rating: 4.8,
    merchant_fraud_reports: 0,
    location: 'New York, USA',
    previous_location: 'New York, USA',
  },
];

export default function LiveTestPage() {
  const [transaction, setTransaction] = useState<Partial<Transaction>>({});
  const [mode, setMode] = useState<'vanilla' | 'offline_ace' | 'online_ace'>('online_ace');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!transaction.user_id || !transaction.amount) {
      setError('Please fill required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeTransaction(transaction as Transaction, mode);
      setResult(result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example: Transaction) => {
    setTransaction(example);
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">🧪 Live Transaction Test</h1>
      <p className="text-gray-600 mb-8">
        Test the multi-agent fraud detection system in real-time
      </p>

      {/* Transaction Input Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="User ID"
            value={transaction.user_id || ''}
            onChange={(e) => setTransaction({ ...transaction, user_id: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Amount ($)"
            value={transaction.amount || ''}
            onChange={(e) => setTransaction({ ...transaction, amount: parseFloat(e.target.value) })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="User Age (days)"
            value={transaction.user_age_days || ''}
            onChange={(e) => setTransaction({ ...transaction, user_age_days: parseInt(e.target.value) })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Time (HH:MM)"
            value={transaction.time || ''}
            onChange={(e) => setTransaction({ ...transaction, time: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Merchant"
            value={transaction.merchant || ''}
            onChange={(e) => setTransaction({ ...transaction, merchant: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Location"
            value={transaction.location || ''}
            onChange={(e) => setTransaction({ ...transaction, location: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Example Buttons */}
        <div className="flex gap-2 mt-4">
          {EXAMPLE_TRANSACTIONS.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExample(ex)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
            >
              Example {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Analysis Mode</h2>
        <div className="flex gap-4">
          {[
            { value: 'vanilla', label: 'Vanilla Agent', desc: 'No learning' },
            { value: 'offline_ace', label: 'Offline ACE', desc: 'Pre-trained' },
            { value: 'online_ace', label: 'Online ACE', desc: 'Real-time learning' },
          ].map((m) => (
            <label key={m.value} className="flex-1 cursor-pointer">
              <input
                type="radio"
                value={m.value}
                checked={mode === m.value}
                onChange={(e) => setMode(e.target.value as any)}
                className="sr-only"
              />
              <div
                className={`p-4 border-2 rounded-lg transition ${
                  mode === m.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="font-semibold">{m.label}</div>
                <div className="text-sm text-gray-600">{m.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2 shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Run Analysis
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Final Decision */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`text-4xl font-bold ${
                    result.decision === 'APPROVE' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {result.decision === 'APPROVE' ? '✅ APPROVE' : '⛔ DECLINE'}
                </div>
                <div className="text-sm text-gray-500">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Risk Score</div>
                <div className="text-3xl font-bold text-orange-600">
                  {result.risk_score.toFixed(1)}/100
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Reasoning:</div>
              <p className="text-gray-700 whitespace-pre-line">{result.reasoning}</p>
            </div>
          </div>

          {/* Agent Scores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Agent Analysis Scores</h3>
            <div className="space-y-3">
              {Object.entries(result.analyzer_results).map(([name, analysis]) => (
                <AgentScoreBar key={name} name={name} analysis={analysis} />
              ))}
            </div>
          </div>

          {/* Detailed Agent Results */}
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(result.analyzer_results).map(([name, analysis]) => (
              <AgentAnalysisCard key={name} name={name} analysis={analysis} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Create AgentScoreBar Component:

Create `components/features/AgentScoreBar.tsx`:

```typescript
// components/features/AgentScoreBar.tsx

import { AgentAnalysis } from '@/types';

interface Props {
  name: string;
  analysis: AgentAnalysis;
}

export default function AgentScoreBar({ name, analysis }: Props) {
  const score = analysis.risk_score;
  const width = `${score}%`;

  // Color based on score
  const color =
    score >= 75
      ? 'bg-red-500'
      : score >= 50
      ? 'bg-orange-500'
      : score >= 25
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{name}</span>
        <span className="text-gray-600">{score.toFixed(1)}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`h-3 rounded-full transition-all duration-500 ${color}`} style={{ width }}></div>
      </div>
    </div>
  );
}
```

#### Create AgentAnalysisCard Component:

Create `components/features/AgentAnalysisCard.tsx`:

```typescript
// components/features/AgentAnalysisCard.tsx

import { AgentAnalysis } from '@/types';

interface Props {
  name: string;
  analysis: AgentAnalysis;
}

export default function AgentAnalysisCard({ name, analysis }: Props) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-lg">{name}</h4>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            analysis.recommendation === 'APPROVE'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {analysis.recommendation}
        </span>
      </div>
      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-gray-600">Risk Score:</span>
          <span className="font-semibold ml-2">{analysis.risk_score.toFixed(1)}/100</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Confidence:</span>
          <span className="font-semibold ml-2">{(analysis.confidence * 100).toFixed(1)}%</span>
        </div>
        {analysis.findings.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-600 mb-1">Key Findings:</div>
            <ul className="space-y-1">
              {analysis.findings.slice(0, 3).map((finding, i) => (
                <li key={i} className="text-xs text-gray-700">
                  • {finding}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Checkpoint:** Live Test page complete with multi-agent visualization

---

### **HOUR 3:30 - 5:30 | Experiments Page (3-Mode Comparison)**

This page runs full dataset experiments comparing all 3 ACE modes.

#### Complete Implementation:

Create `app/(routes)/experiments/page.tsx`:

```typescript
// app/(routes)/experiments/page.tsx
'use client';

import { useState } from 'react';
import { runExperiment } from '@/lib/api';
import { ExperimentResult } from '@/types';
import { Loader2, Play, TrendingUp } from 'lucide-react';
import ComparisonChart from '@/components/features/ComparisonChart';

export default function ExperimentsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    vanilla?: ExperimentResult;
    offline_ace?: ExperimentResult;
    online_ace?: ExperimentResult;
  }>({});

  const handleRunExperiments = async () => {
    setLoading(true);
    setResults({});

    try {
      // Run all 3 experiments in sequence
      const [vanilla, offline, online] = await Promise.all([
        runExperiment('vanilla'),
        runExperiment('offline_ace'),
        runExperiment('online_ace'),
      ]);

      setResults({
        vanilla,
        offline_ace: offline,
        online_ace: online,
      });
    } catch (error) {
      console.error('Experiment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">📊 ACE Experiments</h1>
      <p className="text-gray-600 mb-8">
        Compare Vanilla Agent vs Offline ACE vs Online ACE on full dataset
      </p>

      {/* Run Button */}
      <button
        onClick={handleRunExperiments}
        disabled={loading}
        className="mb-8 px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition flex items-center gap-2 shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Running Experiments (this may take 2-3 minutes)...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Run All Experiments
          </>
        )}
      </button>

      {/* Results */}
      {hasResults && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <ResultCard
              title="Vanilla Agent"
              result={results.vanilla!}
              color="gray"
              icon="⚙️"
            />
            <ResultCard
              title="Offline ACE"
              result={results.offline_ace!}
              color="blue"
              icon="📚"
            />
            <ResultCard
              title="Online ACE"
              result={results.online_ace!}
              color="green"
              icon="🚀"
              highlight
            />
          </div>

          {/* Improvement Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">📈 Performance Improvement</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Offline ACE vs Vanilla</div>
                <div className="text-4xl font-bold text-blue-600">
                  +
                  {(
                    ((results.offline_ace?.final_accuracy || 0) - (results.vanilla?.final_accuracy || 0)) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Online ACE vs Vanilla</div>
                <div className="text-4xl font-bold text-green-600">
                  +
                  {(
                    ((results.online_ace?.final_accuracy || 0) - (results.vanilla?.final_accuracy || 0)) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <ComparisonChart results={results} />

          {/* Detailed Metrics */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Metrics</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Metric</th>
                    <th className="text-center py-3">Vanilla</th>
                    <th className="text-center py-3">Offline ACE</th>
                    <th className="text-center py-3">Online ACE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Final Accuracy</td>
                    <td className="text-center">{((results.vanilla?.final_accuracy || 0) * 100).toFixed(1)}%</td>
                    <td className="text-center">{((results.offline_ace?.final_accuracy || 0) * 100).toFixed(1)}%</td>
                    <td className="text-center font-semibold text-green-600">
                      {((results.online_ace?.final_accuracy || 0) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Playbook Size</td>
                    <td className="text-center">0</td>
                    <td className="text-center">{results.offline_ace?.playbook_size || 0}</td>
                    <td className="text-center">{results.online_ace?.playbook_size || 0}</td>
                  </tr>
                  <tr>
                    <td className="py-3">Execution Time</td>
                    <td className="text-center">{results.vanilla?.execution_time.toFixed(1)}s</td>
                    <td className="text-center">{results.offline_ace?.execution_time.toFixed(1)}s</td>
                    <td className="text-center">{results.online_ace?.execution_time.toFixed(1)}s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ title, result, color, icon, highlight }: any) {
  const colorClasses = {
    gray: 'bg-gray-50 border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
  };

  return (
    <div
      className={`p-6 rounded-xl border-2 ${colorClasses[color]} ${
        highlight ? 'ring-2 ring-green-400' : ''
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-2">
        <div>
          <div className="text-sm text-gray-600">Final Accuracy</div>
          <div className="text-3xl font-bold">{((result.final_accuracy || 0) * 100).toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Problems Processed</div>
          <div className="text-xl font-semibold">{result.problems_processed}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Playbook Size</div>
          <div className="text-xl font-semibold">{result.playbook_size} bullets</div>
        </div>
      </div>
    </div>
  );
}
```

#### Create ComparisonChart Component:

Create `components/features/ComparisonChart.tsx`:

```typescript
// components/features/ComparisonChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  results: {
    vanilla?: any;
    offline_ace?: any;
    online_ace?: any;
  };
}

export default function ComparisonChart({ results }: Props) {
  // Combine data for chart
  const chartData = (results.vanilla?.iteration_metrics || []).map((_, i: number) => ({
    iteration: i,
    vanilla: (results.vanilla?.iteration_metrics[i]?.accuracy || 0) * 100,
    offline_ace: (results.offline_ace?.iteration_metrics[i]?.accuracy || 0) * 100,
    online_ace: (results.online_ace?.iteration_metrics[i]?.accuracy || 0) * 100,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">📈 Accuracy Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="iteration" label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="vanilla" stroke="#9CA3AF" strokeWidth={2} name="Vanilla Agent" />
          <Line type="monotone" dataKey="offline_ace" stroke="#3B82F6" strokeWidth={2} name="Offline ACE" />
          <Line type="monotone" dataKey="online_ace" stroke="#10B981" strokeWidth={3} name="Online ACE" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Checkpoint:** Experiments page complete with 3-mode comparison

---

### **HOUR 5:30 - 6:30 | Playbook Explorer Page**

#### Implementation:

Create `app/(routes)/playbook/page.tsx`:

```typescript
// app/(routes)/playbook/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getPlaybookStats } from '@/lib/api';
import { Bullet } from '@/types';
import BulletCard from '@/components/features/BulletCard';

export default function PlaybookPage() {
  const [stats, setStats] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getPlaybookStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load playbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const nodes = ['all', 'PatternDetector', 'BehavioralAnalyzer', 'VelocityChecker', 'MerchantRiskAnalyzer', 'GeographicAnalyzer'];

  const filteredBullets = selectedNode === 'all'
    ? stats?.all_bullets || []
    : (stats?.all_bullets || []).filter((b: Bullet) => b.node === selectedNode);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">📖 Learned Playbook</h1>
      <p className="text-gray-600 mb-8">
        Explore insights learned by each agent node
      </p>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600">Total Bullets</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.total_bullets || 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600">Avg Success Rate</div>
          <div className="text-3xl font-bold text-green-600">
            {stats ? (stats.avg_success_rate * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600">Avg Usage</div>
          <div className="text-3xl font-bold text-purple-600">
            {stats?.avg_usage_count?.toFixed(1) || 0}x
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600">Active Nodes</div>
          <div className="text-3xl font-bold text-orange-600">5</div>
        </div>
      </div>

      {/* Node Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Node</h2>
        <div className="flex flex-wrap gap-2">
          {nodes.map((node) => (
            <button
              key={node}
              onClick={() => setSelectedNode(node)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedNode === node
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {node === 'all' ? 'All Nodes' : node}
            </button>
          ))}
        </div>
      </div>

      {/* Bullets List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Learned Insights ({filteredBullets.length})
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredBullets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No bullets learned yet. Run experiments to generate insights!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBullets.map((bullet: Bullet) => (
              <BulletCard key={bullet.id} bullet={bullet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

#### Create BulletCard Component:

Create `components/features/BulletCard.tsx`:

```typescript
// components/features/BulletCard.tsx

import { Bullet } from '@/types';

interface Props {
  bullet: Bullet;
}

export default function BulletCard({ bullet }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">
            💡 {bullet.id} • {bullet.node}
          </div>
          <div className="text-gray-800">{bullet.content}</div>
        </div>
      </div>
      <div className="flex gap-4 mt-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Success Rate:</span>
          <span className="font-semibold text-green-600">
            {(bullet.success_rate * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Used:</span>
          <span className="font-semibold">{bullet.times_selected}x</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Helpful:</span>
          <span className="font-semibold text-green-600">{bullet.helpful_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Harmful:</span>
          <span className="font-semibold text-red-600">{bullet.harmful_count}</span>
        </div>
      </div>
    </div>
  );
}
```

**Checkpoint:** Playbook explorer complete

---

### **HOUR 6:30 - 7:00 | Navigation + Polish**

#### Add Navigation:

Update `app/layout.tsx`:

```typescript
// app/layout.tsx

import './globals.css';
import Link from 'next/link';
import { Home, FlaskConical, BarChart3, BookOpen } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold text-blue-600">
                ACE Fraud Detection
              </Link>
              <div className="flex gap-4">
                <NavLink href="/" icon={<Home className="w-4 h-4" />} label="Home" />
                <NavLink href="/live-test" icon={<FlaskConical className="w-4 h-4" />} label="Live Test" />
                <NavLink href="/experiments" icon={<BarChart3 className="w-4 h-4" />} label="Experiments" />
                <NavLink href="/playbook" icon={<BookOpen className="w-4 h-4" />} label="Playbook" />
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 hover:text-blue-600"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
```

---

## Success Criteria

By Hour 7, you must have:

✅ **All 4 pages rendering without errors**  
✅ **API integration working** (can call Cristhian's endpoints)  
✅ **Live Test shows all 5 agent results**  
✅ **Experiments runs 3-mode comparison**  
✅ **Charts display correctly**  
✅ **Navigation works**  
✅ **UI looks professional**  
✅ **No console errors**

---

## Integration with Cristhian & Jose

### API Contract:

Your frontend calls Cristhian's endpoints with this format:

```typescript
// POST /api/v1/analyze
{
  transaction: {...},  // Transaction data
  mode: "online_ace"   // or "vanilla" or "offline_ace"
}

// Response
{
  decision: "APPROVE" | "DECLINE",
  confidence: 0.87,
  risk_score: 78.5,
  reasoning: "...",
  analyzer_results: {
    PatternDetector: {...},
    BehavioralAnalyzer: {...},
    // ... 5 agents
  }
}
```

---

## Risk Mitigation

**If behind schedule:**

**Hour 5:** Simplify Playbook page (just show stats, no filtering)  
**Hour 6:** Drop some agent cards (show only 3 agents instead of 5)  
**Hour 6.5:** Use simpler charts (bar charts instead of line charts)

**Minimum viable:** Home + Live Test + Experiments = working demo

---

## Professional Standards

Your UI must:

✅ Be responsive (works on laptop + projector)  
✅ Have smooth animations  
✅ Show loading states  
✅ Handle errors gracefully  
✅ Be accessible (good contrast, readable fonts)  
✅ Look professional (consistent styling)

---

**You're building the judge-facing interface - make it impressive! 🎨**