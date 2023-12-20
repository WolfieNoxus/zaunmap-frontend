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
  ratingCount: number;
  objectId: string;
  comments?: IComment[];
  attach?: {
    regionColor: string;
    attachText: string;
    textColor: string;
  }[];
}

export const defaultMap: IMap = {
  _id: "",
  name: "",
  tags: [],
  owner: "",
  isPublic: false,
  objectId: "",
  createdAt: "",
  updatedAt: "",
  averageRating: 0,
  ratingCount: 0,
  description: "",
};
