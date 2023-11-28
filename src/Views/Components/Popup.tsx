import CommunityList from "./PopupPage/CommunityList";
import UserProfile from "./PopupPage/UserProfile";
import IPopupProps from "../../Interfaces/IPopupProps";
import FileUploader from "./PopupPage/FileUploader";
import Comments from "./PopupPage/Comments";
const Popup: React.FC<IPopupProps> = ({ page, user, onClose }) => {
  const changePage = (type: string) => {
    if (type === "community") {
      return <CommunityList role={user.role} />;
    } else if (type === "userProfile") {
      return (
        <UserProfile
          user_id={user.user_id}
          user_name={user.user_name}
          role={user.role}
          maps={user.maps}
        />
      );
    } else if (type === "addProject") {
      return <FileUploader />;
    } else if (type === "comments") {
      return <Comments />;
    } else if (type === "mapInfo") {
      return (
        <div>
          <h2 className="mb-4 mt-3">Map Info</h2>
          <p className="text text-danger" style={{ fontStyle: "italic" }}>
            *You need to set up project to view map infomation.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="popup-background">
      <div className="popup-content">
        {changePage(page)}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default Popup;
