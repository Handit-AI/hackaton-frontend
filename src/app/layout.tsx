// Root layout component with navigation
// This component wraps all pages and provides the main navigation
// TODO: Implement navigation bar and global layout

import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      {/* TODO: Add navigation bar */}
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/live-test" style={{ marginRight: '1rem' }}>Live Test</Link>
        <Link to="/experiments" style={{ marginRight: '1rem' }}>Experiments</Link>
        <Link to="/playbook" style={{ marginRight: '1rem' }}>Playbook</Link>
      </nav>
      
      {/* Main content area */}
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout

