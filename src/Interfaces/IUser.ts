import IMap from "./IMap";

export default interface IUser {
  userId: string;
  user_name: string;
  role: "user" | "admin" | "restricted" | "disabled";
  maps: IMap[];
}
