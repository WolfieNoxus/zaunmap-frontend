import { useState } from "react";
import SearchBar from "../Elements/SearchBar";
import IUser from "../../../Interfaces/IUser";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const UserProfile = (userProfile: IUser) => {
  const { user, logout } = useAuth0();
  const [items, setItems] = useState(userProfile.project_list);

  const setItemsPublic = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, public: !item.public } : item
      )
    );
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <p>{user?.nickname}</p>
        {/* <p>Permission: {userProfile.userType}</p> */}
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
                  {item.map_name}
                </Link>
              </td>
              {/* <td>{item.userName}</td> */}
              <td>{item.tags}</td>
              <td>{item.views}</td>
              <td style={{ textAlign: "center" }}>
                {item.public ? (
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
