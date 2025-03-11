import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../style/style.css"; 
const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/login/", formData);
            if (response.data.access) {
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
            }
            navigate("/dashboard");
        } catch (err) {
            alert("Username or password is incorrect");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
                <center style={{margin : "10px"}}>Don't have an account? <Link to="/signup" style={{textDecoration : "None", color : "blue"}}>Signup here</Link></center>
            </form>
        </div>
    );
};

export default Login;
