import { useEffect, useState } from "react"
import { fetchFlightData, fetchSeatsData, groupPassengers } from "../utils"
import { useParams } from "react-router-dom"
import './Index.css'
import type { Flight, Passenger, Seat } from "../types"
import PassengersTable from "../components/PassengersTable"
import FlightCard from "../components/FlightCard"

function Index() {
  const { id } = useParams<{ id: string }>();
  const [flightData, setFlightData] = useState({} as Flight)
  const [seatData, setSeatData] = useState([] as Seat[])
  const [groupedPassengers, setGroupedPassengers] = useState([] as Passenger[][])

  useEffect(() => {
    const fetchData = async () => {
      const flightId = id || '';

      const resFlight = await fetchFlightData(flightId);
      setFlightData(resFlight)

      const resSeats = await fetchSeatsData(flightId);
      setSeatData(resSeats)

      const groupedPassengers = groupPassengers(resFlight.passengers)
      setGroupedPassengers(groupedPassengers)
    }

    fetchData();
  }, [id])

  return (
    <>
      <FlightCard flightData={flightData} />
      <PassengersTable passengersGrouped={groupedPassengers} seats={seatData} />
    </>
  )
}

export default Index;
