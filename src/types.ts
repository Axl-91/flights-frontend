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

export type Flight = {
  airplaneId: number
  flightId: number
  landingAirport: string
  landingDateTime: number
  passengers: Passenger[]
  takeoffAirport: string
  takeoffDateTime: number
}

export type Seat = {
  seat_id: number
  seat_column: string
  seat_row: number
}

export type FetchedData = {
  flightData: Flight,
  seatsData: Seat[]
  groupedPassengers: Passenger[][]
}

export type ApiResponse<T> = {
  code: number
  data: T
}
