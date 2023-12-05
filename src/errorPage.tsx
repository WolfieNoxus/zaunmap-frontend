import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an error has occurred. Please contact developers. Thanks to use Zaun Map!</p>
      <p>
        <i>{isRouteErrorResponse(error) ? error.status + ": " + error.statusText : "Unknown Error."}</i>
      </p>
    </div>
  );
}
