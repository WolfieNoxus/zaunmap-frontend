import SearchBar from "../Elements/SearchBar";
import { Link } from "react-router-dom";
import IUser from "../../../Interfaces/IUser";
import useMaps from "../../../hooks/useMaps";
import mapService from "../../../services/mapService";
import IMap from "../../../Interfaces/IMap";

type CommunityListProps = Pick<IUser, "role">;

const CommunityList = ({ role }: CommunityListProps) => {
  const { maps, error, isLoading, setMaps, setError } = useMaps();

  const removePublic = (map: IMap) => {
    const originalMaps: IMap[] = [...maps];
    const updatedMap: IMap = {
      ...map,
      public: false,
      force_private: true,
      reports: 0,
    };
    setMaps(maps.map((m) => (m.id === map.id ? updatedMap : m)));

    mapService.update(updatedMap).catch((err) => {
      setError(err.message);
      setMaps(originalMaps);
    });
  };

  const report = (map: IMap) => {
    const originalMaps: IMap[] = [...maps];
    const updatedMap: IMap = { ...map, reports: map.reports + 1 };
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
      reports: 0,
    },
    {
      id: 2,
      map_name: "Long Island",
      tags: ["USA", "North America"],
      owner: "John",
      views: 1240,
      public: true,
      force_private: false,
      reports: 0,
    },
    {
      id: 3,
      map_name: "Paris",
      tags: ["French", "Europe"],
      owner: "John",
      views: 1240,
      public: true,
      force_private: false,
      reports: 0,
    },
  ];

  return (
    <div>
      <SearchBar />
      <span>View type: {role === "user" ? "User" : "Admin"}</span>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Author</th>
            <th>tags</th>
            <th>view</th>
            {role === "admin" ? (
              <th className="text-danger">Ban</th>
            ) : (
              <th className="text-warning">Report</th>
            )}
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
              {role === "admin" ? (
                <th>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => removePublic(item)}
                  >
                    Ban
                  </button>
                </th>
              ) : (
                <th>
                  <button
                    className="btn btn-warning"
                    onClick={() => report(item)}
                  >
                    Report
                  </button>
                </th>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommunityList;
