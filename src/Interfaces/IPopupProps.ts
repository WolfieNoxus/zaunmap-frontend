import IUser from "./IUser";

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

  user: IUser;
  onClose: () => void;
}
