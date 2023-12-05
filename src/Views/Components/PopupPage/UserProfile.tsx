import { useState, useEffect } from "react";
import SearchBar from "../Elements/SearchBar";
import IUser from "../../../Interfaces/IUser";
import { HiEye, HiEyeOff, HiPencil, HiCheck, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import apiClient from "../../../services/apiClient";
import "./css/userProfile.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface IUserResponse {
  user_id: string;
  user_name: string;
  role: string;
}

const UserProfile = (userProfile: IUser) => {
  const { user, logout } = useAuth0();

  const [items, setItems] = useState(userProfile.maps);
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const [newUsername, setNewUsername] = useState<string>("");
  const [userData, setUserData] = useState<IUserResponse>();

  let navigate = useNavigate();

  // useEffect(() => {
  //   getAccessTokenSilently()
  //     .then((res) => {
  //       setToken(res);
  //       console.log(token);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //     });
  // }, [token, getAccessTokenSilently]);

  useEffect(() => {
    // console.log(user);
    // Fetch user data when the component mounts and the user object is available

    const fetchUserData = async (sub: string) => {
      try {
        const response = await apiClient.get(`/user?userId=${sub}`);
        if (response.status === 200) {
          const userData: IUserResponse = response.data;
          // console.log("User data retrieved successfully:", userData);
          setUserData(userData);
          setNewUsername(userData.user_name);
        } else {
          console.error("Failed to retrieve user data");
          // Handle errors
        }
      } catch (err) {
        console.error("Error while fetching user data", err);
        // Handle errors
      }
    };

    if (user?.sub) {
      fetchUserData(user.sub);
    }
  }, [user]);

  const setItemsPublic = (id: string) => {
    setItems(
      items.map((item) =>
        item._id === id ? { ...item, public: !item.public } : item
      )
    );
  };

  // Function to handle username update
  const updateUsername = async (
    sub: string | undefined,
    new_name: string | undefined
  ) => {
    if (!sub || !new_name) {
      console.error("Email or new username is undefined");
      return;
    }
    if (!userData || !newUsername) {
      console.error("Missing user data or new username");
      return;
    }

    try {
      const response = await fetch(
        `https://zaunmap-6b1455b08c9b.herokuapp.com/api/user/rename?userId=${sub}&new_name=${encodeURIComponent(
          new_name
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`, // Make sure you use the correct token
          },
          body: JSON.stringify({
            user_id: sub,
            new_name: new_name,
          }),
        }
      );

      if (response.ok) {
        console.log("Username updated successfully");
        setUserData({ ...userData, user_name: new_name });
        setNewUsername(new_name);
      } else {
        console.error("Failed to update username");
        // Handle errors, possibly by parsing the response JSON
      }
    } catch (error) {
      console.error("Error while updating username", error);
      // Handle errors
    } finally {
      setIsEditing(false);
    }
  };

  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(items.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToNextPage = () =>
    setCurrentPage((page) => Math.min(page + 1, maxPage));
  const goToPreviousPage = () =>
    setCurrentPage((page) => Math.max(page - 1, 1));

  return (
    <div>
      <div className="profile-center">
        <div className="username-section mb-3">
          {isEditing ? (
            <div className="display-username">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="edit-username-input"
              />
              <HiCheck
                onClick={() => updateUsername(user?.sub, newUsername)}
                className="icon-check"
              />
              <HiX onClick={() => setIsEditing(false)} className="icon-close" />
            </div>
          ) : (
            <div className="display-username">
              <span className="text username-text">{newUsername}</span>
              <HiPencil
                onClick={() => setIsEditing(true)}
                className="icon-edit"
              />
            </div>
          )}
        </div>
      </div>
      <div className="mb-3 profile-center">
        {userData?.role === "admin" ? (
          <button
            className="btn btn-info"
            onClick={() => {
              navigate("/admin/");
            }}
          >
            Admin Portal
          </button>
        ) : null}
      </div>

      <SearchBar />
      <table className="table mb-3">
        <thead>
          <tr>
            <th>Project Name</th>
            {/* <th>User</th> */}
            <th>tags</th>
            <th>view</th>
            <th>Public</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td>
                <Link reloadDocument to={"/map/" + item._id}>
                  {item.name}
                </Link>
              </td>
              {/* <td>{item.userName}</td> */}
              <td>{item.tags}</td>
              <td>{item.views}</td>
              <td style={{ textAlign: "center" }}>
                {item.public ? (
                  <HiEye
                    onClick={() => setItemsPublic(item._id)}
                    color="6A738B"
                  />
                ) : (
                  <HiEyeOff
                    onClick={() => setItemsPublic(item._id)}
                    color="6A738B"
                  />
                )}
              </td>
              <td className="text-danger">Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length > itemsPerPage ? (
        <div>
          <button
            className="btn"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <MdChevronLeft />
          </button>
          <button
            className="btn"
            onClick={goToNextPage}
            disabled={currentPage === maxPage}
          >
            <MdChevronRight />
          </button>
        </div>
      ) : null}
      <div style={{ textAlign: "center" }}>
        <button
          className="btn btn-primary"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
