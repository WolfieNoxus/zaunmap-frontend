import IMap from "./IMap";

export default interface IUser {
  user_id: number;
  user_name: string;
  email: string;
  role: "user" | "admin" | "restricted" | "disabled";
  project_list: IMap[];
}
