import CommunityList from "./PopupPage/CommunityList";
import UserProfile from "./PopupPage/UserProfile";
import IPopupProps from "../../Interfaces/IPopupProps";
import FileUploader from "./PopupPage/FileUploader";
import Comments from "./PopupPage/Comments";
import MapInfo from "./PopupPage/MapInfo"
import ForkProject from "./PopupPage/ForkProject";
const Popup: React.FC<IPopupProps> = ({ page, user, onClose, importObjectId, importUserId}) => {
  const changePage = (type: string) => {
    // console.log(importObjectId, importUserId);
    if (type === "community") {
      return <CommunityList role={user.role} />;
    } else if (type === "userProfile") {
      return (
        <UserProfile
          userId={user.userId}
          name={user.name}
          role={user.role}
          maps={user.maps}
        />
      );
    } else if (type === "addProject") {
      return <FileUploader />;
    } else if (type === "comments") {
      return <Comments />;
    } else if (type === "mapInfo") {
      return <MapInfo />;
    } else if (type === "forkProject" && importObjectId && importUserId) {
      console.log("Forking project");
      return <ForkProject objectId={importObjectId} userId={importUserId} />;
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
