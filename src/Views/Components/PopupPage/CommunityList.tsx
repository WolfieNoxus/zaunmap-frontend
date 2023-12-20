import SearchBar from "../Elements/SearchBar";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import IUser from "../../../Interfaces/IUser";
// import useMaps from "../../../hooks/useMaps";
// import mapService from "../../../services/mapService";
import IMap from "../../../Interfaces/IMap";
import apiClient from "../../../services/apiClient";
import { useEffect, useState } from "react";
// import FlipPage from "react-flip-page";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
type CommunityListProps = Pick<IUser, "role">;
type UsernamesMap = {
  [key: string]: string; // This denotes an object with string keys and string values
};
const CommunityList = ({ role }: CommunityListProps) => {
  // const { maps, error, isLoading, setMaps, setError } = useMaps();

  const [items, setItems] = useState<IMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [usernames, setUsernames] = useState<UsernamesMap>({});
  const { user } = useAuth0();

  const handleRatingChange = (newRating: number, item: IMap) => {
    setUserRating(newRating);
    console.log(userRating);
    rate(item, newRating, user?.sub as string); // Assuming 'rate' is your function to submit the rating
  };

  /*const removePublic = (map: IMap) => {
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
  };*/

  const rate = async (map: IMap, userRating: number, userId: string) => {
    try {
      console.log("map : ", map);
      console.log("userRating: ", userRating);
      console.log("userId: ", userId);

      const response = await apiClient.put(
        `/map/rate?userId=${userId}&mapId=${map._id}&rating=${userRating}`
      );
      const updatedMap = response.data;
      
      console.log(response.data);
      // Update local state with the updated map data
      setItems(
        items.map((item) => (item._id === updatedMap._id ? updatedMap : item))
      );
      // console.log(items);
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
    return response.data.name;
  }

  useEffect(() => {
    const fetchMaps = async () => {
      setLoading(true);
      try {
        const fetchedItems = await getPublic();
        console.log(fetchedItems);

        /*for (let i = 0; i < fetchedItems.length; i++) {
          console.log(fetchedItems[i]);
          console.log("item owner: ", fetchedItems[i].owner);
          fetchedItems[i].owner = await getUsername(fetchedItems[i].owner);
        }*/
        setItems(fetchedItems);
        const newUsernames: UsernamesMap = {};
        for (const item of fetchedItems) {
          const username = await getUsername(item.owner);
          newUsernames[item._id] = username;
        }
        setUsernames(newUsernames);
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
              <th style={{ width: "25%" }}>Project Name</th>
              <th style={{ width: "25%" }}>Author</th>
              <th style={{ width: "25%" }}>Tags</th>
              <th style={{ width: "25%" }}>Rate</th>
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
                <td>{usernames[item._id]}</td>
                <td>{item.tags.toString()}</td>
                <td>
                  <ReactStars
                    count={5}
                    onChange={(newRating: number) =>
                      handleRatingChange(newRating, item)
                    }
                    size={24}
                    activeColor="#ffd700"
                    value={item.averageRating}
                  />
                </td>
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
