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

interface ITagProps {
  mapId: string;
  initialTags: string[];
}
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

      // Update local state with the updated map data
      setItems(
        items.map((item) => (item._id === updatedMap._id ? updatedMap : item))
      );
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

  // set project tags
  // const addTag = async (mapId: string, newTags: string[]) => {
  //   // Find the current map and prepare updated tags
  //   // const currentMap = items.find((item) => item._id === mapId);
  //   // if (!currentMap) {
  //   //   console.error("Map not found");
  //   //   return;
  //   // }
  //   try {
  //     // Call the backend API to update the tags
  //     const response = await apiClient.put(`/map?mapId=${mapId}`, {
  //       tags: newTags,
  //     });
  //     if (response.status === 200) {
  //       console.log("Tags updated successfully");
  //       // Update the state to reflect the new tags
  //       setItems(
  //         items.map((item) =>
  //           item._id === mapId ? { ...item, tags: newTags } : item
  //         )
  //       );
  //     } else {
  //       console.error("Failed to update tags");
  //       // Handle errors
  //     }
  //   } catch (err) {
  //     console.error("Error while updating tags", err);
  //     // Handle errors
  //   }
  // };

  // TagInput component
  const Tags = ({ mapId, initialTags }: ITagProps) => {
    const tags = initialTags;

    return (
      <div className="tag-block">
        {/* tag-input-container */}
        {tags.map((tag, index) => (
          <div className="tag" key={index}>
            {tag}
          </div>
        ))}
        {/* <div className="input-box-tag">
          <IoIosAdd size={20} />
        </div> */}
      </div>
    );
  };

  const handleSearch = async (
    name: string,
    tags: string,
    sortBy: string,
    sortOrder: string
  ) => {
    try {
      const response = await apiClient.get("/map/search", {
        params: { name, tags, sortBy, sortOrder },
      });
      if (response.status === 200) {
        setItems(response.data as IMap[]);
      } else {
        // Handle non-200 responses
        console.error("Failed to retrieve search results");
      }
    } catch (error) {
      // Handle errors
      setError("Failed to retrieve search results: " + error);
      console.error("Error fetching search results:", error);
    }
  };

  const itemsPerPage = 4;

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
      {/* <span>View type: {role === "admin" ? "Admin" : "User"}</span> */}
      {error && <p className="text-danger">{error}</p>}
      <SearchBar onSearch={handleSearch} />
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
                <td style={{ verticalAlign: "middle" }}>
                  <Link reloadDocument to={"/map/" + item._id}>
                    {item.name}
                  </Link>
                </td>

                <td style={{ verticalAlign: "middle" }}>
                  {usernames[item._id]}
                </td>

                <td style={{ verticalAlign: "middle" }}>
                  <Tags mapId={item._id} initialTags={item.tags || []} />
                </td>

                <td style={{ verticalAlign: "middle" }}>
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
    </div>
  );
};

export default CommunityList;
