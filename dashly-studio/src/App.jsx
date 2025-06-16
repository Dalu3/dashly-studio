import Header from "./components/Header.jsx";
import "./App.css";
import { Routes, Route } from "react-router";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Header />}></Route>
        </Routes>
    );
}

export default App;
