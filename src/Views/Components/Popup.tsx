import CommunityList from "./PopupPage/CommunityList";
import UserProfile from "./PopupPage/UserProfile";
import IPopupProps from "./PopupPage/Interfaces/IPopupProps";

const Popup = ({ page, user, onClose }: IPopupProps) => {

  const changePage = (type: string) => {
    if (type === "community") {
      return <CommunityList />;
    } else if (type === "userProfile") {
        return <UserProfile
          userName={user.userName}
          userType={user.userType}
          projectList={user.projectList}
          email={user.email}
        />;
    } ;
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
