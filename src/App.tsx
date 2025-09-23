import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/flight/1" replace />} />
      <Route path="/flight/:id" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
