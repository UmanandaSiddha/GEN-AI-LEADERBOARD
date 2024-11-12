import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import backgroundImage from '/background.png';
import Create from "./pages/Create";
import User from "./pages/User";

const App = () => {
    return (
        <div className="w-full min-h-screen">
            <div className="w-full" style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'repeat-y',
                overflow: 'hidden',
            }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:id" element={<User />} />
                    <Route path="/create" element={<Create />} />
                </Routes>
            </div>
        </div>
    )
}

export default App;