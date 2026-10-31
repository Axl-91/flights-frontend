import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import type { Passenger, Seat } from "../types"
import { getPurchaseColor } from "../utils/purchaseColors"
import SeatDetails from "./SeatDetails"
import "./FlightSeatMap.css"

interface FlightSeatMapProps {
  passengersGrouped: Passenger[][]
  seats: Seat[]
}

interface SeatMapData {
  rows: number[]
  columns: string[]
  seatsByPosition: Map<string, Seat>
  passengersBySeat: Map<number, Passenger>
  passengersByPurchase: Map<number, Passenger[]>
}

function hasAisleBefore(
  columns: string[],
  index: number
): boolean {
  if (index === 0) return false

  const previousColumn = columns[index - 1]
  const currentColumn = columns[index]

  return (
    currentColumn.charCodeAt(0) -
    previousColumn.charCodeAt(0)
  ) > 1
}

function FlightSeatMap({
  passengersGrouped,
  seats,
}: FlightSeatMapProps) {
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null)

  const mapData = useMemo<SeatMapData>(() => {
    const seatsByPosition = new Map<string, Seat>()
    const passengersBySeat = new Map<number, Passenger>()
    const passengersByPurchase = new Map<number, Passenger[]>()

    seats.forEach((seat) => {
      const position = `${seat.seat_row}-${seat.seat_column}`
      seatsByPosition.set(position, seat)
    })

    passengersGrouped.forEach((group) => {
      group.forEach((passenger) => {
        passengersBySeat.set(passenger.seatId, passenger)
      })

      if (group.length > 0) {
        passengersByPurchase.set(
          group[0].purchaseId,
          group
        )
      }
    })

    const rows = [...new Set(
      seats.map((seat) => seat.seat_row)
    )].sort((a, b) => a - b)

    const columns = [...new Set(
      seats.map((seat) => seat.seat_column)
    )].sort((a, b) => a.localeCompare(b))

    return {
      rows,
      columns,
      seatsByPosition,
      passengersBySeat,
      passengersByPurchase,
    }
  }, [passengersGrouped, seats])

  const selectedSeat = seats.find(
    (seat) => seat.seat_id === selectedSeatId
  )

  const selectedPassenger = selectedSeat
    ? mapData.passengersBySeat.get(selectedSeat.seat_id)
    : undefined

  const selectedGroup = selectedPassenger
    ? mapData.passengersByPurchase.get(
      selectedPassenger.purchaseId
    )
    : undefined

  const selectedPurchaseId = selectedPassenger?.purchaseId

  return (
    <div className="flight-seat-map">
      <div className="seat-map-container">
        <h2>Seat Map</h2>

        <div className="seat-map">
          <div className="seat-map-header">
            <span className="row-label" />

            {mapData.columns.map((column, index) => (
              <div key={column} className="seat-map-column">
                {hasAisleBefore(mapData.columns, index) && (
                  <div className="seat-aisle" />
                )}

                <div className="seat-cell">
                  <span className="column-label">
                    {column}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {mapData.rows.map((row) => (
            <div className="seat-map-row" key={row}>
              <span className="row-label">{row}</span>

              {mapData.columns.map((column, index) => {
                const position = `${row}-${column}`
                const seat = mapData.seatsByPosition.get(position)

                const passenger = seat
                  ? mapData.passengersBySeat.get(seat.seat_id)
                  : undefined

                const isSelected = seat?.seat_id === selectedSeatId

                const isSamePurchase =
                  passenger !== undefined &&
                  selectedPurchaseId !== undefined &&
                  passenger.purchaseId === selectedPurchaseId

                const seatColor = passenger
                  ? getPurchaseColor(passenger.purchaseId)
                  : undefined

                return (
                  <div
                    className="seat-map-column"
                    key={column}
                  >
                    {hasAisleBefore(mapData.columns, index) && (
                      <div className="seat-aisle" />
                    )}

                    <div className="seat-cell">
                      {seat ? (
                        <button
                          type="button"
                          className={[
                            "seat",
                            passenger ? "seat-occupied" : "seat-available",
                            isSelected ? "seat-selected" : "",
                            isSamePurchase ? "seat-same-purchase" : "",
                          ].filter(Boolean).join(" ")}
                          style={
                            seatColor
                              ? { "--purchase-color": seatColor } as CSSProperties
                              : undefined
                          }
                          onClick={() => setSelectedSeatId(seat.seat_id)}
                          title={
                            passenger
                              ? `${passenger.name} - Purchase ${passenger.purchaseId}`
                              : `Seat ${column}${row} - Available`
                          }
                        >
                          {column}
                        </button>
                      ) : (
                        <div className="seat-placeholder" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <SeatDetails
        selectedSeat={selectedSeat}
        selectedPassenger={selectedPassenger}
        selectedGroup={selectedGroup}
        seats={seats}
        onSeatSelect={setSelectedSeatId}
      />
    </div>
  )
}

export default FlightSeatMap
