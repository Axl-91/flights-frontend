import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import type { Passenger, Seat } from "../types"
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

const PURCHASE_COLORS = [
  "#2563EB",
  "#D97706",
  "#0D9488",
  "#9333EA",
  "#DB2777",
  "#65A30D",
  "#0891B2",
  "#DC2626",
  "#4F46E5",
  "#CA8A04",
  "#059669",
  "#C026D3",
  "#EA580C",
  "#0284C7",
  "#7C3AED",
  "#BE123C",
  "#15803D",
  "#A16207",
  "#4338CA",
  "#0F766E",
  "#A21CAF",
  "#B91C1C",
  "#0369A1",
  "#4D7C0F",
  "#C2410C",
  "#6D28D9",
  "#BE185D",
  "#047857",
  "#B45309",
  "#1D4ED8",
  "#0E7490",
  "#86198F",
  "#7C2D12",
  "#1E40AF",
  "#166534",
  "#9D174D",
  "#854D0E",
  "#155E75",
  "#5B21B6",
  "#9F1239",
  "#365314",
  "#374151",
]

function getPurchaseColor(purchaseId: number): string {
  const index = Math.abs(purchaseId) % PURCHASE_COLORS.length
  return PURCHASE_COLORS[index]
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

      <div className="seat-details">
        {!selectedSeat ? (
          <div className="seat-details-empty">
            <h3>No seat selected</h3>
            <p>Select a seat on the map to see its information.</p>
          </div>
        ) : !selectedPassenger ? (
          <div className="seat-details-content">
            <div className="seat-details-header">
              <div>
                <h3>
                  Seat {selectedSeat.seat_column}
                  {selectedSeat.seat_row}
                </h3>
                <p className="seat-status available">
                  Available
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="seat-details-content">
            <div className="seat-details-header">
              <div>
                <h3>
                  Seat {selectedSeat.seat_column}
                  {selectedSeat.seat_row}
                </h3>
                <p className="seat-status occupied">
                  Occupied
                </p>
              </div>

              <span
                className="purchase-badge"
                style={{
                  backgroundColor: getPurchaseColor(
                    selectedPassenger.purchaseId
                  ),
                }}
              >
                Purchase #{selectedPassenger.purchaseId}
              </span>
            </div>

            <div className="selected-passenger">
              <h4>{selectedPassenger.name}</h4>
              <p>Age: {selectedPassenger.age}</p>
              <p>DNI: {selectedPassenger.dni}</p>
              <p>Country: {selectedPassenger.country}</p>
            </div>

            {selectedGroup && selectedGroup.length > 1 && (
              <div className="purchase-members">
                <h4>
                  Purchase members ({selectedGroup.length})
                </h4>

                {selectedGroup.map((passenger) => {
                  const memberSeat = seats.find(
                    (seat) => seat.seat_id === passenger.seatId
                  )

                  return (
                    <button
                      type="button"
                      className={[
                        "purchase-member",
                        passenger.passengerId === selectedPassenger.passengerId
                          ? "purchase-member-selected"
                          : "",
                      ].filter(Boolean).join(" ")}
                      key={passenger.passengerId}
                      onClick={() =>
                        setSelectedSeatId(passenger.seatId)
                      }
                    >
                      <span>{passenger.name}</span>
                      <span>
                        {memberSeat
                          ? `${memberSeat.seat_column}${memberSeat.seat_row}`
                          : "No seat"}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FlightSeatMap
