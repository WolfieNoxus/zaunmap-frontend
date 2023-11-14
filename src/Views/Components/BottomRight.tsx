import { MdAddCircle, MdChatBubbleOutline } from "react-icons/md";

const BottomRight = () => {
  return (
    <div className="component-bottom-right">
      {/* <div className="component-bottom-right-comment">
      </div> */}
      <MdChatBubbleOutline
        className="component-bottom-right-comment"
        size={38}
        color="F35D74"
      />
      <MdAddCircle
        className="component-bottom-right-add"
        size={40}
        color="BB2649"
      />
    </div>
  );
};

export default BottomRight;
