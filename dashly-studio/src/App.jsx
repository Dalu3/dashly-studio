import Header from "./components/Header.jsx";
import "./App.css";
import { MainPage } from "./components/MainPage.jsx";
import Packages from "./components/Packages.jsx";
import Stages from "./components/Stages.jsx";
import FAQ from "./components/FAQ.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { MouseFollower } from "./components/MouseFollower.jsx";

function App() {
    return (
        <>
            <MouseFollower />
            <Header />
            <MainPage />
            <Packages />
            <Stages />
            <FAQ />
            <Contact />
            <Footer />
        </>
    );
}

export default App;
