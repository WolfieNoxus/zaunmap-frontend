import { useState, useEffect } from "react";
import SearchBar from "../Elements/SearchBar";
import IUser from "../../../Interfaces/IUser";
import { HiEye, HiEyeOff, HiPencil, HiCheck, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import apiClient from "../../../services/apiClient";
import "./css/userProfile.css";

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
        const response = await apiClient.get(`/user?user_id=${sub}`);
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

  });

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
        `https://zaunmap-6b1455b08c9b.herokuapp.com/api/user/rename?user_id=${sub}&new_name=${encodeURIComponent(new_name)}`,
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

  return (
    <div>
      <div className="username-section">
        {isEditing ? (
          <div className="edit-username">
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
            <p className="username-text">{newUsername}</p>
            <HiPencil
              onClick={() => setIsEditing(true)}
              className="icon-edit"
            />
          </div>
        )}
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
          {items.map((item) => (
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
