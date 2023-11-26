import CommunityList from "./PopupPage/CommunityList";
import UserProfile from "./PopupPage/UserProfile";
import IPopupProps from "./PopupPage/Interfaces/IPopupProps";
import FileUploader from "./PopupPage/FileUploader";
import Comments from "./PopupPage/Comments";
const Popup: React.FC<IPopupProps> = ({ page, user, onClose }) => {
  const changePage = (type: string) => {
    if (type === "community") {
      return <CommunityList userType={user.userType} />;
    } else if (type === "userProfile") {
      return (
        <UserProfile
          userName={user.userName}
          userType={user.userType}
          projectList={user.projectList}
          email={user.email}
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
