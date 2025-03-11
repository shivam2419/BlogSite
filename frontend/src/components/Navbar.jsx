import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";  // ✅ Make sure you have this CSS file

const Navbar = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const isLoggedIn = localStorage.getItem("refreshToken");

    return (
        <nav className="navbar">
            {/* Left Side: Blog Title */}
            <div className="logo">
                Blog<span style={{ color: "blue" }}>Site</span>
            </div>

            {/* Right Side: Navigation Links */}
            <div className="nav-links">
                <Link to="/" className="home-link">Home</Link>
                {isLoggedIn ? (
                    <>
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                        <button className="profile-btn">Profile</button>
                    </>
                ) : (
                    <button onClick={handleLogin} className="nav-button">Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
