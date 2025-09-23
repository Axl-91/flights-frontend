import type { Flight } from "../types";
import './FlightCard.css'

interface FlightCardProps {
  flightData: Flight
}

function FlightCard({ flightData }: FlightCardProps) {
  return (
    <div className="flight-info">
      <h2 className='flight-title'>Flight Info</h2>
      <div className='flight-details'>
        <div className="airport">
          <h3>Takeoff Airport</h3>
          <p>{flightData.takeoffAirport}</p>
        </div>
        <div className="arrow">✈️</div>
        <div className="airport">
          <h3>Landing Airport</h3>
          <p>{flightData.landingAirport}</p>
        </div>
      </div>
    </div>
  )
}

export default FlightCard
