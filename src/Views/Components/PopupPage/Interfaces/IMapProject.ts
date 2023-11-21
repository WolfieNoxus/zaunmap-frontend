import IComment from "./IComment";

export default interface IMapProject {
  id: number;
  projecName: string;
  description?: string;
  createTime?: string;
  lastEditTime?: string;
  tags: string[];
  userName?: string;
  view: number;
  like?: number;
  viewPublic: boolean;
  comments?: IComment[];
  attach?: {
    regionColor: string;
    attachText: string;
    textColor: string;
  }[];
}
