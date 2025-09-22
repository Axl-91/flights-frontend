import type { Passenger } from "./pages/Index";

export function groupPassengersByPurchase(passengers: Passenger[]): Passenger[][] {
  const groupedObj = passengers.reduce((groups, passenger) => {
    const key = passenger.purchaseId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(passenger);
    return groups;
  }, {} as Record<number, Passenger[]>);

  const groupedList: Passenger[][] = Object.values(groupedObj);
  return groupedList
}
