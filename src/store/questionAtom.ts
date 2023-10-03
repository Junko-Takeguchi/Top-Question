import {atom} from "recoil";

interface Question {
    id: string;
    body: string;
    playgroundId: string;
    upvotes: string[];
}

const questionsAtom = atom<Question[]>({
    key: "questionState",
    default: []
});
export default questionsAtom;