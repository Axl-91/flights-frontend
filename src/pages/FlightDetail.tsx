import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  fetchFlightData,
  fetchSeatsData,
  groupPassengers,
} from "../utils"
import type { FetchedData } from "../types"
import FlightHeader from "../components/FlightHeader"
import FlightCard from "../components/FlightCard"
import FlightSeatMap from "../components/FlightSeatMap"
import ErrorMessage from "../components/ErrorMessage"
import Loading from "../components/Loading"
import "./FlightDetail.css"

function FlightDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [fetchedData, setFetchedData] = useState<FetchedData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const flightId = id || ""

      const [resFlight, resSeats] = await Promise.all([
        fetchFlightData(flightId),
        fetchSeatsData(flightId),
      ])
      const groupedPassengers = groupPassengers(resFlight.passengers)

      setFetchedData({
        flightData: resFlight,
        seatsData: resSeats,
        groupedPassengers,
      })
    }

    setFetchedData(null)
    setError(false)

    fetchData().catch(() => setError(true))
  }, [id])

  if (error) {
    return (
      <ErrorMessage
        title="Error fetching data"
        message="Check DB connection"
        backTo="/"
        backLabel="Back to flights"
      />
    )
  }

  if (!fetchedData) return <Loading />

  return (
    <div className="flight-detail">
      <FlightHeader
        selectedFlightId={id || ""}
        onFlightChange={(flightId) => navigate(`/flight/${flightId}`)}
      />

      <div className="flight-detail__toolbar">
        <Link to="/" className="flight-detail__back">
          ← All flights
        </Link>
      </div>

      <FlightCard flightData={fetchedData.flightData} />

      <FlightSeatMap
        passengersGrouped={fetchedData.groupedPassengers}
        seats={fetchedData.seatsData}
      />
    </div>
  )
}

export default FlightDetail
