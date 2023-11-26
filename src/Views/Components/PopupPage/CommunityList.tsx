import SearchBar from "../Elements/SearchBar";
import { Link } from "react-router-dom";

interface IUserType {
  userType: string;
}

const CommunityList = ({userType}: IUserType) => {
  
  const items = [
    {
      id: 1,
      projecNname: "London Subway",
      tags: "England, Europe",
      userName: "John",
      view: 1240,
      viewPublic: true,
    },
    {
      id: 2,
      projecNname: "Long Island",
      tags: "USA, North America",
      userName: "John",
      view: 1240,
      viewPublic: true,
    },
    {
      id: 3,
      projecNname: "Paris",
      tags: "French, Europe",
      userName: "John",
      view: 1240,
      viewPublic: true,
    },
  ];

  return (
    <div>
      <SearchBar />
      <span>View type: {userType === "user" ? "User" : "Admin"}</span>
      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>User</th>
            <th>tags</th>
            <th>view</th>
            {userType === "admin" ? (<th>Delete</th>) : null}
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {items.map((item) => (
            <tr key={item.id}>
              <td><Link reloadDocument to={"/map/"+item.id}>{item.projecNname}</Link></td>
              <td>{item.userName}</td>
              <td>{item.tags}</td>
              <td>{item.view}</td>
              {userType === "admin" ? (<th className="text text-danger">Delete</th>) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommunityList;
