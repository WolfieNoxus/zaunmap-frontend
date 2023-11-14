import { HiEye, HiEyeOff } from "react-icons/hi";

interface IProjectItemProps {
  projecNname: string;
  userName: string;
  tags: string;
  view: number;
  viewPublic: boolean;
  // id: string;
}

const ProjectItem = ({
  projecNname,
  userName,
  tags,
  viewPublic,
  view,
}: IProjectItemProps) => {
  return (
    <div>
      <div style={{}}>
        <p color="6A738B">{projecNname}</p>
        <p color="6A738B">{userName}</p>
      </div>
      <div>
        <p color="6A738B">{tags}</p>
        {viewPublic ? <HiEye color="6A738B" /> : <HiEyeOff color="6A738B" />}
        <p color="6A738B">{view}</p>
      </div>
    </div>
  );
};

export default ProjectItem;
