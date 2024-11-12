import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

const User = () => {

    let param = useParams();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const handleScrape = async () => {
        if (!id) {
            alert("Only Admin can perform this operation");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`http://localhost:4000/api/v1/users/byId/${param.id}?id=${id}`, {});
            alert("User scrapped successfully");
        } catch (error: any) {
            alert("Error: " + error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4000/api/v1/users/byId/${param.id}`);
            setUser(data.user);
            alert("User fetched successfully");
        } catch (error: any) {
            alert("Error: " + error.response.data.message);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="w-full flex justify-center items-center">
                <h1 className="text-2xl text-center font-semibold pt-[2rem] font-Poppins">
                    User {user?.name}
                </h1>
            </div>
            <div className="w-full flex flex-col justify-center items-center pt-[2rem] gap-4">
                <button
                    onClick={handleScrape}
                    disabled={loading}
                    className="w-[90%] md:w-[50%] border-[2px] bg-orange-500 text-white font-Poppins font-semibold py-2 px-3 rounded-md"
                >
                    {loading ? "Hold on..." : "Scrape User"}
                </button>
                <Link to={user?.publicProfile || "/"} target="blank">Public Profile</Link>
                <div className="flex flex-col justify-center items-center space-y-4">
                    {user && user.badges && user.badges.map((badge, index) => (
                        <div key={index}>
                            {index + 1}: {badge.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default User;