import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        background:
          "radial-gradient(ellipse at top, rgba(143, 197, 255, 0.18), transparent 45%), linear-gradient(180deg, #f7fbff 0%, #edf4fb 100%)",
      }}
    >
      <div>
        <p style={{ color: "#2f7fd8", fontWeight: 700, margin: "0 0 0.5rem" }}>404</p>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "2rem", color: "#16324f" }}>
          Page Not Found
        </h1>
        <p style={{ color: "#5b728a", margin: "0 0 1.25rem" }}>
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            padding: "0.7rem 1rem",
            borderRadius: "10px",
            background: "#2f7fd8",
            color: "#fff",
            fontWeight: 600,
            boxShadow: "0 8px 20px rgba(47, 127, 216, 0.22)",
          }}
        >
          Back to flights
        </Link>
      </div>
    </div>
  )
}

