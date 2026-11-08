import { Link } from "react-router-dom"
import "./ErrorMessage.css"

interface ErrorMessageProps {
  title?: string
  message?: string
  backTo?: string
  backLabel?: string
}

function ErrorMessage({
  title = "Error",
  message = "Something went wrong",
  backTo,
  backLabel = "Go back",
}: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <div className="error-message__card">
        <h2>{title}</h2>
        <p>{message}</p>
        {backTo && (
          <Link to={backTo} className="error-message__link">
            {backLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
