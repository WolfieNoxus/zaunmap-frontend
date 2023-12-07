import IMap from "./IMap";

export default interface IUser {
  userId: string;
  name: string;
  role: "user" | "admin" | "restricted" | "disabled";
  maps: string[];
}
