import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchAllFlights } from "../utils"
import type { Flight } from "../types"
import Loading from "../components/Loading"
import ErrorMessage from "../components/ErrorMessage"
import "./FlightsIndex.css"

function formatDateTime(value: number) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function FlightsIndex() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const data = await fetchAllFlights()
        if (!active) return
        setFlights(data)
      } catch {
        if (!active) return
        setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Loading message="Loading flights..." />

  if (error) {
    return (
      <ErrorMessage
        title="Error fetching flights"
        message="Check DB connection and try again."
      />
    )
  }

  return (
    <div className="flights-index">
      <header className="flights-index__hero">
        <div className="flights-index__hero-content">
          <p className="flights-index__eyebrow">Flight Dashboard</p>
          <h1>Available Flights</h1>
          <p className="flights-index__subtitle">
            Select a flight to view its seat map and passenger distribution.
          </p>
        </div>
      </header>

      <main className="flights-index__main">
        <div className="flights-index__grid">
          {flights.map((flight) => (
            <Link
              key={flight.flightId}
              to={`/flight/${flight.flightId}`}
              className="flight-index-card"
              aria-label={`Open flight ${flight.flightId} from ${flight.takeoffAirport} to ${flight.landingAirport}`}
            >
              <div className="flight-index-card__top">
                <span className="flight-index-card__badge">
                  Flight {flight.flightId}
                </span>
                <span className="flight-index-card__meta">
                  Aircraft {flight.airplaneId}
                </span>
              </div>

              <div className="flight-index-card__route">
                <div className="flight-index-card__airport">
                  <span className="flight-index-card__code">
                    {flight.takeoffAirport}
                  </span>
                  <span className="flight-index-card__label">Departure</span>
                  <span className="flight-index-card__time">
                    {formatDateTime(flight.takeoffDateTime)}
                  </span>
                </div>

                <div className="flight-index-card__path" aria-hidden="true">
                  <span className="flight-index-card__line" />
                  <span className="flight-index-card__plane">✈</span>
                  <span className="flight-index-card__line" />
                </div>

                <div className="flight-index-card__airport flight-index-card__airport--right">
                  <span className="flight-index-card__code">
                    {flight.landingAirport}
                  </span>
                  <span className="flight-index-card__label">Arrival</span>
                  <span className="flight-index-card__time">
                    {formatDateTime(flight.landingDateTime)}
                  </span>
                </div>
              </div>

              <div className="flight-index-card__footer">
                <span>{flight.passengers.length} passengers</span>
                <span className="flight-index-card__cta">View seats →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default FlightsIndex
