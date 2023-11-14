import { useState } from "react";
import SearchBar from "../Elements/SearchBar";
import  IUserProfileProps from "./Interfaces/IUserProfileProps";

const UserProfile = (userProfile: IUserProfileProps) => {
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
      <p>{userProfile.userName}</p>
      <p>{userProfile.userType}</p>

      <SearchBar />
      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>User</th>
            <th>tags</th>
            <th>view</th>
            <th>Public</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.projecNname}</td>
              <td>{item.userName}</td>
              <td>{item.tags}</td>
              <td>{item.view}</td>
              <td onClick={() => (setItemsPublic(item.id))}>
                {item.viewPublic}
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
