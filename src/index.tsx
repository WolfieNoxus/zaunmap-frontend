import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import Root from "./routers/root";
import ErrorPage from "./errorPage";
// import LogInPage from "./Views/Components/PopupPage/LogInPage";
// import SignUpPage from "./Views/Components/PopupPage/SignUpPage";
// import ForgotPasswordPage from "./Views/Components/PopupPage/ForgotPasswordPage";
import Map from "./routers/map";
// import EditMapView from "./Views/EditMapView";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from 'react-redux';
import store from './store/store';
import AdminPortal from "./Views/AdminPortal";


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
    path: "/admin",
    element: <AdminPortal />,
    errorElement: <ErrorPage />,
  },
  // {
  //   path: "/edit",
  //   element: (
  //     <div>
  //       <EditMapView fileData={null} onChange={() => (router.navigate("/"))}/>
  //     </div>
  //   ),
  // },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="zaunmap.us.auth0.com"
        clientId="yhRzHbfMGQsJ3Solv4Bgk7U2i3Upz6lI"
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <RouterProvider router={router} />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
