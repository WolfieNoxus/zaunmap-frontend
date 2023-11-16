import IMapProject from "./IMapProject";

export default interface IUserProfileProps {
    userName: string;
    email: string;
    userType: string;
    projectList: IMapProject[];
}