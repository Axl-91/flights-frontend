import { Route, Routes } from 'react-router-dom'
import './App.css'
import FlightsIndex from './pages/FlightsIndex'
import FlightDetail from './pages/FlightDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<FlightsIndex />} />
      <Route path="/flight/:id" element={<FlightDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
