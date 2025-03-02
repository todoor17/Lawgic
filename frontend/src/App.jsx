import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartingScreen from "./pages/StartingScreen/StartingScreen.jsx";
import Login from "./pages/Login/Login.jsx";
import SignIn from "./pages/SignIn/SignIn.jsx";
import Logged from "./pages/Logged/Logged.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingScreen type="starting" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route
          path="/loading"
          element={<StartingScreen type="loading" />}
        ></Route>
        <Route path="/logged" element={<Logged />}></Route>
      </Routes>
    </Router>
  );
}
