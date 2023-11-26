import IMapProject from "./IMapProject";

export default interface IEditProps {
    mapProject: IMapProject;

    onClose: () => void;
}