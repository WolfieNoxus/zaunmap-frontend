import SearchBar from "../Elements/SearchBar";
import { Link } from "react-router-dom";
import IUser from "../../../Interfaces/IUser";
// import useMaps from "../../../hooks/useMaps";
// import mapService from "../../../services/mapService";
import IMap from "../../../Interfaces/IMap";
import apiClient from "../../../services/apiClient";
import { useEffect, useState } from "react";
// import FlipPage from "react-flip-page";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type CommunityListProps = Pick<IUser, "role">;

const CommunityList = ({ role }: CommunityListProps) => {
  // const { maps, error, isLoading, setMaps, setError } = useMaps();

  const [items, setItems] = useState<IMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

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

  const rate = async (map: IMap, userRating: number, userId: string) => {
    try {
      console.log("print map object in const rate: " + map.name);
      const response = await apiClient.put(`/map/rate?userId=${userId}&mapId=${map._id}$rating=${userRating}`);
      const updatedMap = response.data;
      
      // Update local state with the updated map data
      setItems(items.map(item => item._id === updatedMap._id ? updatedMap : item));
  
    } catch (error) {
      // Handle any errors
      console.error("Error updating rating:", error);
    }
  };
  

  async function getPublic(): Promise<IMap[]> {
    const response = await apiClient.get(`/map/search`);
    // console.log("response from getPublic(): " + response.data);
    const items: IMap[] = [];
    response.data.map((map: IMap) => {
      items.push(map);
      return null;
    });
    // console.log("items list: " + items);
    return items;
  }

  async function getUsername(userId: string): Promise<string> {
    const response = await apiClient.get(`/user?userId=${userId}`);
    // console.log(userId);
    // console.log(response);
    return response.data.name;
  }

  useEffect(() => {
    const fetchMaps = async () => {
      setLoading(true);
      try {
        const fetchedItems = await getPublic();
        console.log(fetchedItems);
        for (let i = 0; i < fetchedItems.length; i++) {
          console.log("item owner: " + fetchedItems[i].owner);
          fetchedItems[i].owner = await getUsername(fetchedItems[i].owner);
        }
        setItems(fetchedItems);
      } catch (err) {
        setError("Failed to fetch maps");
        // If the error is an instance of an Error, you could set it as setError(err.message)
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);
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
                <th className="text-warning">Rate</th>
              )}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {currentItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <Link reloadDocument to={"/map/" + item._id}>
                    {item.name}
                  </Link>
                </td>
                <td>{item.owner}</td>
                <td>{item.tags.toString()}</td>
                <td>{item.averageRating}</td>
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
                    {item.averageRating.toFixed(1)} ({item.ratingsCount})
                    <input 
                      type="number" 
                      value={userRating} 
                      onChange={(e) => setUserRating(Number(e.target.value))} 
                    />
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => rate(item, userRating, item.owner)}
                    >
                      Rate
                    </button>
                  </th>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {items.length > itemsPerPage ? (
        <div>
          <button
            className="btn"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <MdChevronLeft />
          </button>
          <button
            className="btn"
            onClick={goToNextPage}
            disabled={currentPage === maxPage}
          >
            <MdChevronRight />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CommunityList;
