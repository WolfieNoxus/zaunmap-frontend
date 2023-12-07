import axios from "axios";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useEffect, useState } from "react";

// let token  = getAccessTokenSilently();

// const getToken = () => {
//   const { getAccessTokenSilently } = useAuth0();
//   const [token, setToken] = useState<string>("");

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         setToken(await getAccessTokenSilently());
//       } catch (err) {
//         console.log("Error: ", err);
//       }
//     };
//   });

//   return axios.create({
//     baseURL: "https://zaunmap-6b1455b08c9b.herokuapp.com/api",
//     headers: { Authorization: "Bearer " + token },
//   });
// };

// export default getToken();

export default axios.create({
  baseURL: "https://zaunmap-6b1455b08c9b.herokuapp.com/api",
  // headers: { Authorization: "Bearer " + user?.token },
});
