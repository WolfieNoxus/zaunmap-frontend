import { useState, useEffect, KeyboardEvent } from "react";

import IUser from "../../../Interfaces/IUser";
import IMap from "../../../Interfaces/IMap";
// import SearchBar from "../Elements/SearchBar";
import apiClient from "../../../services/apiClient";
import { AxiosError } from "axios";

import "./css/userProfile.css";
import "../Elements/css/tags.css";

import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { HiEye, HiEyeOff, HiPencil, HiCheck, HiX } from "react-icons/hi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
// import Tags from "../Elements/Tags";

// interface IUserResponse {
//   userId: string;
//   name: string;
//   role: string;
// }

interface ITagProps {
  mapId: string;
  initialTags: string[];
}

const UserProfile = (userProfile: IUser) => {
  const { user, logout } = useAuth0();

  const [items, setItems] = useState([] as IMap[]);
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const [newUsername, setNewUsername] = useState<string>("");
  const [userData, setUserData] = useState<IUser>();
  const [error, setError] = useState<string>("");

  let navigate = useNavigate();

  useEffect(() => {
    // console.log(user);
    // Fetch user data when the component mounts and the user object is available

    const fetchUserData = async (sub: string) => {
      try {
        const response = await apiClient.get(`/user?userId=${sub}`);
        if (response.status === 200) {
          const userData: IUser = response.data;
          console.log("User data retrieved successfully:", userData);
          setUserData(userData);

          if (user?.nickname !== undefined && userData.name === "") {
            setNewUsername(
              userData.name === "" ? user?.nickname : userData.name
            );

            // updateUsername(user?.sub, newUsername)
          } else {
            setNewUsername(userData.name);
          }
          const mapList = [];
          for (let i = 0; i < userData.maps.length; i++) {
            const response = await apiClient.get(
              `/map?mapId=${userData.maps[i]}`
            );
            if (response.status === 200) {
              const mapData: IMap = response.data;
              mapList.push(mapData);
            } else {
              console.error("Failed to retrieve map data");
              // Handle errors
            }
          }
          setItems(mapList);
        } else {
          console.error("Failed to retrieve user data");
          // Handle errors
        }
      } catch (err) {
        setError(
          "Failed to retrieve user data: " + (err as AxiosError).message
        );
        console.error("Error while fetching user data", err);
        // Handle errors
      }
    };

    if (user?.sub) {
      fetchUserData(user.sub);
    }

    //eslint-disable-next-line
  }, [user]);

  // Function to handle public/private toggle
  const setItemsPublic = (id: string) => {
    setItems(
      items.map((i) => (i._id === id ? { ...i, isPublic: !i.isPublic } : i))
    );
    apiClient
      .put(`/map?mapId=${id}`, {
        isPublic: !items.find((i) => i._id === id)?.isPublic,
      })
      .catch((err) => {
        setError(err.message);
      });
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
      const res = await apiClient.put(
        `/user/rename?userId=${sub}&newName=${encodeURIComponent(new_name)}`,
        {
          userId: sub,
          name: new_name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`, // Make sure you use the correct token
          },
        }
      );

      if (res.status === 200) {
        console.log("Username updated successfully");
        setUserData({ ...userData, name: new_name });
        setNewUsername(new_name);
      } else {
        console.error("Failed to update username");
        // Handle errors, possibly by parsing the response JSON
      }
    } catch (err) {
      setError("Failed to update username: " + (err as AxiosError).message);
      console.error("Error while updating username", err);
      // Handle errors
    } finally {
      setIsEditing(false);
    }
  };

  // Delete map project
  const deleteMap = async (item: IMap) => {
    try {
      const response = await apiClient.delete(`/map?mapId=${item._id}`);

      if (response.status === 200) {
        console.log("Map deleted successfully");
        setItems(items.filter((i) => i._id !== item._id));
      } else {
        console.error("Failed to delete map");
        // Handle errors
      }
    } catch (err) {
      setError("Failed to delete map: " + (err as AxiosError).message);
      console.error("Error while deleting map", err);
      // Handle errors
    }
  };

  const addTag = async (mapId: string, newTags: string[]) => {
    // Find the current map and prepare updated tags
    // const currentMap = items.find((item) => item._id === mapId);
    // if (!currentMap) {
    //   console.error("Map not found");
    //   return;
    // }
    try {
      // Call the backend API to update the tags
      const response = await apiClient.put(`/map?mapId=${mapId}`, {
        tags: newTags,
      });
      if (response.status === 200) {
        console.log("Tags updated successfully");
        // Update the state to reflect the new tags
        setItems(
          items.map((item) =>
            item._id === mapId ? { ...item, tags: newTags } : item
          )
        );
      } else {
        console.error("Failed to update tags");
        // Handle errors
      }
    } catch (err) {
      console.error("Error while updating tags", err);
      // Handle errors
    }
  };

  // TagInput component
  const Tags = ({ mapId, initialTags }: ITagProps) => {
    const [tags, setTags] = useState(initialTags);
    const [input, setInput] = useState("");

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && input) {
        const newTags = [...tags, input];
        setInput("");
        setTags(newTags);
        addTag(mapId, newTags); // Call the addTag function to update the backend
      }
    };

    const removeTag = (index: number) => {
      const newTags = tags.filter((_, idx) => idx !== index);
      setTags(newTags);
      addTag(mapId, newTags); // Update the backend
    };

    return (
      <div className="tag-block">
        {/* tag-input-container */}
        {tags.map((tag, index) => (
          <div className="tag" key={index}>
            {tag}
            <IoIosClose
              className="remove-tag"
              size={20}
              onClick={() => removeTag(index)}
            />
          </div>
        ))}
        {/* <div className="input-box-tag">
          <IoIosAdd size={20} />
        </div> */}
        <input
          className="input-box-tag"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New Tag"
        />
      </div>
    );
  };

  // const handleSearch = async (
  //   name: string,
  //   // tags: string,
  //   sortBy: string,
  //   sortOrder: string
  // ) => {
  //   try {
  //     const response = await apiClient.get("/user/search", {
  //       params: { name, sortBy, sortOrder },
  //     });
  //     if (response.status === 200) {
  //       // const filteredUserMaps = (response.data as IMap[]).filter(
  //       //   (map) => map.owner === user?.sub
  //       // );
  //       // console.log(filteredUserMaps);
  //       setItems(response.data as IMap[]);
  //     } else {
  //       // Handle non-200 responses
  //       console.error("Failed to retrieve search results");
  //     }
  //   } catch (error) {
  //     // Handle errors
  //     setError("Failed to retrieve search results: " + error);
  //     console.error("Error fetching search results:", error);
  //   }
  // };

  // Page Flip Code
  const itemsPerPage = 4;

  const [currentPage, setCurrentPage] = useState<number>(1);
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
              <span className="username-label">UserName:</span>

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
              <span className="username-label">UserName:</span>
              <span className="username-text">{newUsername}</span>
              <HiPencil
                onClick={() => setIsEditing(true)}
                className="icon-edit"
              />
            </div>
          )}
        </div>
      </div>
      {/* <div className="mb-3 profile-center">
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
      </div> */}

      {/* <SearchBar onSearch={handleSearch} tagsExist={false} /> */}
      <span className="text-danger">{error} </span>
      <table className="table mb-3">
        <colgroup>
          <col style={{ width: "25%" }} />
          <col style={{ width: "57%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Project Name</th>
            {/* <th>User</th> */}
            <th>tags</th>
            <th style={{ textAlign: "center" }}>Public</th>
            <th style={{ textAlign: "center" }}>Delete</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td style={{ verticalAlign: "middle" }}>
                <Link reloadDocument to={"/map/" + item._id}>
                  {item.name}
                </Link>
              </td>
              {/* <td>{item.userName}</td> */}
              <td>
                <Tags mapId={item._id} initialTags={item.tags || []} />
              </td>
              {/* <td>{item.views}</td> */}
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                {item.isPublic ? (
                  <HiEye
                    onClick={() => setItemsPublic(item._id)}
                    size={20}
                    color="6A738B"
                  />
                ) : (
                  <HiEyeOff
                    onClick={() => setItemsPublic(item._id)}
                    size={20}
                    color="6A738B"
                  />
                )}
              </td>
              <td
                className="text-danger"
                style={{ textAlign: "center", verticalAlign: "middle" }}
                onClick={() => deleteMap(item)}
              >
                <RiDeleteBin5Line size={30} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bottom-box-line mb-3">
        {items.length >= itemsPerPage ? (
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
        ) : null}
        <div className="log-out-box">
          {userData?.role === "admin" ? (
            <button
              className="btn btn-info me-5"
              onClick={() => {
                navigate("/admin/");
              }}
            >
              Admin Portal
            </button>
          ) : null}
          {/* style={{ textAlign: "center" }} */}
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
    </div>
  );
};

export default UserProfile;
