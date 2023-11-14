import { useState } from "react";
import { set } from "react-hook-form";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

interface ICommentsProps {
  comments: {
    id: number;
    userName: string;
    comment: string;
    like: boolean;
  }[];
}

const commentsSample: ICommentsProps["comments"] = [
  {
    id: 1,
    userName: "John",
    comment: "Hello, This is a comment!",
    like: true,
  },
  {
    id: 2,
    userName: "Jane",
    comment: "Hi",
    like: false,
  },
];

const Comments = () => {
  const [comments, setComments] = useState<ICommentsProps["comments"]>(commentsSample);

  const setCommentLike = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, like: !comment.like } : comment
      )
    );
  };

  return (
    <div>
      Comments
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Comments</th>
            <th>Like</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.userName}</td>
              <td>{comment.comment}</td>
              <td>
                {comment.like ? (
                  <AiFillLike
                    onClick={() => setCommentLike(comment.id)}
                    color="6A738B"
                  />
                ) : (
                  <AiOutlineLike
                    onClick={() => setCommentLike(comment.id)}
                    color="6A738B"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Comments;
