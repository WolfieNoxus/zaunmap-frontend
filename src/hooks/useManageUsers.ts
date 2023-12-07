import { useEffect, useState } from "react";
// import manageUserService from "../services/manageUserService";
import { CanceledError } from "axios";
import IListUser from "../Interfaces/IListUser";
import apiClient from "../services/apiClient";

const useUsers = () => {
  const [users, setUsers] = useState<IListUser[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // axios
    //   .get("https://zaunmap-6b1455b08c9b.herokuapp.com/api/user/list", {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    //         "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    //     },
    //   })
    //   .then((res) => console.log(res.data))
    //   .catch((err) => console.log(err));

    // const res = await fetch("https://zaunmap-6b1455b08c9b.herokuapp.com/api/user/list", {
    //   method: "GET",
    // })

    setLoading(true);
    const controller = new AbortController();
    const request = apiClient.get<IListUser[]>("/user/search", {
      signal: controller.signal,
    });
    const cancel = () => controller.abort();

    request
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { users, error, isLoading, setUsers, setError };
};

export default useUsers;
