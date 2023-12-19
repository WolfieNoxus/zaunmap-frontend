export default interface IUser {
  userId: string;
  name: string;
  role: "user" | "admin" | "restricted" | "disabled";
  maps: string[];
}

export const defaultUser: IUser = {
  userId: "",
  name: "",
  role: "user",
  maps: [],
};
