import IMapProject from "./IMapProject";

export default interface IUser {
  user_id: number;
  user_name: string;
  email: string;
  permission: "user" | "admin";
  project_list: IMapProject[];
}
