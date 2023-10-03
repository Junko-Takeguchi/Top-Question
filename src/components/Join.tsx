import {useCallback, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useRecoilValue} from "recoil";
import userAtom from "../store/userAtom.ts";


const Join = () => {
    const [join, setJoin] = useState(true);
    const [input, setInput] = useState("");
    const currentUser = useRecoilValue(userAtom);
    const navigate = useNavigate();
    if (currentUser.id === "") {
        navigate("/");
    }
    const onClick = useCallback(async () => {
        if (join) {
            navigate(`/playground/${input}`);
        } else {
            const {data} = await axios.post("http://localhost:3001//api/createPlayground", {
                title: input,
                userId: currentUser.id
            });
            navigate(`/playground/${data.id}`);
        }
    }, [currentUser.id, input, join, navigate]);
    
    const placeHolder = useMemo(() => {
        if (join) {
            return "Enter Classroom Id";
        } else {
            return "Enter Classroom Title";
        }
    }, [join])
    
    return (
        <div className="h-screen w-screen flex flex-col gap-20 justify-center items-center">
            <h1
                className="block w-fit text-neutral-800 text-4xl font-semibold"
            ><span
                className="underline cursor-pointer hover:text-gray-700"
                onClick={() => {
                    setJoin(true);
                }}
            >Join</span> or <span
                className="underline cursor-pointer hover:text-gray-700"
                onClick={() => {
                    setJoin(false);
                }}
            >
                create
            </span> a classroom</h1>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeHolder}
                    className="w-60 h-full p-4 rounded-2xl border border-neutral-400 shadow-xl"
                />
                <button
                    onClick={onClick}
                    className="h-fit flex justify-center items-center w-full rounded-2xl bg-black px-3 py-4 text-white hover:bg-gray-200 hover:text-black focus:bg-gray-600 focus:outline-none transition">
                    {join ? "Join" : "Create"}
                </button>
            </div>
        </div>
    );
};

export default Join;