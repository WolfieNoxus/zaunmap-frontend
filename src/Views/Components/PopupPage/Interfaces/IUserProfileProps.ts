export default interface IUserProfileProps {
    userName: string;
    email: string;
    userType: string;
    projectList: {
      id: number;
      projecNname: string;
      tags: string;
      userName: string;
      view: number;
      viewPublic: boolean;
    }[];
}