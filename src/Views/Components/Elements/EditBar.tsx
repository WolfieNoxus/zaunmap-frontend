import React, { useState } from "react";
import IEditProps from "../../../Interfaces/IEditProps";

const EditBar: React.FC<IEditProps> = ({ onClose, mapProject }) => {
  const [currentProjecName, setCurrentProjectName] =
    useState<string>("Fake Project Name");
  const [onSelectCategory, setOnSelectCategory] = useState<string>("region");

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
                    value="#e66465"
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
                    value="#f6b73c"
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
                  <td>{mapProject.last_modified}</td>
                </tr>
                <tr key={"lastEdit"}>
                  <td>Last Edit:</td>
                  <td>{mapProject.last_modified}</td>
                </tr>
                <tr key={"viewPublic"}>
                  <td>Public:</td>
                  <td>
                    <input type="checkbox" id="publicView" name="publicView" />
                  </td>
                </tr>
                {
                  <tr key={"views"}>
                    <td>View:</td>
                    <td>-</td>
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
