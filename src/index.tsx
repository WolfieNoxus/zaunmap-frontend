import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import Root from "./routers/root";
import ErrorPage from "./errorPage";
import LogInPage from "./Views/Components/PopupPage/LogInPage";
import SignUpPage from "./Views/Components/PopupPage/SignUpPage";
import ForgotPasswordPage from "./Views/Components/PopupPage/ForgotPasswordPage";
import Map from "./routers/map";

const auth0Config = {
  domain: "your-auth0-domain",
  clientId: "your-client-id",
  redirectUri: window.location.origin,
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/map/:mapId",
    loader: async ({ params }) => {
      return params.mapId
    },
    element: <Map />,
  },
  {
    path: "/login",
    element: <div className="login-page">
      <LogInPage onChangePage={(page) => {
        if (page === "signUp") {
          router.navigate("/signup");
        } else if (page === "forgotPassword") {
          router.navigate("/forgot");
        };
      }} />
    </div>,
  },
  {
    path: "/signup",
    element: <div className="login-page">
      <SignUpPage onChangePage={(page) => {
        if (page === "logIn") {
          router.navigate("/login");
        } else if (page === "forgotPassword") {
          router.navigate("/forgot");
        };
      }} />
    </div>,
  },
  {
    path: "/forgot",
    element: <div className="login-page">
      <ForgotPasswordPage onChangePage={(page) => {
        if (page === "logIn") {
          router.navigate("/login");
        } else if (page === "signUp") {
          router.navigate("/signup");
        };
      }} />
    </div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider {...auth0Config}> {/* Wrap your app with Auth0Provider */}
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
