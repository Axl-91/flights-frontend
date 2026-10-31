import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FlightHeader from "./FlightHeader"

describe("FlightHeader", () => {
  it("renders the dashboard title", () => {
    render(
      <FlightHeader
        selectedFlightId="1"
        onFlightChange={vi.fn()}
      />
    )

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Flight Dashboard",
      })
    ).toBeInTheDocument()
  })

  it("renders all available flights", () => {
    render(
      <FlightHeader
        selectedFlightId="1"
        onFlightChange={vi.fn()}
      />
    )

    expect(screen.getByRole("option", { name: "Flight 1" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Flight 2" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Flight 3" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Flight 4" })).toBeInTheDocument()
  })

  it("shows the selected flight", () => {
    render(
      <FlightHeader
        selectedFlightId="3"
        onFlightChange={vi.fn()}
      />
    )

    expect(screen.getByRole("combobox", { name: "Flight" })).toHaveValue("3")
  })

  it("calls onFlightChange when another flight is selected", async () => {
    const user = userEvent.setup()
    const onFlightChange = vi.fn()

    render(
      <FlightHeader
        selectedFlightId="1"
        onFlightChange={onFlightChange}
      />
    )

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Flight" }),
      "2"
    )

    expect(onFlightChange).toHaveBeenCalledOnce()
    expect(onFlightChange).toHaveBeenCalledWith("2")
  })
})
