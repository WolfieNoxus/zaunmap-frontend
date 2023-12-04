// import { Link } from "react-router-dom";
// import IMap from "../Interfaces/IMap";
import IListUser from "../Interfaces/IListUser";
import IUser from "../Interfaces/IUser";
import useManageUsers from "../hooks/useManageUsers";
// import manageUserService from "../services/manageUserService";
import apiClient from "../services/apiClient";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const AdminPortal = () => {
  // const role = "admin";

  // const items: IMap[] = [
  //   {
  //     id: 1,
  //     map_name: "London Subway",
  //     tags: ["England", "Europe"],
  //     owner: "John",
  //     views: 1240,
  //     public: true,
  //     force_private: false,
  //     reports: 0,
  //   },
  //   {
  //     id: 2,
  //     map_name: "Long Island",
  //     tags: ["USA", "North America"],
  //     owner: "John",
  //     views: 1240,
  //     public: true,
  //     force_private: false,
  //     reports: 0,
  //   },
  //   {
  //     id: 3,
  //     map_name: "Paris",
  //     tags: ["French", "Europe"],
  //     owner: "John",
  //     views: 1240,
  //     public: true,
  //     force_private: false,
  //     reports: 0,
  //   },
  // ];

  const { users, error, isLoading, setUsers, setError } = useManageUsers();
  const [loading, setLoading] = useState(true);
  const [loggedinUser, setLoggedinUser] = useState<IUser>({
    userId: "",
    user_name: "",
    role: "user",
    maps: [],
  });
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchUserData = async (sub: string) => {
      try {
        const response = await apiClient.get(`/user?userId=${sub}`);
        if (response.status === 200) {
          const userData: IUser = response.data;
          // console.log("User data retrieved successfully:", userData);
          setLoggedinUser(userData);
        } else {
          console.error("Failed to retrieve user data");
          // Handle errors
        }
      } catch (err) {
        console.error("Error while fetching user data", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.sub) {
      fetchUserData(user.sub);
    }
  }, [isAuthenticated, user]);

  const setRestricted = (user: IListUser, status: boolean) => {
    const originalUsers: IListUser[] = [...users];
    const updatedUser: IListUser = {
      ...user,
      role: status ? "restricted" : "user",
    };
    setUsers(users.map((u) => (u.user_id === user.user_id ? updatedUser : u)));

    apiClient
      .put(`/user/restrict?user_id=${user.user_id}&restrict=${status}`)
      // .then((res) => {setUsers(res.data)})
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const setDisabled = (user: IListUser, status: boolean) => {
    const originalUsers: IListUser[] = [...users];
    const updatedUser: IListUser = {
      ...user,
      role: status ? "disabled" : "user",
    };

    setUsers(users.map((u) => (u.user_id === user.user_id ? updatedUser : u)));

    apiClient
      .put(`/user/disable?user_id=${user.user_id}&disable=${status}`)
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  if (loggedinUser.role === "admin") {
    return (
      <div className="admin-page">
        <div className="admin-portal-table my-3">
          {error && <p className="text-danger">{error}</p>}
          {isLoading && <div className="spinner-border"></div>}
          <table className="table">
            <thead>
              <tr>
                <th>User Name</th>
                {/* <th>Project Number</th> */}
                <th>Role</th>

                <th className="text-warning">Restrict</th>
                <th className="text-danger">Disabled</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_name}</td>
                  {/* <td>{user.project_list.length}</td> */}
                  <td>{user.role}</td>

                  <th>
                    {user.role === "restricted" ? (
                      <button
                        className="btn btn-warning"
                        onClick={() => setRestricted(user, false)}
                      >
                        Unrestrict
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => setRestricted(user, true)}
                      >
                        Restrict
                      </button>
                    )}
                    {/* <button
                    className="btn btn-outline-warning"
                    onClick={() => setRestricted(user)}
                  >
                    Restrict
                  </button> */}
                  </th>

                  <th>
                    {user.role === "disabled" ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => setDisabled(user, false)}
                      >
                        Enable
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => setDisabled(user, true)}
                      >
                        Disable
                      </button>
                    )}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    if (loading) {
      return (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      );
    }
  }
};

export default AdminPortal;
