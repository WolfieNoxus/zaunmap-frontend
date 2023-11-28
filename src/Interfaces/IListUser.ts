export default interface IListUser {
  user_id: string;
  user_name: string;
  role: "user" | "admin" | "restricted" | "disabled";
}
