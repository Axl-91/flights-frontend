interface ErrorMessageProps {
  title: string;
  message: string;
}

function ErrorMessage({
  title = "Error",
  message = "Something went wrong",
}: ErrorMessageProps) {
  return (
    <div className="error-message">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
