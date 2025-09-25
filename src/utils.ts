import type { ApiResponse, Flight, Passenger, Seat } from "./types";
import axios from "axios";
import type { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:3000";

// Group By function taken from SO
const groupBy = <T, K extends string | number | symbol>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

async function fetchData<T>(endpoint: string): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axios.get(`${API_BASE_URL}${endpoint}`);
  return response.data.data;
}

export async function fetchFlightData(flightId: string) {
  return fetchData<Flight>(`/flights/${flightId}/passengers`);
}

export async function fetchSeatsData(flightId: string) {
  return fetchData<Seat[]>(`/flights/${flightId}/seats`);
}

export function groupPassengers(passengers: Passenger[]): Passenger[][] {
  const groupedObj = groupBy(passengers, p => p.passengerId)

  const groupedList: Passenger[][] =
    Object.values(groupedObj)
      .sort((groupA, groupB) =>
        groupB.length - groupA.length);

  return groupedList
}

export function getSeatInfo(seats: Seat[], seat_id: number) {
  const seatData =
    seats
      .find((s) => s.seat_id === seat_id)!

  return seatData
}

export function getSeatType(seatTypeId: number): string {
  switch (seatTypeId) {
    case 1: return 'First Class'
    case 2: return 'Economic+ Class'
    case 3: return 'Ecomonic Class'
    default: return 'unknown'
  }
}
