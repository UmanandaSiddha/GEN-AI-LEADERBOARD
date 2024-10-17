import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/User";
import Users from "./pages/Users";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/users" element={<Users />} />
        </Routes>
    )
}

export default App;