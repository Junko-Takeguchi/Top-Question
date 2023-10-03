import {atom} from "recoil";

const userAtom = atom({
    key: "currentUser",
    default: {
        id: "",
        userName: ""
    }
});
export default userAtom;