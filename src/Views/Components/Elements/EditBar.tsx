import React, { useEffect, useState, KeyboardEvent } from "react";
import IEditProps from "../../../Interfaces/IEditProps";
import apiClient from "../../../services/apiClient";
import "./css/editBar.css";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import ReactStars from "react-rating-stars-component";
// import IGeoJsonProperties from "../../../Interfaces/IGeoJsonProperties";

interface ITagProps {
  mapId: string;
  initialTags: string[];
}

const EditBar: React.FC<IEditProps> = ({
  onClose,
  mapProject,
  selectedProperties,
  setNewProperties,
}) => {
  const [currentProjecName, setCurrentProjectName] = useState<string>(
    mapProject.name
  );
  const [isPublic, setIsPublic] = useState<boolean>(mapProject.isPublic);
  const [tags, setTags] = useState<string[]>(mapProject.tags);
  // const [newTag, setNewTag] = useState<string>("");

  // update project name
  useEffect(() => {
    const updateProjectName = async (newName: string) => {
      try {
        const response = await apiClient.put(`/map?mapId=${mapProject._id}`, {
          name: newName,
        });
        if (response.status === 200) {
          console.log("Project name updated successfully");
        } else {
          console.error("Failed to update project name");
          // Handle errors
        }
      } catch (err) {
        console.error("Error while updating project name", err);
      }
    };
    if (currentProjecName !== mapProject.name) {
      updateProjectName(currentProjecName);
    }
    // eslint-disable-next-line
  }, [currentProjecName]);

  // set project public or not
  useEffect(() => {
    const updateProjectPublic = async (newPublic: boolean) => {
      try {
        const response = await apiClient.put(`/map?mapId=${mapProject._id}`, {
          isPublic: newPublic,
        });
        if (response.status === 200) {
          mapProject.isPublic = newPublic;
          console.log("Project public updated successfully");
        } else {
          console.error("Failed to update project public");
          // Handle errors
        }
      } catch (err) {
        console.error("Error while updating project public", err);
      }
    };
    if (isPublic !== mapProject.isPublic) {
      updateProjectPublic(isPublic);
    }
    // eslint-disable-next-line
  }, [isPublic]);

  // set project tags
  const addTag = async (mapId: string, newTags: string[]) => {
    // Find the current map and prepare updated tags
    // const currentMap = items.find((item) => item._id === mapId);
    // if (!currentMap) {
    //   console.error("Map not found");
    //   return;
    // }
    try {
      // Call the backend API to update the tags
      const response = await apiClient.put(`/map?mapId=${mapId}`, {
        tags: newTags,
      });
      if (response.status === 200) {
        console.log("Tags updated successfully");
        // Update the state to reflect the new tags
        setTags(newTags);
      } else {
        console.error("Failed to update tags");
        // Handle errors
      }
    } catch (err) {
      console.error("Error while updating tags", err);
      // Handle errors
    }
  };

  // TagInput component
  const Tags = ({ mapId, initialTags }: ITagProps) => {
    const [tags, setTags] = useState(initialTags);
    const [input, setInput] = useState("");

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && input) {
        const newTags = [...tags, input];
        setInput("");
        setTags(newTags);
        addTag(mapId, newTags); // Call the addTag function to update the backend
      }
    };

    const removeTag = (index: number) => {
      const newTags = tags.filter((_, idx) => idx !== index);
      setTags(newTags);
      addTag(mapId, newTags); // Update the backend
    };

    return (
      <div className="tag-block">
        {/* tag-input-container */}
        {tags.map((tag, index) => (
          <div className="tag" key={index}>
            {tag}
            <IoIosClose
              className="remove-tag"
              size={20}
              onClick={() => removeTag(index)}
            />
          </div>
        ))}
        {/* <div className="input-box-tag">
          <IoIosAdd size={20} />
        </div> */}
        <input
          className="input-box-tag"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New Tag"
        />
      </div>
    );
  };

  const [newName, setNewName] = useState<string>("");
  const [newFillColor, setNewFillColor] = useState<string>("");
  const [newFill, setNewFill] = useState<boolean>(false);
  const [newFillOpacity, setNewFillOpacity] = useState<number>(0);
  const [newBorderWidth, setNewBorderWidth] = useState<number>(0);
  const [newBorderColor, setNewBorderColor] = useState<string>("");

  // set default value into useState
  useEffect(() => {
    setNewName(selectedProperties.name ? selectedProperties.name : "");
    setNewFillColor(
      selectedProperties.styles?.fillColor
        ? selectedProperties.styles?.fillColor
        : ""
    );
    setNewFill(
      selectedProperties.styles?.fill ? selectedProperties.styles?.fill : false
    );
    setNewFillOpacity(
      selectedProperties.styles?.fillOpacity
        ? selectedProperties.styles?.fillOpacity
        : 0
    );
    setNewBorderWidth(
      selectedProperties.styles?.weight ? selectedProperties.styles?.weight : 0
    );
    setNewBorderColor(
      selectedProperties.styles?.color ? selectedProperties.styles?.color : ""
    );
  }, [
    setNewName,
    setNewFillColor,
    setNewFill,
    setNewFillOpacity,
    setNewBorderWidth,
    setNewBorderColor,
    selectedProperties,
  ]);

  const changEdit = () => {
    // if (onSelectCategory === "region") {
    return (
      <div>
        <table className="no-line-table">
          <colgroup>
            <col style={{ width: "45%" }} />
            <col style={{ width: "50%" }} />
          </colgroup>
          <tbody>
            <tr className="">
              <td>Name:</td>
              <td>
                <input
                  className="input-box-basic my-1"
                  type="text"
                  value={newName}
                  disabled={selectedProperties?.editId ? false : true}
                  onChange={(event) => {
                    setNewName(event.target.value);
                  }}
                  // placeholder={selectedProperties.ADMIN}
                  // onKeyDown={(event) => handleInputChange("name", event)}
                />
              </td>
            </tr>
            <tr>
              <td>Filled Color:</td>
              <td>
                <input
                  className="input-inTable-color my-1"
                  type={"color"}
                  // value="#f6b73c"
                  value={newFillColor}
                  disabled={selectedProperties?.editId ? false : true}
                  onChange={(event) => {
                    setNewFillColor(event.target.value);
                  }}
                  // onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Filled:</td>
              <td>
                <input
                  className="my-1"
                  type={"checkbox"}
                  checked={newFill}
                  disabled={selectedProperties?.editId ? false : true}
                  onChange={(event) => {
                    setNewFill(event.target.checked);
                  }}
                  // onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Filled Opacity:</td>
              <td>
                <input
                  className="input-box-basic my-1"
                  type={"number"}
                  // value="#f6b73c"
                  value={newFillOpacity}
                  disabled={selectedProperties?.editId ? false : true}
                  onChange={(event) => {
                    setNewFillOpacity(Number(event.target.value));
                  }}
                  // onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Border Width:</td>
              <td>
                <input
                  className="input-box-basic my-1"
                  type={"number"}
                  // min={1}
                  // max={10}
                  // step={1}
                  value={newBorderWidth}
                  disabled={selectedProperties ? false : true}
                  onChange={(event) => {
                    setNewBorderWidth(Number(event.target.value));
                  }}
                  // onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Border Color:</td>
              <td>
                <input
                  className="input-inTable-color my-1"
                  type={"color"}
                  // value="#f6b73c"
                  value={newBorderColor}
                  disabled={selectedProperties ? false : true}
                  onChange={(event) => {
                    setNewBorderColor(event.target.value);
                  }}
                  // onChange={handleInputChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
    // } else if (onSelectCategory === "map") {
    //   return (
    //     <div>
    //       <table className="no-line-table">
    //         <colgroup>
    //           <col style={{ width: "45%" }} />
    //           <col style={{ width: "50%" }} />
    //         </colgroup>
    //         <tbody></tbody>
    //       </table>
    //     </div>
    //   );
    // }
    // return null;
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

  return (
    <div>
      {/* left sidebar */}
      <div className="editBar-left">
        {/* Whole bar content*/}
        <div className="mt-2 bar-content">
          {/* Info of Map */}
          <div className="info-bar">
            {/* Project Name */}
            <input
              className="transparent-input-title mb-3"
              onChange={(event) => setCurrentProjectName(event.target.value)}
              value={currentProjecName}
              type="text"
              id="projectName"
              name="projectName"
            />
            {/* info table */}
            <table className="no-line-table">
              <colgroup>
                <col style={{ width: "45%" }} />
                <col style={{ width: "55%" }} />
              </colgroup>
              <tbody>
                <tr key={"createTime"}>
                  <td>Create Time:</td>
                  <td>{formatDate(mapProject.createdAt)}</td>
                </tr>
                <tr key={"lastEdit"}>
                  <td>Last Edit:</td>
                  <td>{formatDate(mapProject.updatedAt)}</td>
                </tr>
                <tr key={"viewPublic"}>
                  <td>Public:</td>
                  <td>
                    {isPublic ? (
                      <HiEye
                        onClick={(event) => setIsPublic(!isPublic)}
                        color="6A738B"
                      />
                    ) : (
                      <HiEyeOff
                        onClick={(event) => setIsPublic(!isPublic)}
                        color="6A738B"
                      />
                    )}
                    {/* <input
                      type="checkbox"
                      id="publicView"
                      name="publicView"
                      defaultChecked={isPublic}
                      onClick={(event) => setIsPublic(!isPublic)}
                      // onChange={() => {}} // to avoid warning
                    /> */}
                  </td>
                </tr>
                {
                  <tr key={"rating"}>
                    <td>Ratintg:</td>
                    <td><ReactStars
                            count={5}
                            size={24}
                            activeColor="#ffd700"
                            value={mapProject.averageRating}
                            edit={false}
                        /></td>
                  </tr>
                }
              </tbody>
            </table>

            {/* tags */}
            <div className="tags">
              <label>Tags:</label>
              <Tags mapId={mapProject._id} initialTags={tags || []} />

              {/* <div className="tag-block ms-3">
                {mapProject.tags.map((tag, index) => (
                  <div key={tag} className="tag">
                    {tag}
                    <IoIosClose
                      className="remove-tag"
                      size={20}
                      onClick={() => removeTag(index)}
                    />
                  </div>
                ))}
                <input
                  className="input-box-tag"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  // onKeyDown={handleKeyDown}
                  placeholder="New Tag"
                />
              </div> */}
            </div>
          </div>

          {/* seperate line */}
          <div className="line mb-3"></div>

          {/* Edit Map */}
          <div className="settings-panel">
            <p className="title mb-3">Edit:</p>
            {/* <div className="select-panel">
              <select
                className="form-select mb-3"
                onChange={(event) => setOnSelectCategory(event.target.value)}
                value={onSelectCategory}
              >
                <option key={"region"} value="region">
                  Region
                </option>
                <option key={"map"} value="map">
                  Map
                </option>
              </select>
            </div> */}
            {changEdit()}
          </div>

          {/* Update button */}
          <button
            className="btn btn-primary"
            style={{ textAlign: "center" }}
            onClick={() =>
              setNewProperties({
                ...selectedProperties,
                name: newName,
                styles: {
                  ...selectedProperties.styles,
                  fillColor: newFillColor,
                  fill: newFill,
                  fillOpacity: newFillOpacity,
                  weight: newBorderWidth,
                  color: newBorderColor,
                },
              })
            }
          >
            Update
          </button>
        </div>

        {/* close button */}
        {/* <Link reloadDocument to={"/"}></Link> */}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>

      {/* right sidebar */}
      <div className="editBar-right">
        <div className="bar-content">
          <p className="title" style={{ textAlign: "center" }}>
            Color Bar
          </p>
          {mapProject.attach && (
            <table className="no-line-table">
              <tbody>
                {mapProject.attach.map((attach) => (
                  <tr key={attach.attachText} style={{ padding: "10px" }}>
                    <td>
                      <input
                        type="color"
                        value={attach.regionColor}
                        className="colorbar-input-color"
                      />
                    </td>
                    <td>{attach.attachText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className="export-button btn btn-secondary">
            Export JPEG
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBar;
