import IUser, { defaultUser } from "./IUser";

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

export const defaultPopupProps: IPopupProps = {
  page: "community",
  user: defaultUser,
  onClose: () => {},
};
