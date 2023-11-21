import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import Root from "./routers/root";
import ErrorPage from "./errorPage";
import LogInPage from "./Views/Components/PopupPage/LogInPage";
import SignUpPage from "./Views/Components/PopupPage/SignUpPage";
import ForgotPasswordPage from "./Views/Components/PopupPage/ForgotPasswordPage";
import Map from "./routers/map";
import EditMapView from "./Views/EditMapView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/map/:mapId",
    loader: async ({ params }) => {
      return params.mapId;
    },
    element: <Map />,
  },
  {
    path: "/login",
    element: (
      <div className="login-page">
        <LogInPage
          onChangePage={(page) => {
            if (page === "signUp") {
              router.navigate("/signup");
            } else if (page === "forgotPassword") {
              router.navigate("/forgot");
            } else if (page === "home") {
              router.navigate("/");
            }
          }}
        />
      </div>
    ),
  },
  {
    path: "/signup",
    element: (
      <div className="login-page">
        <SignUpPage
          onChangePage={(page) => {
            if (page === "logIn") {
              router.navigate("/login");
            } else if (page === "forgotPassword") {
              router.navigate("/forgot");
            } else if (page === "home") {
              router.navigate("/");
            }
          }}
        />
      </div>
    ),
  },
  {
    path: "/forgot",
    element: (
      <div className="login-page">
        <ForgotPasswordPage
          onChangePage={(page) => {
            if (page === "logIn") {
              router.navigate("/login");
            } else if (page === "signUp") {
              router.navigate("/signup");
            } else if (page === "home") {
              router.navigate("/");
            }
          }}
        />
      </div>
    ),
  },
  {
    path: "/edit",
    element: (
      <div>
        <EditMapView fileData={null} onChange={() => (router.navigate("/"))}/>
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <EditMapView fileData={null} /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
