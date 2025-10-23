// Root App component with routing
// This component sets up the main routing structure and wraps pages with the layout

import { Routes, Route } from 'react-router-dom'
import Layout from './app/layout'
import Home from './app/page'
import LiveTest from './app/(routes)/live-test/page'
import Experiments from './app/(routes)/experiments/page'
import Playbook from './app/(routes)/playbook/page'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live-test" element={<LiveTest />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/playbook" element={<Playbook />} />
      </Routes>
    </Layout>
  )
}

export default App

