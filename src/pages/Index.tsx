import { Fragment, useEffect, useState } from "react"
import { groupPassengersByPurchase } from "../utils"
import { useParams } from "react-router-dom"
import axios from "axios"
import type { AxiosResponse } from "axios"

export type Passenger = {
  name: string
  age: number
  boardingPassId: number
  country: string
  dni: string
  passengerId: number
  purchaseId: number
  seatId: number
  seatTypeId: number
}

type Flight = {
  airplaneId: number
  flightId: number
  landingAirport: string
  landingDateTime: number
  passengers: Passenger[]
  takeoffAirport: string
  takeoffDateTime: number
}

type ApiResponse = {
  code: number
  data: Flight
}

async function fetchFlightData(flightId: string) {
  const response: AxiosResponse<ApiResponse> = await axios.get(`http://localhost:3000/flights/${flightId}/passengers`)
  const data = response.data.data;

  return data;
}

function Index() {
  const { id } = useParams();
  const [flightData, setFlightData] = useState({} as Flight)
  const [groupedPassengers, setGroupedPassengers] = useState([] as Passenger[][])

  useEffect(() => {
    const fetchData = async () => {
      const flightId = id || '';
      const resData: Flight = await fetchFlightData(flightId);

      setFlightData(resData)

      const passengers = resData.passengers;
      const groupedPassengers = groupPassengersByPurchase(passengers)
      setGroupedPassengers(groupedPassengers)
    }
    fetchData();
  }, [])

  return (
    <>
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

      {groupedPassengers.map((passengers: Passenger[], indexGroup) => (
        <Fragment key={`group_${indexGroup}`}>
          <h2 key={`h2_${indexGroup}`}>Purchase: {passengers[0].purchaseId}</h2>
          <table key={`table_${indexGroup}`} className='passenger-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>DNI</th>
                <th>Country</th>
                <th>Seat ID </th>
                <th>Seat Type ID </th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger: Passenger, indexPassenger) => (
                <tr key={`row_${indexPassenger}`}>
                  <td>{passenger.name}</td>
                  <td>{passenger.age}</td>
                  <td>{passenger.dni}</td>
                  <td>{passenger.country}</td>
                  <td>{passenger.seatId}</td>
                  <td>{passenger.seatTypeId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      ))}
    </>

  )
}

export default Index;
