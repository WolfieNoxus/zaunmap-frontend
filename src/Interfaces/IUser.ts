import IMap from "./IMap";

export default interface IUser {
  user_id: string;
  user_name: string;
  role: "user" | "admin" | "restricted" | "disabled";
  maps: IMap[];
}
