import { useEffect, useState } from "react"
import { fetchFlightData, fetchSeatsData, groupPassengers } from "../utils"
import { useParams } from "react-router-dom"
import './Index.css'
import type { FetchedData } from "../types"
import PassengersTable from "../components/PassengersTable"
import FlightCard from "../components/FlightCard"
import ErrorMessage from "../components/ErrorMessage"

function Index() {
  const { id } = useParams<{ id: string }>();
  const [fetchedData, setFetchedData] = useState<FetchedData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const flightId = id || '';

      const resFlight = await fetchFlightData(flightId);
      const resSeats = await fetchSeatsData(flightId);
      const groupedPassengers = groupPassengers(resFlight.passengers)

      setFetchedData({
        flightData: resFlight,
        seatsData: resSeats,
        groupedPassengers: groupedPassengers
      })
    }
    fetchData()
      .catch(() =>
        setError(true));
  }, [id])

  if (error) return (
    <ErrorMessage
      title="Error fetching data"
      message="Check DB connection"
    />
  )
  else if (!fetchedData) return (<h2>Loading...</h2>)

  return (
    <>
      <FlightCard flightData={fetchedData.flightData} />
      <PassengersTable
        passengersGrouped={fetchedData.groupedPassengers}
        seats={fetchedData.seatsData} />
    </>
  )
}

export default Index;
