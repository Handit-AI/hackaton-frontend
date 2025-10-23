// TypeScript type definitions
// This file contains all shared TypeScript types and interfaces

// TODO: Define Agent type
export interface Agent {
  id: string
  name: string
  // TODO: Add more agent properties
}

// TODO: Define Analysis result type
export interface AnalysisResult {
  agentId: string
  score: number
  confidence: number
  // TODO: Add more analysis properties
}

// TODO: Define Experiment type
export interface Experiment {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  // TODO: Add more experiment properties
}

// TODO: Define Playbook bullet type
export interface PlaybookBullet {
  id: string
  title: string
  description: string
  category: string
  // TODO: Add more playbook properties
}

// TODO: Define Test parameters type
export interface TestParameters {
  // TODO: Add test parameter properties
}

// TODO: Add more types as needed

