import IUserProfileProps from "./IUserProfileProps";

export default interface IPopupProps {
    page:
      | "community"
      | "userProfile"
      | "comments"
      | "mapInfo"
      | "logIn"
      | "signUp"
      | "addProject"
      | "forgotPassword";
  
    user: IUserProfileProps;
    onClose: () => void;
  }