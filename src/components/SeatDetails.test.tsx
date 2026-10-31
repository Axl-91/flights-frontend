
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SeatDetails from "./SeatDetails"
import type { Passenger, Seat } from "../types"

const seats: Seat[] = [
  { seat_id: 1, seat_column: "A", seat_row: 1 },
  { seat_id: 2, seat_column: "B", seat_row: 1 },
  { seat_id: 3, seat_column: "D", seat_row: 1 },
]

const ana: Passenger = {
  name: "Ana",
  age: 72,
  boardingPassId: 1,
  country: "Argentina",
  dni: "7988462",
  passengerId: 1,
  purchaseId: 10,
  seatId: 1,
  seatTypeId: 1,
}

const luis: Passenger = {
  name: "Luis",
  age: 35,
  boardingPassId: 2,
  country: "Argentina",
  dni: "12345678",
  passengerId: 2,
  purchaseId: 10,
  seatId: 2,
  seatTypeId: 1,
}

describe("SeatDetails", () => {
  it("shows an empty state when no seat is selected", () => {
    render(
      <SeatDetails
        selectedSeat={undefined}
        selectedPassenger={undefined}
        selectedGroup={undefined}
        seats={seats}
        onSeatSelect={vi.fn()}
      />
    )

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "No seat selected",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Select a seat on the map to see its information.")
    ).toBeInTheDocument()
  })

  it("shows available status for an unoccupied seat", () => {
    render(
      <SeatDetails
        selectedSeat={seats[2]}
        selectedPassenger={undefined}
        selectedGroup={undefined}
        seats={seats}
        onSeatSelect={vi.fn()}
      />
    )

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Seat D1",
      })
    ).toBeInTheDocument()

    expect(screen.getByText("Available")).toBeInTheDocument()
    expect(screen.queryByText("Occupied")).not.toBeInTheDocument()
  })

  it("shows passenger information for an occupied seat", () => {
    render(
      <SeatDetails
        selectedSeat={seats[0]}
        selectedPassenger={ana}
        selectedGroup={[ana, luis]}
        seats={seats}
        onSeatSelect={vi.fn()}
      />
    )

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Seat A1",
      })
    ).toBeInTheDocument()

    expect(screen.getByText("Occupied")).toBeInTheDocument()
    expect(screen.getByText("Purchase #10")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Ana",
      })
    ).toBeInTheDocument()

    expect(screen.getByText("Age: 72")).toBeInTheDocument()
    expect(screen.getByText("DNI: 7988462")).toBeInTheDocument()
    expect(screen.getByText("Country: Argentina")).toBeInTheDocument()
  })

  it("shows purchase members when the group has multiple passengers", () => {
    render(
      <SeatDetails
        selectedSeat={seats[0]}
        selectedPassenger={ana}
        selectedGroup={[ana, luis]}
        seats={seats}
        onSeatSelect={vi.fn()}
      />
    )

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Purchase members (2)",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: /Ana\s+A1/ })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: /Luis\s+B1/ })
    ).toBeInTheDocument()
  })

  it("calls onSeatSelect when another purchase member is selected", async () => {
    const user = userEvent.setup()
    const onSeatSelect = vi.fn()

    render(
      <SeatDetails
        selectedSeat={seats[0]}
        selectedPassenger={ana}
        selectedGroup={[ana, luis]}
        seats={seats}
        onSeatSelect={onSeatSelect}
      />
    )

    await user.click(
      screen.getByRole("button", { name: /Luis\s+B1/ })
    )

    expect(onSeatSelect).toHaveBeenCalledOnce()
    expect(onSeatSelect).toHaveBeenCalledWith(2)
  })
})
