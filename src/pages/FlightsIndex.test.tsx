import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FlightsIndex from "./FlightsIndex"
import { fetchAllFlights } from "../utils"
import type { Flight } from "../types"

vi.mock("../utils", () => ({
  fetchAllFlights: vi.fn(),
}))

const mockedFetchAllFlights = vi.mocked(fetchAllFlights)

const flights: Flight[] = [
  {
    airplaneId: 10,
    flightId: 1,
    takeoffAirport: "Ministro Pistarini International Airport",
    landingAirport: "John F. Kennedy International Airport",
    takeoffDateTime: new Date("2026-05-01T10:00:00Z").getTime(),
    landingDateTime: new Date("2026-05-01T20:30:00Z").getTime(),
    passengers: [{ passengerId: 1 } as Flight["passengers"][number]],
  },
  {
    airplaneId: 20,
    flightId: 2,
    takeoffAirport: "Ezeiza",
    landingAirport: "Madrid Barajas",
    takeoffDateTime: 0,
    landingDateTime: 0,
    passengers: [],
  },
]

function renderIndex() {
  return render(
    <MemoryRouter>
      <FlightsIndex />
    </MemoryRouter>
  )
}

describe("FlightsIndex", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows loading state while fetching flights", () => {
    mockedFetchAllFlights.mockReturnValue(new Promise(() => {}))

    renderIndex()

    expect(screen.getByText("Loading flights...")).toBeInTheDocument()
  })

  it("renders available flights with route information and detail links", async () => {
    mockedFetchAllFlights.mockResolvedValue(flights)

    renderIndex()

    expect(
      await screen.findByRole("heading", { level: 1, name: "Available Flights" })
    ).toBeInTheDocument()

    expect(screen.getByText("Flight 1")).toBeInTheDocument()
    expect(screen.getByText("Aircraft 10")).toBeInTheDocument()
    expect(
      screen.getByText("Ministro Pistarini International Airport")
    ).toBeInTheDocument()
    expect(
      screen.getByText("John F. Kennedy International Airport")
    ).toBeInTheDocument()
    expect(screen.getByText("1 passengers")).toBeInTheDocument()

    expect(screen.getByText("Flight 2")).toBeInTheDocument()
    expect(screen.getByText("0 passengers")).toBeInTheDocument()

    expect(
      screen.getByRole("link", {
        name: "Open flight 1 from Ministro Pistarini International Airport to John F. Kennedy International Airport",
      })
    ).toHaveAttribute("href", "/flight/1")

    expect(
      screen.getByRole("link", {
        name: "Open flight 2 from Ezeiza to Madrid Barajas",
      })
    ).toHaveAttribute("href", "/flight/2")
  })

  it("shows an error when flights cannot be loaded", async () => {
    mockedFetchAllFlights.mockRejectedValue(new Error("network"))

    renderIndex()

    expect(
      await screen.findByRole("heading", { level: 2, name: "Error fetching flights" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Check DB connection and try again.")
    ).toBeInTheDocument()
  })
})
