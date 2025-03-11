import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import AddPost from "./components/AddPost";
import PostDetail from "./components/PostDetail";
const App = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/addpost" element={<AddPost />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
