import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import userAtom from "../store/userAtom.ts";

const Landing = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userAtom);
    return (
        <div
            className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
            <div className="w-full">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
                    <p className="mt-2 text-gray-500">Sign in below to access your account</p>
                </div>
                <div className="mt-5">
                    <>
                        <div className="relative mt-6">
                            <input type="email" name="email" id="email" placeholder="Email Address"
                                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                                   autoComplete="NA"
                                   value={email}
                                   onChange={(e) => {setEmail(e.target.value)}}
                            />
                            <label htmlFor="email"
                                   className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Email
                                Address</label>
                        </div>
                        <div className="relative mt-6">
                            <input type="password" name="password" id="password" placeholder="Password"
                                   onChange={(e) => {setPassword(e.target.value)}}
                                   value={password}
                                   className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"/>
                            <label htmlFor="password"
                                   className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Password</label>
                        </div>
                        <div className="my-6">
                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    const d = {
                                        username: email,
                                        password
                                    }
                                    // console.log(d);
                                    try {
                                        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, d);
                                        // console.log(data);
                                        setUser({
                                            id: data.id,
                                            userName: data.username
                                        });
                                        navigate("/join")
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }}
                                className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
                            >Sign
                                in
                            </button>
                        </div>
                        <p className="text-center text-sm text-gray-500">Don&#x27;t have an account yet?
                            <a onClick={() => {navigate("/signup")}}
                               className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">Sign
                                up
                            </a>.
                        </p>
                    </>
                </div>
            </div>
        </div>

    );
};

export default Landing;