import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/auth/";

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`${API_URL}posts/${postId}/`);
            setPost(response.data);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    const handleComment = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token || newComment.trim() === "") return;
    
        try {
            await axios.post(
                `${API_URL}posts/${postId}/comment/`,  // ✅ Corrected URL
                { text: newComment },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            
            setNewComment("");

        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    

    if (!post) return <p>Loading post...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={() => navigate("/Dashboard")} style={{ marginBottom: "10px" }}>🔙</button>

            <div style={{ border: "1px solid #ddd", padding: "10px" }}>
                <img src={post.image} alt="Post" style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
                <p><strong>{post.user.charAt(0).toUpperCase() + post.user.slice(1)}</strong>: {post.caption}</p>

                <h3>Comments </h3>
                {post.comments?.length > 0 ? (  // ✅ Check if `comments` exist before mapping
                    post.comments.map((comment) => (
                        <p key={comment.id}><strong>{comment.user.charAt(0).toUpperCase() + comment.user.slice(1)} : </strong>: {comment.text}</p>
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}

                <div>
                    <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleComment} style={{ marginLeft: "10px", backgroundColor:"blue", color:"white", padding:"10px", fontSize:"20px" }}>Comment</button>
                </div>
            </div>
        </div>
    );
};
export default PostDetail;
