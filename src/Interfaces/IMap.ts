import IComment from "./IComment";

export default interface IMap {
  _id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  averageRating: number;
  ratingsCount: number;
  objectId: string;
  comments?: IComment[];
  attach?: {
    regionColor: string;
    attachText: string;
    textColor: string;
  }[];
}
