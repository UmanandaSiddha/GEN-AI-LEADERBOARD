import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Create = () => {

    const [searchParams] = useSearchParams();
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    const id = searchParams.get("id");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !url) {
            alert("Please fill all the fields");
            return;
        }
        if (!id) {
            alert("Only Admin can perform this operation");
            return;
        }

        const payload = {
            name,
            url,
        }

        try {
            await axios.post(`http://localhost:4000/api/v1/users/new?id=${id}`, payload);
            alert("User added successfully");
            setName("");
            setUrl("");
        } catch (error: any) {
            alert("Error: " + error.response.data.message);
        }
    }
    return (
        <div className="h-screen">
            <div className="w-full flex justify-center items-center">
                <h1 className="text-2xl text-center font-semibold pt-[2rem] font-Poppins">
                    Add a new User
                </h1>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center pt-[2rem] gap-4">
                <input
                    type="text"
                    placeholder="Enter user name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-[90%] md:w-[50%] border-[2px] border-black font-Poppins font-semibold py-2 px-3 rounded-md"
                />
                <input
                    type="text"
                    placeholder="Enter user public profile"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-[90%] md:w-[50%] border-[2px] border-black font-Poppins font-semibold py-2 px-3 rounded-md"
                />
                <button type="submit" className="w-[90%] md:w-[50%] border-[2px] bg-indigo-500 text-white font-Poppins font-semibold py-2 px-3 rounded-md">Submit</button>
            </form>
        </div>
    )
}

export default Create;