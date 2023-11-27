import SearchBar from "../Elements/SearchBar";
import { Link } from "react-router-dom";
import IUser from "../../../Interfaces/IUser";
import useMaps from "../../../hooks/useMaps";
import mapService from "../../../services/mapService";
import IMap from "../../../Interfaces/IMap";

type CommunityListProps = Pick<IUser, "permission">;

const CommunityList = ({ permission }: CommunityListProps) => {
  const { maps, error, isLoading, setMaps, setError } = useMaps();

  const updatePublic = (map: IMap) => {
    const originalMaps: IMap[] = [...maps];
    const updatedMap: IMap = { ...map, public: false, force_private: true };
    setMaps(maps.map((m) => (m.id === map.id ? updatedMap : m)));

    mapService.update(updatedMap).catch((err) => {
      setError(err.message);
      setMaps(originalMaps);
    });
  };

  const items: IMap[] = [
    {
      id: 1,
      map_name: "London Subway",
      tags: ["England", "Europe"],
      owner: "John",
      views: 1240,
      public: true,
      force_private: false,
    },
    {
      id: 2,
      map_name: "Long Island",
      tags: ["USA", "North America"],
      owner: "John",
      views: 1240,
      public: true,
      force_private: false,
    },
    {
      id: 3,
      map_name: "Paris",
      tags: ["French", "Europe"],
      owner: "John",
      views: 1240,
      public: true,
      force_private: false,
    },
  ];

  return (
    <div>
      <SearchBar />
      <span>View type: {permission === "user" ? "User" : "Admin"}</span>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>User</th>
            <th>tags</th>
            <th>view</th>
            {permission === "admin" ? <th>Delete</th> : null}
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
              <td>{item.owner}</td>
              <td>{item.tags}</td>
              <td>{item.views}</td>
              {permission === "admin" ? (
                <th>
                  <button
                    className="btn btn-outline-secondary mx-2"
                    onClick={() => updatePublic(item)}
                  >
                    Update
                  </button>
                </th>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommunityList;
