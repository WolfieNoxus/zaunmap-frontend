import IMapProject from "./IMapProject";

export default interface IUserProfileProps {
    userName: string;
    email: string;
    userType: "user" | "admin";
    projectList: IMapProject[];
}