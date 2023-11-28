export default interface IComment {
  id: number;
  userName: string;
  comment: string;
  date: string;
  like?: boolean;
  likes?: number;
}
