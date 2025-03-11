import { useState } from "react";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000/auth/";

const Signup = () => {
    // States are used to manage dynamic data within a component. They allow components to re-render when data changes, keeping the UI updated. States are mutable and controlled using the useState hook in functional components.
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL + "register/", formData);
            alert("Registration successful!");
        } catch (err) {
            alert("Signup failed!");
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
