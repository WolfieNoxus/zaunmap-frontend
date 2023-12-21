import React, { useEffect, useState, KeyboardEvent } from "react";
import IEditProps from "../../../Interfaces/IEditProps";
import apiClient from "../../../services/apiClient";
import "./css/editBar.css";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import ReactStars from "react-rating-stars-component";
// import IMap, { IColorTag, defaultMap } from "../../../Interfaces/IMap";
import IMeta, { defaultMeta } from "../../../Interfaces/IMeta";
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
  // setNewMeta,
  setChanged,
}) => {
  const [currentProjecName, setCurrentProjectName] = useState<string>(
    mapProject.name
  );
  const [isPublic, setIsPublic] = useState<boolean>(mapProject.isPublic);
  const [tags, setTags] = useState<string[]>(mapProject.tags);
  const [meta, setMeta] = useState<IMeta>(
    mapProject.meta ? mapProject.meta : defaultMeta
  );
  // const [newTag, setNewTag] = useState<string>("");

  // const [onSelectCategory, setOnSelectCategory] = useState<
  //   "general" | "heatmap" | "colormap"
  // >(mapProject.mode ? mapProject.mode : defaultMap.mode);

  // // heat map
  // const [colorHeat, setColorHeat] = useState<string>("");
  // const [heatLevel, setHeatLevel] = useState<number>(0);
  // const [heatValuemin, setHeatValuemin] = useState<number>(0);
  // const [heatValuemax, setHeatValuemax] = useState<number>(0);
  // // color map
  // const [colorLevel, setColorLevel] = useState<number>(0);
  // const [colorTag, setColorTag] = useState<IColorTag[]>();

  // useEffect(() => {

  //   setColorHeat((mapProject.colorHeat || defaultMap.colorHeat) as string);
  //   setHeatLevel((mapProject.heatLevel || defaultMap.heatLevel) as number);
  //   setHeatValuemin(
  //     (mapProject.heatValuemin || defaultMap.heatValuemin) as number
  //   );
  //   setHeatValuemax(
  //     (mapProject.heatValuemax || defaultMap.heatValuemax) as number
  //   );
  //   setColorLevel((mapProject.colorLevel || defaultMap.colorLevel) as number);
  //   setColorTag((mapProject.colorTag || defaultMap.colorTag) as IColorTag[]);

  // }, []);

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

  // set meta to newMeta
  useEffect(() => {
    const updateMeta = async (meta: IMeta) => {
      console.log("Meta updated");
      try {
        const response = await apiClient.put(`/map?mapId=${mapProject._id}`, {
          meta: meta,
        });
        if (response.status === 200) {
          // mapProject.meta = newMeta;
          console.log("Meta updated successfully");
        } else {
          console.error("Failed to update project public");
          // Handle errors
        }
      } catch (err) {
        console.error("Error while updating project public", err);
      }
    };
    console.log(meta);
    console.log(mapProject.meta);
    // if (meta !== mapProject.meta) {
    updateMeta(meta);
    // }
    // eslint-disable-next-line
  }, [meta, setMeta]);

  // add project tags
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

  // Freelance Editor
  const [newName, setNewName] = useState<string>("");
  const [newFillColor, setNewFillColor] = useState<string>("");
  const [newFill, setNewFill] = useState<boolean>(false);
  const [newFillOpacity, setNewFillOpacity] = useState<number>(0);
  const [newBorderWidth, setNewBorderWidth] = useState<number>(0);
  const [newBorderColor, setNewBorderColor] = useState<string>("");
  const [newAttachText, setNewAttachText] = useState<string>("");
  // Freelance Editor: set default value into useState
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
    setNewAttachText(
      selectedProperties.attachText ? selectedProperties.attachText : ""
    );
  }, [
    setNewName,
    setNewFillColor,
    setNewFill,
    setNewFillOpacity,
    setNewBorderWidth,
    setNewBorderColor,
    setNewAttachText,
    selectedProperties,
  ]);

  // Heat Map
  const [newHeatValue, setNewHeatValue] = useState<number>();
  // Heat Map: set default value into useState
  useEffect(() => {
    // setNewName(selectedProperties.name ? selectedProperties.name : "");
    setNewHeatValue(
      selectedProperties.heatValue ? selectedProperties.heatValue : 0
    );
  }, [setNewHeatValue, selectedProperties]);

  // Color Map

  const changEdit = () => {
    if (meta.mode === "general") {
      // Freelance Editor
      return (
        <div>
          <table className="no-line-table">
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "50%" }} />
            </colgroup>
            <tbody>
              <tr>
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
                <td>Attach Text:</td>
                <td>
                  <input
                    className="input-box-basic my-1"
                    type="text"
                    value={newAttachText}
                    disabled={selectedProperties?.editId ? false : true}
                    onChange={(event) => {
                      setNewAttachText(event.target.value);
                    }}
                    // placeholder={selectedProperties.ADMIN}
                    // onKeyDown={(event) => handleInputChange("name", event)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (meta.mode === "heatmap") {
      // Heat Map: color depends on the heatValue of attach
      return (
        <div>
          <table className="no-line-table">
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "50%" }} />
            </colgroup>
            <tbody>
              <tr>
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
                <td>Heat Value:</td>
                <td>
                  <input
                    className="input-box-basic my-1"
                    type="number"
                    value={newHeatValue}
                    min={meta.heatValueMin}
                    max={meta.heatValueMax}
                    disabled={selectedProperties?.editId ? false : true}
                    onChange={(event) => {
                      if (
                        Number(event.target.value) < Number(event.target.min)
                      ) {
                        event.target.value = event.target.min;
                      } else if (
                        Number(event.target.value) > Number(event.target.max)
                      ) {
                        event.target.value = event.target.max;
                      }
                      setNewHeatValue(Number(event.target.value));
                    }}
                    // placeholder={selectedProperties.ADMIN}
                    // onKeyDown={(event) => handleInputChange("name", event)}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "80%", whiteSpace: "pre" }}>
                  Min Heat Value:
                </td>
                <td style={{ fontSize: "80%", whiteSpace: "pre" }}>
                  <input
                    className="input-box-basic"
                    style={{ height: "80%", width: "80%", whiteSpace: "pre" }}
                    type="number"
                    value={meta.heatValueMin}
                    disabled={selectedProperties?.editId ? false : true}
                    onChange={(event) => {
                      setMeta({
                        ...meta,
                        heatValueMin: Number(event.target.value),
                      });
                    }}
                    // placeholder={selectedProperties.ADMIN}
                    // onKeyDown={(event) => handleInputChange("name", event)}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "80%", whiteSpace: "pre" }}>
                  Max Heat Value:
                </td>
                <td style={{ fontSize: "80%", whiteSpace: "pre" }}>
                  <input
                    className="input-box-basic"
                    style={{ height: "80%", width: "80%", whiteSpace: "pre" }}
                    type="number"
                    value={meta.heatValueMax}
                    disabled={selectedProperties?.editId ? false : true}
                    onChange={(event) => {
                      setMeta({
                        ...meta,
                        heatValueMax: Number(event.target.value),
                      });
                    }}
                    // placeholder={selectedProperties.ADMIN}
                    // onKeyDown={(event) => handleInputChange("name", event)}
                  />
                </td>
              </tr>
              <tr>
                <td>Levels of Heat:</td>
                <td>
                  <input
                    className="input-box-basic my-1"
                    type="number"
                    value={meta.heatLevel}
                    disabled={selectedProperties?.editId ? false : true}
                    onChange={(event) => {
                      setMeta({
                        ...meta,
                        heatLevel: Number(event.target.value),
                      });
                    }}
                    // placeholder={selectedProperties.ADMIN}
                    // onKeyDown={(event) => handleInputChange("name", event)}
                  />
                </td>
              </tr>
              <tr>
                <td>Color Theme:</td>
                <td>
                  <input
                    className="input-inTable-color my-1"
                    type={"color"}
                    value={meta.colorHeat}
                    disabled={selectedProperties?.editId ? false : true}
                    onChange={(event) => {
                      setMeta({ ...meta, colorHeat: event.target.value });
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    // else if (onSelectCategory === "colormap") {
    //   // Color Map: same tag has same color
    //   return (
    //     <div>
    //       <table className="no-line-table">
    //         <colgroup>
    //           <col style={{ width: "45%" }} />
    //           <col style={{ width: "50%" }} />
    //         </colgroup>
    //         <tbody>
    //           <tr>
    //             <td>Name:</td>
    //             <td>
    //               <input
    //                 className="input-box-basic my-1"
    //                 type="text"
    //                 value={newName}
    //                 disabled={selectedProperties?.editId ? false : true}
    //                 onChange={(event) => {
    //                   setNewName(event.target.value);
    //                 }}
    //                 // placeholder={selectedProperties.ADMIN}
    //                 // onKeyDown={(event) => handleInputChange("name", event)}
    //               />
    //             </td>
    //           </tr>
    //           <tr>
    //             <td>Color:</td>
    //             <td>
    //               <input
    //                 className="input-inTable-color my-1"
    //                 type={"color"}
    //                 value={meta.colorHeat}
    //                 disabled={selectedProperties?.editId ? false : true}
    //                 onChange={(event) => {
    //                   setMeta({ ...meta, colorHeat: event.target.value });
    //                 }}
    //               />
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </div>
    //   );
    // }

    // else if (onSelectCategory === "map") {
    //   // Tentative Map
    //   return (
    //     <div>
    //       <table className="no-line-table">
    //         <colgroup>
    //           <col style={{ width: "45%" }} />
    //           <col style={{ width: "50%" }} />
    //         </colgroup>
    //         <tbody>
    //           <tr>
    //             <td>Name:</td>
    //             <td>
    //               <input
    //                 className="input-box-basic my-1"
    //                 type="text"
    //                 value={newName}
    //                 disabled={selectedProperties?.editId ? false : true}
    //                 onChange={(event) => {
    //                   setNewName(event.target.value);
    //                 }}
    //                 // placeholder={selectedProperties.ADMIN}
    //                 // onKeyDown={(event) => handleInputChange("name", event)}
    //               />
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </div>
    //   );
    // }
    return null;
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
                    <td>
                      <ReactStars
                        count={5}
                        size={24}
                        activeColor="#ffd700"
                        value={mapProject.averageRating}
                        edit={false}
                      />
                    </td>
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
            <p className="title mb-1">Edit:</p>
            <div className="select-panel">
              <select
                className="form-select mb-3"
                onChange={(event) =>
                  // setOnSelectCategory(
                  //   event.target.value as "general" | "heatmap" | "colormap"
                  // )
                  setMeta({
                    ...meta,
                    mode: event.target.value as
                      | "general"
                      | "heatmap"
                      | "colormap",
                  })
                }
                // value={onSelectCategory}
                value={meta.mode}
              >
                <option key={"general"} value="general">
                  Freelance Editor
                </option>
                <option key={"heatmap"} value="heatmap">
                  Heat Map
                </option>
                {/* <option key={"colormap"} value="colormap">
                  Color Map
                </option>
                <option key={"map"} value="map">
                  Map
                </option>
                <option key={"map"} value="map">
                  Map
                </option> */}
              </select>
            </div>
            {changEdit()}
          </div>

          {/* Update button */}
          <button
            className="btn btn-primary"
            style={{ textAlign: "center" }}
            onClick={() => {
              // setNewMeta({ ...meta, mode: onSelectCategory });
              setNewProperties({
                ...selectedProperties,
                name: newName,
                attachText: newAttachText,
                heatValue: newHeatValue,
                styles: {
                  ...selectedProperties.styles,
                  fillColor: newFillColor,
                  fill: newFill,
                  fillOpacity: newFillOpacity,
                  weight: newBorderWidth,
                  color: newBorderColor,
                },
              });
              setChanged(true);
            }}
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
      {/* <div className="editBar-right">
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
      </div> */}
    </div>
  );
};

export default EditBar;
