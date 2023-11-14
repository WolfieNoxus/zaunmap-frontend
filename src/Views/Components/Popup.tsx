import { ReactNode, useState } from "react";
import CommunityList from "./PopupPage/CommunityList";
import UserProfile from "./PopupPage/UserProfile";
import IPopupProps from "./PopupPage/Interfaces/IPopupProps";

const Popup = ({ page, user, onClose }: IPopupProps) => {
  const [returnPage, setReturnPage] = useState<ReactNode>(<CommunityList />);

//   if (page === "community") {
//     setReturnPage(<CommunityList />);
//   } else if (page === "userProfile") {
//     setReturnPage(
//       <UserProfile
//         userName={user.userName}
//         userType={user.userType}
//         projectList={user.projectList}
//         email={user.email}
//       />
//     );
//   } 

  return (
    <div className="popup-background">
      <div className="popup-content">
        {/* <CommunityList /> */}
        {returnPage}
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
