import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("http://localhost:4000/api/v1/users/all");
            setUsers(data.users);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return loading ? (
        <div className="flex justify-center items-center">
            <p className="text-2xl font-semibold">Loading...</p>
        </div>
    ) : (
        <div className="container">
            <h1 className="text-2xl text-center font-semibold">GEN AI LEADERBOARD</h1>
            <div className="flex flex-col justify-center items-center">
                {users.map((user: any) => (
                    <Link to={`/user?id=${user?._id}`} className="flex float-start gap-8 text-sm">
                        <p>{user?.userName}</p>
                        <p>{user?.badgeCount}</p>
                        <p>{user?.points}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Home;