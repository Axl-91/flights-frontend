import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  fetchFlightData,
  fetchSeatsData,
  groupPassengers,
} from "../utils"
import "./Index.css"
import type { FetchedData } from "../types"
import FlightHeader from "../components/FlightHeader"
import FlightSeatMap from "../components/FlightSeatMap"
import FlightCard from "../components/FlightCard"
import ErrorMessage from "../components/ErrorMessage"
import Loading from "../components/Loading"

function Index() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [fetchedData, setFetchedData] = useState<FetchedData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const flightId = id || ""

      const resFlight = await fetchFlightData(flightId)
      const resSeats = await fetchSeatsData(flightId)
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
      />
    )
  }

  if (!fetchedData) return <Loading />

  return (
    <>
      <FlightHeader
        selectedFlightId={id || ""}
        onFlightChange={(flightId) => navigate(`/flight/${flightId}`)}
      />

      <FlightCard flightData={fetchedData.flightData} />

      <FlightSeatMap
        passengersGrouped={fetchedData.groupedPassengers}
        seats={fetchedData.seatsData}
      />
    </>
  )
}

export default Index
