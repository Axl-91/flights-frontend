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
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >
      <div>
        <p style={{ color: "#2563eb", fontWeight: 700, margin: "0 0 0.5rem" }}>404</p>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "2rem" }}>Page Not Found</h1>
        <p style={{ color: "#475569", margin: "0 0 1.25rem" }}>
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            padding: "0.7rem 1rem",
            borderRadius: "10px",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Back to flights
        </Link>
      </div>
    </div>
  )
}

