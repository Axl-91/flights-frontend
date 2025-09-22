import { useEffect, useState } from 'react'
import './App.css'

type Passenger = {
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

type ResponseData = {
  airplaneId: number
  flightId: number
  landingAirport: string
  landingDateTime: number
  passengers: Passenger[]
  takeoffAirport: string
  takeoffDateTime: number
}

function groupPassengersByPurchase(passengers: Passenger[]): Passenger[][] {
  const groupedObj = passengers.reduce((groups, passenger) => {
    const key = passenger.purchaseId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(passenger);
    return groups;
  }, {} as Record<number, Passenger[]>);

  const groupedList: Passenger[][] = Object.values(groupedObj);
  return groupedList
}

function App() {
  const [flightData, setFlightData] = useState({} as ResponseData)
  const [groupedPassengers, setGroupedPassengers] = useState([] as Passenger[][])

  useEffect(() => {
    const fetchData = async (): Promise<ResponseData> => {
      const response: Response = await fetch('http://localhost:3000/flights/1/passengers')
      const jsonResponse = await response.json()
      const resData: ResponseData = jsonResponse.data
      setFlightData(resData)
      const passengers = resData.passengers;
      const groupedPassengers = groupPassengersByPurchase(passengers)
      setGroupedPassengers(groupedPassengers)
      return jsonResponse
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

      {groupedPassengers.map((passengers: Passenger[], index) => (
        <>
          <h2 key={index}>Purchase: {passengers[0].purchaseId}</h2>
          <table key={index} className='passenger-table'>
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
              {passengers.map((passenger: Passenger, index) => (
                <tr key={index}>
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
        </>
      ))}
    </>
  )
}

export default App
