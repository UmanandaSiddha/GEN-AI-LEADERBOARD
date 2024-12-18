import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
// import { useNavigate } from "react-router-dom";

const Home = () => {
    // const navigate = useNavigate();
    const [users, setUsers] = useState<AllUser[]>([]);
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
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const exportToXlsx = () => {
        const data = users?.map(user => {
            return {
                Name: user.name,
                PublicProfile: user.publicProfile,
                Username: user.userName,
                Badges: user.badgeCount,
                Points: user.points,
            };
        })
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'GenAiData');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `GenAiData.xlsx`);
    };

    return loading ? (
        <div className="flex justify-center items-center">
            <p className="text-2xl font-semibold">Loading...</p>
        </div>
    ) : (
        <>
            <div className="w-full flex justify-center items-center gap-4">
                <h1 className="text-2xl text-center font-semibold pt-[2rem] font-Poppins">
                    GEN AI LEADERBOARD
                </h1>
                <button className="px-3 py-3 mt-[2rem] bg-gray-700 text-white text-md font-semibold rounded-lg" onClick={exportToXlsx}>Export Data</button>
            </div>
            <div className="w-full flex justify-center items-center pt-[2rem]">
                <div className="w-[95%] md:w-[80%] border-[2px] border-black font-Poppins font-semibold py-2 rounded-md">
                    <div className="w-full flex flex-row">
                        <div className="w-1/3 flex justify-center text-red-400">
                            Name
                        </div>
                        <div className="w-1/3 flex justify-center text-blue-400">
                            Badges
                        </div>
                        <div className="w-1/3 flex justify-center text-green-400">
                            Points
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center items-center">
                <div className="md:w-[80%] w-[95%]">
                    {users.map((user, index) => {
                        return (
                            <Link
                                key={index}
                                to={`/${user._id}`}
                                className={`w-full flex flex-row border-[2px] shadow-lg rounded-md border-black my-3 py-2 hover:cursor-pointer hover:bg-slate-200 transition ease-in-out duration-200`}
                            >
                                <div className="w-1/3 flex justify-center pl-2 md:pl-2 lg:pl-0 font-semibold text-[0.8rem] md:text-base font-Poppins items-center">
                                    {index + 1}: {user.userName ? user.userName : user.name}
                                </div>
                                <div className="w-1/3 flex justify-center pl-2 md:pl-2 lg:pl-0 font-semibold text-[0.8rem] md:text-base font-Poppins items-center">
                                    {user.badgeCount}
                                </div>
                                <div className="w-1/3 flex justify-center items-center font-bold text-[1.2rem] font-Philosopher">
                                    {user.points || 0}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Home;