// Home page component - Minimalist Landing Page

import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '4rem 0',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'inline-block',
          padding: '0.5rem 1.25rem',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: '2rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#2563eb',
          marginBottom: '1.5rem',
          border: '1px solid #bfdbfe'
        }}>
          ✨ Powered by Agentic Context Engineering (ACE)
        </div>

        <h1 style={{ 
          fontSize: '3.5rem',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Multi-Agent Fraud Detection System
        </h1>

        <p style={{ 
          fontSize: '1.25rem',
          color: '#525252',
          marginBottom: '3rem',
          lineHeight: 1.7,
          fontWeight: 400
        }}>
          Five specialized AI agents working in parallel, continuously learning from every transaction to detect and prevent fraud in real-time.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/live-test" style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            borderRadius: '0.75rem',
            fontWeight: 600,
            fontSize: '1.0625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
          }}>
            Try Live Demo →
          </Link>
          <Link to="/experiments" style={{
            padding: '1rem 2rem',
            background: 'white',
            color: '#262626',
            borderRadius: '0.75rem',
            fontWeight: 600,
            fontSize: '1.0625rem',
            border: '2px solid #e5e5e5',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.color = '#262626';
          }}>
            View Experiments
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        margin: '3rem 0',
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <StatCard icon="🤖" value="5" label="AI Agents" />
        <StatCard icon="⚡" value="<2s" label="Response Time" />
        <StatCard icon="🎯" value="85%+" label="Accuracy" />
        <StatCard icon="📈" value="Real-time" label="Learning" />
      </section>

      {/* Agents Section */}
      <section style={{ margin: '5rem 0' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          fontSize: '2.25rem',
          color: '#171717'
        }}>
          Specialized Detection Agents
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <AgentCard 
            icon="🔍" 
            name="Pattern Detector" 
            description="Identifies suspicious transaction patterns and anomalies"
            color="#3b82f6"
          />
          <AgentCard 
            icon="🧠" 
            name="Behavioral Analyzer" 
            description="Analyzes user behavior and detects unusual activities"
            color="#8b5cf6"
          />
          <AgentCard 
            icon="⚡" 
            name="Velocity Checker" 
            description="Monitors transaction frequency and velocity patterns"
            color="#f59e0b"
          />
          <AgentCard 
            icon="🏪" 
            name="Merchant Risk" 
            description="Evaluates merchant reputation and risk profiles"
            color="#10b981"
          />
          <AgentCard 
            icon="🌍" 
            name="Geographic Analyzer" 
            description="Detects location-based anomalies and impossible travel"
            color="#ef4444"
          />
        </div>
      </section>

      {/* ACE Modes Section */}
      <section style={{
        background: 'white',
        borderRadius: '1.5rem',
        padding: '3rem',
        marginTop: '5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '2.25rem',
          color: '#171717'
        }}>
          ACE Learning Modes
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <ModeCard 
            title="Vanilla Agent" 
            accuracy="55-65%" 
            description="Baseline performance without learning capabilities"
            color="#737373"
          />
          <ModeCard 
            title="Offline ACE" 
            accuracy="75-85%" 
            description="Pre-trained on historical fraud data"
            color="#3b82f6"
          />
          <ModeCard 
            title="Online ACE" 
            accuracy="85-90%" 
            description="Real-time learning and adaptation"
            color="#10b981"
            highlight
          />
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
      border: '1px solid #f5f5f5'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#171717', marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.875rem', color: '#737373', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

interface AgentCardProps {
  icon: string;
  name: string;
  description: string;
  color: string;
}

function AgentCard({ icon, name, description, color }: AgentCardProps) {
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
      borderTop: `3px solid ${color}`,
      border: '1px solid #f5f5f5'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#171717' }}>{name}</h3>
      <p style={{ color: '#737373', fontSize: '0.9375rem', lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

interface ModeCardProps {
  title: string;
  accuracy: string;
  description: string;
  color: string;
  highlight?: boolean;
}

function ModeCard({ title, accuracy, description, color, highlight }: ModeCardProps) {
  return (
    <div style={{
      padding: '2rem',
      borderRadius: '1rem',
      background: highlight ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#fafafa',
      border: `2px solid ${highlight ? '#10b981' : '#e5e5e5'}`,
      position: 'relative',
      transition: 'all 0.2s'
    }}>
      {highlight && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          Recommended
        </div>
      )}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#171717' }}>{title}</h3>
      <div style={{
        fontSize: '2rem',
        fontWeight: 800,
        color: color,
        marginBottom: '0.75rem'
      }}>
        {accuracy}
      </div>
      <p style={{ color: '#525252', fontSize: '0.9375rem', lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

export default Home;

