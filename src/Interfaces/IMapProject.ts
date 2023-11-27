import IComment from "./IComment";

export default interface IMapProject {
  map_id: number;
  map_name: string;
  owner?: string;
  created_time?: string;
  last_modified?: string;
  description?: string;
  tags: string[];
  public: boolean;
  views: number;
  likes?: number;
  dislikes?: number;
  comments?: IComment[];
  attach?: {
    regionColor: string;
    attachText: string;
    textColor: string;
  }[];
}
