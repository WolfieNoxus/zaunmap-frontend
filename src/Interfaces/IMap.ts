import IComment from "./IComment";

export default interface IMap {
  _id: string;
  name: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  public: boolean;
  force_private?: boolean;
  reports?: number;
  rporters_id?: string[];
  views?: number;
  likes: number;
  dislikes: number;
  object_id: string;
  comments?: IComment[];
  attach?: {
    regionColor: string;
    attachText: string;
    textColor: string;
  }[];
}
