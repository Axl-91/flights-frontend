import "./FlightHeader.css"

interface FlightHeaderProps {
  selectedFlightId: string
  onFlightChange: (flightId: string) => void
}

function FlightHeader({
  selectedFlightId,
  onFlightChange,
}: FlightHeaderProps) {
  return (
    <header className="flight-header">
      <h1>Flight Dashboard</h1>

      <div className="flight-selector">
        <label htmlFor="flight-select">Flight</label>

        <select
          id="flight-select"
          value={selectedFlightId}
          onChange={(event) => onFlightChange(event.target.value)}
        >
          <option value="1">Flight 1</option>
          <option value="2">Flight 2</option>
          <option value="3">Flight 3</option>
          <option value="4">Flight 4</option>
        </select>
      </div>
    </header>
  )
}

export default FlightHeader
