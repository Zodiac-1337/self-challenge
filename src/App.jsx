import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home    from './pages/Home'
import Create  from './pages/Create'
import Accept  from './pages/Accept'
import Active  from './pages/Active'
import Result  from './pages/Result'
import History from './pages/History'

// AnimatePresence needs useLocation — must live inside BrowserRouter
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"        element={<Home />}    />
        <Route path="/create"  element={<Create />}  />
        <Route path="/accept"  element={<Accept />}  />
        <Route path="/active"  element={<Active />}  />
        <Route path="/result"  element={<Result />}  />
        <Route path="/history" element={<History />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
