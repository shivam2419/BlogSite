import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/auth/";

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);  // ✅ Store posts
    const [page, setPage] = useState(1);  // ✅ Keep track of pages
    const [hasMore, setHasMore] = useState(true);  // ✅ Stop fetching when no more data
    useEffect(() => {
        fetchPosts();
        window.addEventListener("scroll", handleScroll);  // ✅ Detect scrolling
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchPosts = async () => {
        if (!hasMore) return;

        try {
            const response = await axios.get(`${API_URL}posts/?page=${page}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`  // ✅ Send token in request
                }
            });
            console.log("API Response:", response.data);  // ✅ Debugging

            if (!Array.isArray(response.data.results)) {  // ✅ Ensure data is an array
                console.error("Unexpected response format:", response.data);
                return;
            }
            /*
                setPosts() → This is a state updater function from useState().
                prevPosts => ... → This is a callback function to ensure updates are based on the latest state.
            */
            //      Previosu state => Old posts, New posts
            setPosts(prevPosts => [...prevPosts, ...response.data.results]);
            /*  
                ...prevPosts → Keeps all previously loaded posts.
                ...response.data.results → Expands the newly fetched posts and appends them. 
                
            */
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    const handleLike = async (postId) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("User not authenticated");
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}posts/${postId}/like/`,
                {},
                { headers: { "Authorization": `Bearer ${token}` } }
            );

            setPosts(posts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        like_count: response.data.like_count,
                        comment_count: response.data.comment_count  // ✅ Update both counts together
                    }
                    : post
            ));
        } catch (error) {
            console.error("Error liking post:", error.response?.data || error.message);
        }
    };

    const handleShare = (postId, imageUrl, caption) => {
        const postUrl = `${window.location.origin}/posts/${postId}`;  // Post link
        const text = encodeURIComponent(`Check out this post: "${caption}"\n🔗 ${postUrl}`);

        const shareOptions = [
            { name: "WhatsApp", url: `https://wa.me/?text=${text}` },
            { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}` },
            { name: "Twitter", url: `https://twitter.com/intent/tweet?text=${text}` },
            { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}` },
        ];

        // Open the first share option (WhatsApp) in a new tab
        window.open(shareOptions[0].url, "_blank");
    };



    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
            fetchPosts();  // ✅ Load more posts when user reaches bottom
        }
    };

    return (
        <div style={{ paddingTop: "10px", maxHeight: "700px" }}>
            <button onClick={() => (navigate("/AddPost"))} style={{ backgroundColor: "green", color: "white", fontSize: "20px", marginLeft: "20px" }}>Add Posts</button>
            <div className="post-data" style={{ width: "100%", margin: "20px" }}>
                {posts.map(post => (
                    <div key={post.id + page} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
                        <img src={post.image} alt="Post" style={{ height: "auto", width: "100%", maxHeight: "300px", objectFit: "contain" }} />
                        <p><strong>{post.user.charAt(0).toUpperCase() + post.user.slice(1)}</strong>: <i>{post.caption}</i></p>

                        <button onClick={() => handleLike(post.id)} style={{ marginLeft: "5px", padding: "5px" }}>
                            💖 {post.like_count} {/* Till : 10-03-25 */}
                        </button>
                        <button onClick={() => navigate(`/posts/${post.id}`)} style={{ marginLeft: "5px", padding: "5px" }}>
                            🖊️ {post.comment_count}
                        </button>
                        <button onClick={() => handleShare(post.id, post.image, post.caption)} style={{ marginLeft: "5px", padding: "5px" }}>
                            ➤
                        </button>
                    </div>

                ))}

            </div>

            {/* Loader */}
            {hasMore && <p style={{ textAlign: "center" }}>Loading more posts...</p>}
        </div>
    );
};

export default Dashboard;
