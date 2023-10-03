import {BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import {RecoilRoot} from "recoil";
import Landing from "./components/Landing.tsx";
import Playground from "./components/Playground.tsx";
import "./index.css"
import axios from "axios";
import Join from "./components/Join.tsx";
import Register from "./components/Register.tsx";

function App() {
    axios.defaults.withCredentials = true;

  return (
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path={"/"} element={<Landing />}/>
            <Route path={"/signup"} element={<Register />}/>
            <Route path={"/join"} element={<Join />}/>
            <Route path={"/playground/:playgroundId"} element={<Playground />}/>
          </Routes>
        </Router>
      </RecoilRoot>
  )
}

export default App
