import { Fragment } from "react/jsx-runtime";
import type { Passenger, Seat } from "../types";
import './PassengersTable.css'
import { getSeatInfo } from "../utils";

interface PassengersTableProps {
  passengersGrouped: Passenger[][]
  seats: Seat[]
}

function PassengersTable({ passengersGrouped, seats }: PassengersTableProps) {
  return (
    <>
      {passengersGrouped.map((passengers: Passenger[], indexGroup) => (
        <Fragment key={`group_${indexGroup}`}>
          <h2>Purchase: {passengers[0].purchaseId}</h2>
          <table className='passenger-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>DNI</th>
                <th>Country</th>
                <th>Seat Column </th>
                <th>Seat Row </th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger: Passenger) => {
                const seatInfo = getSeatInfo(seats, passenger.seatId)
                return (
                  <tr key={passenger.dni}>
                    <td>{passenger.name}</td>
                    <td>{passenger.age}</td>
                    <td>{passenger.dni}</td>
                    <td>{passenger.country}</td>
                    <td>{seatInfo.seat_column}</td>
                    <td>{seatInfo.seat_row}</td>
                  </tr>
                )
              }
              )}
            </tbody>
          </table>
        </Fragment>
      ))}
    </>
  )
}

export default PassengersTable;
