// import { Link } from "react-router-dom";
// import IMap from "../Interfaces/IMap";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
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
    name: "",
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
    setUsers(users.map((u) => (u.userId === user.userId ? updatedUser : u)));

    apiClient
      .put(`/user/role?userId=${user.userId}&newRole=${updatedUser.role}`)
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

    setUsers(users.map((u) => (u.userId === user.userId ? updatedUser : u)));

    apiClient
      .put(`/user/role?userId=${user.userId}&newRole=${updatedUser.role}`)
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const itemsPerPage = 9;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const maxPage = Math.ceil(users.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentusers = users.slice(startIndex, endIndex);

  const goToNextPage = () =>
    setCurrentPage((page) => Math.min(page + 1, maxPage));
  const goToPreviousPage = () =>
    setCurrentPage((page) => Math.max(page - 1, 1));

  if (loggedinUser.role === "admin") {
    return (
      <div className="admin-page">
        <div className="admin-portal-table my-3">
          {error && <p className="text-danger">{error}</p>}
          {isLoading && <div className="spinner-border"></div>}
          <table className="table" style={{ borderRadius: "8px" }}>
            <thead>
              <tr style={{ borderRadius: "8px" }}>
                <th>User Name</th>
                {/* <th>Project Number</th> */}
                <th>Role</th>

                <th className="text-warning">Restrict</th>
                <th className="text-danger">Disabled</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentusers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.name}</td>
                  {/* <td>{user.project_list.length}</td> */}
                  <td>{user.role}</td>

                  <td>
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
                  </td>

                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button
            className="btn"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <MdChevronLeft />
          </button>
          <span className="mx-2">
            Page {currentPage} of {maxPage}
          </span>
          <button
            className="btn"
            onClick={goToNextPage}
            disabled={currentPage === maxPage}
          >
            <MdChevronRight />
          </button>
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
