import { useState, useEffect } from "react";
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike} from "react-icons/ai";
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
  const [commentIds, setCommentIds] = useState<string[]>([]);
  const { user } = useAuth0();
  const userId = user?.sub as string;
  const addComment = async () => {
    if (!newComment.trim()) return; // Prevent blank comments
    const payload: ICommentForm = {
      mapId: mapId,
      content: newComment
    };
    try {
      const userNameResponse = await apiClient.get(`/user?userId=${user?.sub}`);
      const userName = userNameResponse.data.name;
      await apiClient.post('/comment', payload, {
        params: { userId: user?.sub } // Replace with actual userId from your authentication logic
      }).then(response => {
        const newData = {
          ...response.data,
          name: userName
        };
        setComments([...comments, newData]);
        setNewComment(''); // Clear the input after success
        console.log(response);
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    } catch (error) {
      console.error('Error adding comment', error);
      // Here you could set an error state and show an error message to the user if needed
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      console.log(commentIds);
      const filteredCommentIds = commentIds.filter(item => item !== commentId);
      console.log(filteredCommentIds);
      await apiClient.delete(`/comment?commentId=${commentId}`);
      // Filter out the deleted comment from the local comments state
      setComments(currentComments => currentComments.filter(comment => comment._id !== commentId));
      /*const payload = {
        comments : filteredCommentIds
      };*/
      // await apiClient.put(`/map`, payload, {params: {mapId: mapId}});
    } catch (error) {
      console.error('Error deleting comment', error);
      // Optionally, handle error state here
    }
  };

  const toggleLike = async (commentId: string) => {
    const comment = comments.find(c => c._id === commentId);
    const currentlyLiked = comment?.likes.includes(userId);
    const likeStatus = !currentlyLiked; // Toggle the like status

    try {
      await apiClient.put(`/comment/like?userId=${userId}&commentId=${commentId}&like=${likeStatus}`);

      // Update the local state to reflect the new like status
      setComments(currentComments =>
        currentComments.map(c =>
          c._id === commentId ? {
            ...c,
            // Update likes list based on the new like status
            likes: likeStatus ? [...c.likes, userId] : c.likes.filter(id => id !== userId)
          } : c
        )
      );
    } catch (error) {
      console.error('Error toggling like status', error);
    }
  };

  const toggleDislike = async (commentId: string) => {
    const comment = comments.find(c => c._id === commentId);
    const currentlyDisliked = comment?.dislikes.includes(userId);
    const dislikeStatus = !currentlyDisliked; // Toggle the dislike status
  
    try {
      await apiClient.put(`/comment/dislike?userId=${userId}&commentId=${commentId}&dislike=${dislikeStatus}`);
  
      // Update the local state to reflect the new dislike status
      setComments(currentComments =>
        currentComments.map(c =>
          c._id === commentId ? {
            ...c,
            // Update dislikes list based on the new dislike status
            dislikes: dislikeStatus ? [...c.dislikes, userId] : c.dislikes.filter(id => id !== userId)
          } : c
        )
      );
    } catch (error) {
      console.error('Error toggling dislike status', error);
    }
  };

  useEffect(() => {
    // console.log('Comments component has re-rendered.');
    const fetchCommentsData = async () => {
      try {
        const response = await apiClient.get(`/map?mapId=${mapId}`);
        setCommentIds(response.data.comments)
        console.log(response.data);
        const commentArray : IComment[] = [];
        if (response.data.comments.length > 0){
          for (let i = 0; i < response.data.comments.length; i++) {
            const commentId = response.data.comments[i];
            const commentResponse = await apiClient.get(`/comment?commentId=${commentId}`);
            const userNameResponse = await apiClient.get(`/user?userId=${commentResponse.data.postedBy}`);
            const userName = userNameResponse.data.name;
            // console.log(userName);
            await apiClient.get(`/comment?commentId=${commentId}`).then(response => {
              const newData = {
                ...response.data,
                name: userName
              };
              commentArray.push(newData)
              console.log(response);
            }).catch(error => {
              console.error('Error fetching data:', error);
            });
            // console.log(commentResponse.data.postedBy);
          }
          setComments(commentArray);
        }
        // console.log(commentArray);
        // setComments(response.data.comments);
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
            <th>Dislike</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {comments.map((comment) => (
            <tr key={comment._id}>
              <td>{comment.name}</td>
              <td>{comment.content}</td>
              <td>
                <button onClick={() => toggleLike(comment._id)}>
                  {comment.likes.includes(userId) ? (
                    <AiFillLike color="blue" />
                  ) : (
                    <AiOutlineLike color="grey" />
                  )}
                </button>
                <span>{comment.likes.length}</span>
              </td>
              <td>
                <button onClick={() => toggleDislike(comment._id)}>
                {comment.dislikes.includes(userId) ? (
                  <AiFillDislike color="blue" />
                ) : (
                  <AiOutlineDislike color="grey" />
                )}
                </button>
                <span>{comment.dislikes.length}</span>
              </td>
              <td>
                <button onClick={() => deleteComment(comment._id)}>
                  Delete
                </button>
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
