// Root layout component with navigation
// Minimalist design with clean navigation

import { Link, useLocation } from 'react-router-dom'
import { Home, FlaskConical, BarChart3, BookOpen } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <img 
              src="/src/assets/svg/logo_handit.svg" 
              alt="Handit AI Logo" 
              style={{
                height: '140px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: '#737373',
              letterSpacing: '0.025em'
            }}>
              Self Improving Detection
            </span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <NavLink to="/" label="Home" icon={<Home size={18} strokeWidth={2} />} active={location.pathname === '/'} />
            <NavLink to="/live-test" label="Live Test" icon={<FlaskConical size={18} strokeWidth={2} />} active={location.pathname === '/live-test'} />
            <NavLink to="/experiments" label="Experiments" icon={<BarChart3 size={18} strokeWidth={2} />} active={location.pathname === '/experiments'} />
            <NavLink to="/playbook" label="Playbook" icon={<BookOpen size={18} strokeWidth={2} />} active={location.pathname === '/playbook'} />
          </div>
        </div>
      </nav>
      
      {/* Main content area */}
      <main style={{ flex: 1, paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #e5e5e5',
        padding: '2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{
          textAlign: 'center',
          color: '#737373',
          fontSize: '0.875rem'
        }}>
          <p>Hackathon 2025 | Multi-Agent Fraud Detection System</p>
        </div>
      </footer>
    </div>
  )
}

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

function NavLink({ to, label, icon, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.625rem 1.25rem',
        borderRadius: '0.75rem',
        fontSize: '0.9375rem',
        fontWeight: 500,
        color: active ? '#3b82f6' : '#525252',
        background: active ? '#eff6ff' : 'transparent',
        transition: 'all 0.2s',
        border: '1px solid',
        borderColor: active ? '#3b82f6' : 'transparent'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = '#f5f5f5';
          e.currentTarget.style.color = '#262626';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#525252';
        }
      }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default Layout

