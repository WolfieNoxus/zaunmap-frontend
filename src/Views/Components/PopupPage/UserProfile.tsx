import { useState } from "react";
import SearchBar from "../Elements/SearchBar";
import IUserProfileProps from "./Interfaces/IUserProfileProps";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const UserProfile = (userProfile: IUserProfileProps) => {
  const { user, logout } = useAuth0();
  const [items, setItems] = useState(userProfile.projectList);

  const setItemsPublic = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, viewPublic: !item.viewPublic } : item
      )
    );
  };

  return (
    <div>
      <div>
        <p>{user?.nickname}</p>
        {/* <p>Permission: {userProfile.userType}</p> */}
        <span
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </span>
      </div>

      <SearchBar />
      <table className="table">
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
    </div>
  );
};

export default UserProfile;
