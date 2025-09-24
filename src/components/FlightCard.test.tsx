import { render, screen } from "@testing-library/react";
import FlightCard from "./FlightCard";
import type { Flight } from "../types";

describe("FlightCard", () => {
  const mockFlight: Flight = {
    airplaneId: 1,
    flightId: 1,
    takeoffAirport: "Buenos Aires",
    landingAirport: "New York",
    landingDateTime: 0,
    takeoffDateTime: 0,
    passengers: []
  };

  it("renders the correct values", () => {
    render(<FlightCard flightData={mockFlight} />);

    expect(screen.getByText("Flight Info")).toBeInTheDocument();
    expect(screen.getByText('Takeoff Airport')).toBeInTheDocument();
    expect(screen.getByText("Buenos Aires")).toBeInTheDocument();
    expect(screen.getByText('Landing Airport')).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  it("has correct rendering", () => {
    const { container } = render(<FlightCard flightData={mockFlight} />);

    expect(container.querySelector('.flight-info')).toBeInTheDocument();
    expect(screen.getByText('Flight Info')).toHaveClass('flight-title');
    expect(container.querySelectorAll('.airport')).toHaveLength(2);

    const airports = screen.getAllByRole('heading', { level: 3 });
    expect(airports.map(a => a.textContent)).toEqual(['Takeoff Airport', 'Landing Airport']);
  })

  it("Has the correct takeoff and landing airport", () => {

    render(<FlightCard flightData={mockFlight} />);

    const takeoffHeading = screen.getByText("Takeoff Airport");
    const airportTakeoffDiv = takeoffHeading.closest(".airport")!;
    const airportTakeoffValue = airportTakeoffDiv.querySelector("p")
    expect(airportTakeoffValue).toHaveTextContent(mockFlight.takeoffAirport);


    const landingHeading = screen.getByText("Landing Airport");
    const airportLandingDiv = landingHeading.closest(".airport")!;
    const airportLandingValue = airportLandingDiv.querySelector("p")
    expect(airportLandingValue).toHaveTextContent(mockFlight.landingAirport);
  })
});

