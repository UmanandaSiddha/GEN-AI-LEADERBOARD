/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Users } from "../utils";
import { useNavigate } from "react-router-dom";
import backgroundImage from '/background.png';

const Home = () => {
  const navigate = useNavigate();
  const [, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/users/all"
      );
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

  return loading ? (
    <div className="flex justify-center items-center">
      <p className="text-2xl font-semibold">Loading...</p>
    </div>
  ) : (
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
        <div className="w-full flex justify-center items-center">
          <h1 className="text-2xl text-center font-semibold pt-[2rem] font-Poppins">
            GEN AI LEADERBOARD
          </h1>
        </div>
        <div className="w-full flex justify-center items-center pt-[2rem]">
          <div className="w-[95%] md:w-[80%] border-[1px] border-black font-Poppins font-semibold py-2 rounded-md">
            <div className="w-full flex flex-row">
              <div className="w-[20%] flex justify-center text-red-400">
                Name
              </div>
              <div className="w-[60%] flex justify-center text-blue-400">
                Badges
              </div>
              <div className="w-[20%] flex justify-center text-green-400">
                Points
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          {/* {users.map((user: any) => (
                    <Link to={`/user?id=${user?._id}`} className="flex float-start gap-8 text-sm">
                        <p>{user?.userName}</p>
                        <p>{user?.badgeCount}</p>
                        <p>{user?.points}</p>
                    </Link>
                ))} */}
          <div className="md:w-[80%] w-[95%]">
            {Users.map((user, index) => {
              return (
                <div
                  className={`w-full flex flex-row border-[2px] shadow-lg rounded-md border-black my-3 py-2 hover:cursor-pointer hover:bg-slate-200 transition ease-in-out duration-200`}
                  key={index}
                  onClick={() => {
                    navigate(`/users?id=${user.id}`);
                  }}
                >
                  <div className="w-[20%] flex justify-center pl-2 md:pl-2 lg:pl-0 font-semibold text-[0.8rem] md:text-base font-Poppins items-center">
                    {user.name}
                  </div>
                  <div className="w-[60%] flex justify-start px-[3rem] gap-2">
                    <div className="">
                      <img src="/introToLab.png" className="w-10 h-10" alt="" />
                    </div>
                    <div className="">
                      <img
                        src="/arcadeBadge.png"
                        className="w-10 h-10"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-[20%] flex justify-center items-center font-bold text-[1.2rem] font-Philosopher">
                    {user.points}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
