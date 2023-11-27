import { useState, useEffect } from "react";
import SearchBar from "../Elements/SearchBar";
import IUserProfileProps from "./Interfaces/IUserProfileProps";
import {HiEye, HiEyeOff, HiPencil, HiCheck, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/userProfile.css";

const UserProfile = (userProfile: IUserProfileProps) => {
  const { user, logout} = useAuth0();
  const [items, setItems] = useState(userProfile.projectList);
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const [newUsername, setNewUsername] = useState<string | undefined>(user?.nickname);

  useEffect(() => {
    setNewUsername(user?.nickname);
    console.log(user);
  }, [user]);

  const setItemsPublic = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, viewPublic: !item.viewPublic } : item
      )
    );
  };

  // Function to handle username update
  const updateUsername = async () => {
    try {
      // Replace with your actual backend API endpoint
      const response = await fetch('/api/updateUsername', {
        method: 'PUT', // Changed to PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUsername }),
      });

      if (response.ok) {
        console.log("Username updated successfully");
        console.log(user);
        // Update the UI as necessary
      } else {
        console.error("Failed to update username");
        // Handle errors
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
            <HiCheck onClick={updateUsername} className="icon-check"/>
            <HiX onClick={() => setIsEditing(false)} className="icon-close"/>
          </div>
        ) : (
          <div className="display-username">
            <p className="username-text">{newUsername}</p>
            <HiPencil onClick={() => setIsEditing(true)} className="icon-edit"/>
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
            <tr key={item.id}>
              <td>
                <Link reloadDocument to={"/map/" + item.id}>
                  {item.projecName}
                </Link>
              </td>
              {/* <td>{item.userName}</td> */}
              <td>{item.tags}</td>
              <td>{item.view}</td>
              <td style={{ textAlign: "center" }}>
                {item.viewPublic ? (
                  <HiEye
                    onClick={() => setItemsPublic(item.id)}
                    color="6A738B"
                  />
                ) : (
                  <HiEyeOff
                    onClick={() => setItemsPublic(item.id)}
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
