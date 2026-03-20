import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar      from './components/Sidebar'
import Topbar       from './components/Topbar'
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Trail        from './pages/Trail'
import Graveyard    from './pages/Graveyard'
import Forecast     from './pages/Forecast'
import Transactions from './pages/Transactions'
import Insights     from './pages/Insights'
import Goals        from './pages/Goals'
import SpendHealth  from './pages/SpendHealth'

export default function App() {
  const [authed, setAuthed] = useState(false)

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#faf8f3' }}>
      <Sidebar onLogout={() => setAuthed(false)} />

      <div className="flex flex-col flex-1 ml-[220px] overflow-hidden">
        <Topbar onLogout={() => setAuthed(false)} />
        <main className="flex-1 overflow-y-auto px-7 py-6 pb-12">
          <div className="page-enter">
            <Routes>
              <Route path="/"             element={<Dashboard    />} />
              <Route path="/trail"        element={<Trail        />} />
              <Route path="/graveyard"    element={<Graveyard    />} />
              <Route path="/forecast"     element={<Forecast     />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/insights"     element={<Insights     />} />
              <Route path="/goals"        element={<Goals        />} />
              <Route path="/health"       element={<SpendHealth  />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
