import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/auth/posts/";

const AddPost = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("caption", caption);

        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            console.log("Post added successfully:", response.data);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error adding post:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h2>Add Post</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Caption" 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)} 
                    required 
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default AddPost;



// Nature is not just a part of our world—it is our world. Let’s cherish and protect it! 🌎💚