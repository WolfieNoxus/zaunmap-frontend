export default interface IListUser {
  userId: string;
  name: string;
  role: "user" | "admin" | "restricted" | "disabled";
}
