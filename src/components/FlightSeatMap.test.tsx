import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FlightSeatMap from "./FlightSeatMap"
import type { Passenger, Seat } from "../types"

describe("FlightSeatMap", () => {
  const seats: Seat[] = [
    { seat_id: 1, seat_column: "A", seat_row: 1 },
    { seat_id: 2, seat_column: "B", seat_row: 1 },
    { seat_id: 3, seat_column: "D", seat_row: 1 },
    { seat_id: 4, seat_column: "E", seat_row: 1 },
    { seat_id: 5, seat_column: "A", seat_row: 2 },
    { seat_id: 6, seat_column: "B", seat_row: 2 },
  ]

  const passengerAna: Passenger = {
    name: "Ana",
    age: 72,
    boardingPassId: 101,
    country: "México",
    dni: "7988462",
    passengerId: 1,
    purchaseId: 10,
    seatId: 1,
    seatTypeId: 1,
  }

  const passengerLuis: Passenger = {
    name: "Luis",
    age: 35,
    boardingPassId: 102,
    country: "Argentina",
    dni: "12345678",
    passengerId: 2,
    purchaseId: 10,
    seatId: 2,
    seatTypeId: 1,
  }

  const passengerMaria: Passenger = {
    name: "María",
    age: 28,
    boardingPassId: 103,
    country: "Chile",
    dni: "9876543",
    passengerId: 3,
    purchaseId: 20,
    seatId: 4,
    seatTypeId: 1,
  }

  const passengersGrouped: Passenger[][] = [
    [passengerAna, passengerLuis],
    [passengerMaria],
  ]

  it("renders the seat map and its rows and columns", () => {
    const { container } = render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    expect(screen.getByText("Seat Map")).toBeInTheDocument()

    expect(container.querySelectorAll(".seat-map-row")).toHaveLength(2)

    const seatMapHeader = container.querySelector(".seat-map-header")

    expect(seatMapHeader).not.toBeNull()

    if (!(seatMapHeader instanceof HTMLElement)) {
      throw new Error("Seat map header not found")
    }

    expect(within(seatMapHeader).getByText("A")).toBeInTheDocument()
    expect(within(seatMapHeader).getByText("B")).toBeInTheDocument()
    expect(within(seatMapHeader).getByText("D")).toBeInTheDocument()
    expect(within(seatMapHeader).getByText("E")).toBeInTheDocument()
  })

  it("renders occupied and available seats correctly", () => {
    render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    const occupiedSeats = document.querySelectorAll(".seat-occupied")
    const availableSeats = document.querySelectorAll(".seat-available")

    expect(occupiedSeats).toHaveLength(3)
    expect(availableSeats).toHaveLength(3)
  })

  it("renders the empty selection message initially", () => {
    render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    expect(screen.getByText("No seat selected")).toBeInTheDocument()

    expect(
      screen.getByText("Select a seat on the map to see its information.")
    ).toBeInTheDocument()
  })

  it("shows passenger information when selecting an occupied seat", async () => {
    const user = userEvent.setup()

    render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    await user.click(screen.getByTitle("Ana - Purchase 10"))

    expect(
      screen.getByRole("heading", { level: 3, name: "Seat A1" })
    ).toBeInTheDocument()

    expect(screen.getByText("Occupied")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { level: 4, name: "Ana" })
    ).toBeInTheDocument()

    expect(screen.getByText("Age: 72")).toBeInTheDocument()
    expect(screen.getByText("DNI: 7988462")).toBeInTheDocument()
    expect(screen.getByText("Country: México")).toBeInTheDocument()
    expect(screen.getByText("Purchase #10")).toBeInTheDocument()
  })

  it("shows available seat information when selecting an empty seat", async () => {
    const user = userEvent.setup()

    render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    const availableSeat = screen.getByTitle("Seat D1 - Available")

    await user.click(availableSeat)

    expect(
      screen.getByRole("heading", { level: 3, name: "Seat D1" })
    ).toBeInTheDocument()

    expect(screen.getByText("Available")).toBeInTheDocument()
  })

  it("shows the other passengers from the same purchase", async () => {
    const user = userEvent.setup()

    render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    await user.click(screen.getByTitle("Ana - Purchase 10"))

    expect(
      screen.getByText("Purchase members (2)")
    ).toBeInTheDocument()

    const purchaseMembers = document.querySelector(".purchase-members")!

    expect(purchaseMembers).toBeInstanceOf(HTMLElement)

    if (!(purchaseMembers instanceof HTMLElement)) {
      throw new Error("Purchase members element not found")
    }

    expect(within(purchaseMembers).getByText("Ana")).toBeInTheDocument()
    expect(within(purchaseMembers).getByText("Luis")).toBeInTheDocument()

    expect(within(purchaseMembers).getByText("A1")).toBeInTheDocument()
    expect(within(purchaseMembers).getByText("B1")).toBeInTheDocument()
  })

  it("selects another passenger from the same purchase", async () => {
    const user = userEvent.setup()

    render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    await user.click(screen.getByTitle("Ana - Purchase 10"))

    const purchaseMembers = document.querySelector(".purchase-members")

    expect(purchaseMembers).toBeInstanceOf(HTMLElement)

    if (!(purchaseMembers instanceof HTMLElement)) {
      throw new Error("Purchase members element not found")
    }

    const luisButton = within(purchaseMembers)
      .getByText("Luis")
      .closest("button")

    expect(luisButton).toBeInstanceOf(HTMLButtonElement)

    if (luisButton instanceof HTMLButtonElement) {
      await user.click(luisButton)
    }

    expect(luisButton).not.toBeNull()

    await user.click(luisButton!)

    expect(
      screen.getByRole("heading", { level: 3, name: "Seat B1" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { level: 4, name: "Luis" })
    ).toBeInTheDocument()

    expect(screen.getByText("DNI: 12345678")).toBeInTheDocument()
  })

  it("updates passenger information when selecting another seat", async () => {
    const user = userEvent.setup()

    render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    await user.click(screen.getByTitle("Ana - Purchase 10"))

    expect(
      screen.getByRole("heading", { level: 4, name: "Ana" })
    ).toBeInTheDocument()

    await user.click(screen.getByTitle("María - Purchase 20"))

    expect(
      screen.getByRole("heading", { level: 3, name: "Seat E1" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { level: 4, name: "María" })
    ).toBeInTheDocument()

    expect(screen.getByText("DNI: 9876543")).toBeInTheDocument()
    expect(screen.getByText("Purchase #20")).toBeInTheDocument()
  })

  it("highlights seats belonging to the selected purchase", async () => {
    const user = userEvent.setup()

    const { container } = render(
      <FlightSeatMap
        passengersGrouped={passengersGrouped}
        seats={seats}
      />
    )

    await user.click(screen.getByTitle("Ana - Purchase 10"))

    const highlightedSeats = container.querySelectorAll(
      ".seat-same-purchase"
    )

    expect(highlightedSeats).toHaveLength(2)
  })
})
