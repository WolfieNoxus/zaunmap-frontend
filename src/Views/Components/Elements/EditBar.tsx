import React, { useEffect, useState } from "react";
import IEditProps from "../../../Interfaces/IEditProps";
import apiClient from "../../../services/apiClient";

const EditBar: React.FC<IEditProps> = ({ onClose, mapProject }) => {
  const [currentProjecName, setCurrentProjectName] =
    useState<string>(mapProject.name);
  const [onSelectCategory, setOnSelectCategory] = useState<string>("region");
  const [isPublic, setIsPublic] = useState<boolean>(mapProject.isPublic);

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

  const changEdit = () => {
    if (onSelectCategory === "region") {
      return (
        <div>
          <table className="no-line-table">
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "50%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>Attach Text:</td>
                <td>AS</td>
              </tr>
              <tr>
                <td>Text Font:</td>
                <td>Arial</td>
              </tr>
              <tr>
                <td>Text Size:</td>
                <td>12</td>
              </tr>
              <tr>
                <td>Text Color</td>
                <td>
                  <input
                    className="input-inTable-color"
                    type={"color"}
                    defaultValue="#e66465"
                  />
                </td>
              </tr>
              <tr>
                <td>Position:</td>
                <td></td>
              </tr>
              <tr>
                <td style={{ fontSize: "80%", whiteSpace: "pre" }}>
                  {"      "}
                  Horizontal:
                </td>
                <td>3</td>
              </tr>
              <tr>
                <td style={{ fontSize: "80%", whiteSpace: "pre" }}>
                  {"      "}
                  Vertical:
                </td>
                <td>-5</td>
              </tr>
              <tr>
                <td>Region Name:</td>
                <td>Afghanistan</td>
              </tr>
              <tr>
                <td>Region Color:</td>
                <td>
                  <input
                    className="input-inTable-color"
                    type={"color"}
                    defaultValue="#f6b73c"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (onSelectCategory === "map") {
      return (
        <div>
          <table className="no-line-table">
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "50%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>Border Width:</td>
                <td>1 px</td>
              </tr>
              <tr>
                <td>Border Color:</td>
                <td>
                  <input
                    className="input-inTable-color"
                    type={"color"}
                    value="#f6b73c"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return null;
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
                  <td>{mapProject.createdAt}</td>
                </tr>
                <tr key={"lastEdit"}>
                  <td>Last Edit:</td>
                  <td>{mapProject.updatedAt}</td>
                </tr>
                <tr key={"viewPublic"}>
                  <td>Public:</td>
                  <td>
                    {/* <input type="checkbox" id="publicView" name="publicView" /> */}
                    <input
                      type="checkbox"
                      id="publicView"
                      name="publicView"
                      defaultChecked={isPublic}
                      onClick={(event) => setIsPublic(!isPublic)}
                    // onChange={() => {}} // to avoid warning
                    />
                  </td>
                </tr>
                {
                  <tr key={"rating"}>
                    <td>Ratintg:</td>
                    <td>{mapProject.averageRating}</td>
                  </tr>
                }
              </tbody>
            </table>

            {/* tags */}
            <div className="tags">
              <label>Tags:</label>
              <div className="tag-block ms-3">
                {mapProject.tags.map((tag) => (
                  <div key={tag} className="tag">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* seperate line */}
          <div className="line mb-3"></div>

          {/* Edit Map */}
          <div className="settings-panel">
            <p className="title mb-3">Edit:</p>
            <div className="select-panel">
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
            </div>
            {changEdit()}
          </div>
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
