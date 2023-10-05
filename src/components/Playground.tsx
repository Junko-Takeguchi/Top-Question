import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import io from 'socket.io-client';
import axios from "axios";
import {useRecoilState} from "recoil";
import questionsAtom from "../store/questionAtom.ts";
import userAtom from "../store/userAtom.ts";

interface Question {
    id: string;
    body: string;
    playgroundId: string;
    upvotes: string[];
}
const socket = io(import.meta.env.VITE_BACKEND_URL);
const URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const Playground = () => {
    const { playgroundId } = useParams();
    const navigate = useNavigate();
    const [questionBody, setQuestionBody] = useState("");
    const [questions, setQuestions] = useRecoilState(questionsAtom);
    const [currentUser, setCurrentUser] = useRecoilState(userAtom);

    const sortedQuestions = useMemo(() => {
        return [...questions].sort((a, b) => b.upvotes.length - a.upvotes.length);
    }, [questions]); // Include 'questions' as a dependency

    const postQuestion = useCallback(() => {
        const body = {
            text: questionBody,
            playgroundId,
        };
        socket.emit("create-question", body);
    }, [playgroundId, questionBody]);
    
    const handleVoteUpdate = useCallback((paramQuestion: Question) => {
        setQuestions((prevQuestions) => {
            return prevQuestions.map((question) => {
                if (question.id === paramQuestion.id) {
                    // Update the question with the new upvotes
                    return {
                        ...question,
                        upvotes: paramQuestion.upvotes
                    };
                }
                return question;
            });
        });
    }, [setQuestions]);

    const handleQuestionUpdate = useCallback((question: Question) => {
        setQuestions([...questions, question]);
    }, [questions, setQuestions]);
    
    const hasVoted = useCallback((question: Question) => {
        return question.upvotes.includes(currentUser.id)
    }, [currentUser.id])

    useEffect(() => {
        axios.get(`${URL}/me`,{
            withCredentials: true, // Include this option
        })
            .then(res => res.data)
            .then((data) => {
                // console.log(data);
                setCurrentUser({
                    id: data.id,
                    userName: data.username
                })
            }).catch(e => {
            console.log(e);
            navigate("/");
        });

        axios.get(`${URL}/playground/${playgroundId}`)
            .then(res => res.data)
            .then(questions => setQuestions(questions));
    }, [playgroundId]);
    
    useEffect(() => {
        // Listen for events and update the state accordingly
        socket.on('upvoteUpdate', handleVoteUpdate);
        socket.on('downvoteUpdate', handleVoteUpdate);
        socket.on("question-update",handleQuestionUpdate);
        return () => {
            socket.off('upvoteUpdate', handleVoteUpdate);
            socket.on('downvoteUpdate', handleVoteUpdate);
            socket.off("question-update",handleQuestionUpdate);
        };
    }, [handleQuestionUpdate, handleVoteUpdate, playgroundId, setCurrentUser]);

    if (!playgroundId && typeof playgroundId !== "string") {
        return (
            <div className="text-center text-4xl">
                Enter a correct Playground Id
            </div>
        );
    }
    return (
        <div className="bg-neutral-300 h-screen w-screen flex flex-col justify-between px-4 mb-1 overflow-hidden">
            <div className="flex flex-col gap-5 overflow-auto transition">
                <h1
                    className="text-3xl p-2"
                >
                        Classroom Id: {playgroundId}
                </h1>
                {sortedQuestions.map((question, index) => (
                    <div
                        className="p-4 text-lg flex gap-3 transition border border-gray-400 rounded-xl shadow-sm"
                        key={question.id}
                    >
                        <span>Q{index + 1}: {question.body}</span>
                        <button
                            onClick={() => {
                                const data = {
                                    questionId: question.id,
                                    userId: currentUser.id,
                                };

                                if (hasVoted(question)) {
                                    socket.emit('downvote', data);
                                } else {
                                    socket.emit('upvote', data);
                                }
                            }}
                        >
                            {hasVoted(question) ? <BiSolidUpvote /> : <BiUpvote />}
                        </button>
                        <span className="text-red-500">{question.upvotes.length}</span>
                    </div>
                ))}
            </div>
            <div className="flex w-full border border-neutral-500 rounded-xl">
                <input
                    className="py-2 px-4 rounded-xl w-full focus:outline-none"
                    placeholder="enter your question"
                    type="text"
                    onChange={(e) => {
                        setQuestionBody(e.target.value);
                    }}
                />
                <button
                    className="w-14 hover:bg-gray-200 hover:text-black rounded-xl bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none transition"
                    onClick={postQuestion}>
                    <AiOutlineSend size={30} />
                </button>
            </div>
        </div>
    );
};

export default Playground;
