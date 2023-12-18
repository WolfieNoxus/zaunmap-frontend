import { useState, useEffect } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import IComment from "../../../Interfaces/IComment";
import apiClient from "../../../services/apiClient";
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

interface ICommentForm {
  mapId: string | undefined;
  content: string;
}


const Comments= () => {
  const [comments, setComments] = useState<IComment[]>([]);
  const { mapId } = useParams<{ mapId: string }>();
  const [newComment, setNewComment] = useState<string>("");
  // const [userId, setUserId] = useState<string>();
  const { user } = useAuth0();

  const addComment = async () => {
    if (!newComment.trim()) return; // Prevent blank comments

    const payload: ICommentForm = {
      mapId: mapId,
      content: newComment
    };

    try {
      const response = await apiClient.post('/comment', payload, {
        params: { userId: user?.sub } // Replace with actual userId from your authentication logic
      });
      console.log(response.data);
      setComments([...comments, response.data]);
      setNewComment(''); // Clear the input after success
    } catch (error) {
      console.error('Error adding comment', error);
      // Here you could set an error state and show an error message to the user if needed
    }
  };

  useEffect(() => {
    console.log('Comments component has re-rendered.');
    const fetchCommentsData = async () => {
      try {
        const response = await apiClient.get(`/map?mapId=${mapId}`);
        setComments(response.data.comments);
        console.log(response.data.comments);
        // console.log(user?.sub);
      } catch (error) {
        console.error('Error fetching comments', error);
      }
    };
  
    fetchCommentsData();
  }, [mapId]);
  // useEffect(() => {
  //   const fetchCommentsData = async () => {}
  // })

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
            <tr key={comment._id}>
              <td>{comment.postedBy}</td>
              <td>{comment.content}</td>
              <td>
                {comment.like ? (
                  <AiFillLike color="blue" />
                ) : (
                  <AiOutlineLike color="grey" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={addComment} disabled={!newComment.trim()}>
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;
