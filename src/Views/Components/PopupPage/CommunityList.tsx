import SearchBar from "../Elements/SearchBar";
import { Link } from "react-router-dom";
import IUser from "../../../Interfaces/IUser";
// import useMaps from "../../../hooks/useMaps";
// import mapService from "../../../services/mapService";
import IMap from "../../../Interfaces/IMap";
import apiClient from "../../../services/apiClient";
import { useEffect, useState } from "react";

type CommunityListProps = Pick<IUser, "role">;

const CommunityList = ({ role }: CommunityListProps) => {
  // const { maps, error, isLoading, setMaps, setError } = useMaps();

  const [items, setItems] = useState<IMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const removePublic = (map: IMap) => {
    // const originalMaps: IMap[] = [...maps];
    // const updatedMap: IMap = {
    //   ...map,
    //   public: false,
    //   force_private: true,
    //   reports: 0,
    // };
    // setMaps(maps.map((m) => (m._id === map._id ? updatedMap : m)));

    // mapService.update(updatedMap).catch((err) => {
    //   setError(err.message);
    //   setMaps(originalMaps);
    // });

    // NOT IMPLEMENTED YET!

    return null;
  };

  const report = (map: IMap) => {
    // const originalMaps: IMap[] = [...maps];
    // const updatedMap: IMap = { ...map, reports: map.reports + 1 };
    // setMaps(maps.map((m) => (m._id === map._id ? updatedMap : m)));

    // mapService.update(updatedMap).catch((err) => {
    //   setError(err.message);
    //   setMaps(originalMaps);
    // });

    // NOT IMPLEMENTED YET!

    return null;
  };

  async function getPublic(): Promise<IMap[]> {
    const response = await apiClient.get("/map/public");
    const items: IMap[] = [];
    response.data.map((map: IMap) => {
      items.push(map);
      return null;
    });
    return items;
  };

  async function getUsername(user_id: string): Promise<string> {
    const response = await apiClient.get(`/user?user_id=${user_id}`);
    return response.data.user_name;
  }

  useEffect(() => {
    const fetchMaps = async () => {
      setLoading(true);
      try {
        const fetchedItems = await getPublic();
        for (let i = 0; i < fetchedItems.length; i++) {
          fetchedItems[i].author = await getUsername(fetchedItems[i].author);
        }
        setItems(fetchedItems);
      } catch (err) {
        setError('Failed to fetch maps');
        // If the error is an instance of an Error, you could set it as setError(err.message)
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  return (
    <div>
      <SearchBar />
      {/* <span>View type: {role === "admin" ? "Admin" : "User"}</span> */}
      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Author</th>
              <th>Tags</th>
              <th>Likes</th>
              {role === "admin" ? (
                <th className="text-danger">Ban</th>
              ) : (
                <th className="text-warning">Report</th>
              )}
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
                <td>{item.author}</td>
                <td>{item.tags.toString()}</td>
                <td>{item.likes}</td>
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
                      className="btn btn-outline-warning"
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
      )}
    </div>
  );
};

export default CommunityList;
