import type { Passenger, Seat } from "../types"
import { getPurchaseColor } from "../utils/purchaseColors"
import "./SeatDetails.css"

interface SeatDetailsProps {
  selectedSeat: Seat | undefined
  selectedPassenger: Passenger | undefined
  selectedGroup: Passenger[] | undefined
  seats: Seat[]
  onSeatSelect: (seatId: number) => void
}

function SeatDetails({
  selectedSeat,
  selectedPassenger,
  selectedGroup,
  seats,
  onSeatSelect,
}: SeatDetailsProps) {
  if (!selectedSeat) {
    return (
      <div className="seat-details">
        <div className="seat-details-empty">
          <h3>No seat selected</h3>
          <p>Select a seat on the map to see its information.</p>
        </div>
      </div>
    )
  }

  if (!selectedPassenger) {
    return (
      <div className="seat-details">
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
      </div>
    )
  }

  return (
    <div className="seat-details">
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

              const seatLabel = memberSeat
                ? `${memberSeat.seat_column}${memberSeat.seat_row}`
                : "No seat"

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
                  aria-label={`${passenger.name} ${seatLabel}`}
                  onClick={() => onSeatSelect(passenger.seatId)}
                >
                  <span>{passenger.name}</span>
                  <span>{seatLabel}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SeatDetails
