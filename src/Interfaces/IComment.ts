export default interface IComment {
  _id: string;
  postedBy: string;
  content: string;
  like: boolean,
  dislike: boolean,
  replies: [],
  createdAt: string,
  updatedAt: string

}
