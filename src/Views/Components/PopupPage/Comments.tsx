import { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import IComment from "./Interfaces/IComment";

interface ICommentsProps {
  comments: IComment[];
}

const commentsSample: ICommentsProps["comments"] = [
  {
    id: 1,
    userName: "John",
    comment: "Hello, This is a comment!",
    date: "2021-06-08",
    like: true,
  },
  {
    id: 2,
    userName: "Jane",
    comment: "Hi",
    date: "2021-06-08",
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
