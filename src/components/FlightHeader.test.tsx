import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import FlightHeader from "./FlightHeader"

function renderHeader(
  props: {
    selectedFlightId?: string
    onFlightChange?: (flightId: string) => void
  } = {}
) {
  return render(
    <MemoryRouter>
      <FlightHeader
        selectedFlightId={props.selectedFlightId ?? "1"}
        onFlightChange={props.onFlightChange ?? vi.fn()}
      />
    </MemoryRouter>
  )
}

describe("FlightHeader", () => {
  it("renders the dashboard title as a link to home", () => {
    renderHeader()

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Flight Dashboard",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("link", { name: "Flight Dashboard" })
    ).toHaveAttribute("href", "/")
  })

  it("renders all available flights", () => {
    renderHeader()

    expect(screen.getByRole("option", { name: "Flight 1" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Flight 2" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Flight 3" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Flight 4" })).toBeInTheDocument()
  })

  it("shows the selected flight", () => {
    renderHeader({ selectedFlightId: "3" })

    expect(screen.getByRole("combobox", { name: "Flight" })).toHaveValue("3")
  })

  it("calls onFlightChange when another flight is selected", async () => {
    const user = userEvent.setup()
    const onFlightChange = vi.fn()

    renderHeader({ onFlightChange })

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Flight" }),
      "2"
    )

    expect(onFlightChange).toHaveBeenCalledOnce()
    expect(onFlightChange).toHaveBeenCalledWith("2")
  })
})
