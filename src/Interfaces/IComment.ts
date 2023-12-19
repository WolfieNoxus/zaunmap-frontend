export default interface IComment {
  _id: string;
  postedBy: string;
  content: string;
  likes: string[];
  like: boolean;
  dislikes: string[];
  dislike: boolean;
  replies: [];
  createdAt: string;
  updatedAt: string;
  name: string;
}
