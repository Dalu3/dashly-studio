import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import "./App.css";
import { MainPage } from "./components/MainPage.jsx";
import Packages from "./components/Packages.jsx";
import Stages from "./components/Stages.jsx";
import FAQ from "./components/FAQ.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { MouseFollower } from "./components/MouseFollower.jsx";
import Loader from "./components/Loader.jsx";
import Privacy from "./components/Privacy.jsx";
import Terms from "./components/Terms.jsx";

function HomePage() {
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

function App() {
    const [isLoading, setIsLoading] = useState(true);

    // A) Init: only reset to top when there's NO hash. No smooth here.
    useEffect(() => {
        window.history.scrollRestoration = "manual";
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // B) After loader: if there's a hash, smooth-scroll to it
    useEffect(() => {
        if (!isLoading && window.location.hash) {
            const id = decodeURIComponent(window.location.hash.slice(1));
            requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        }
    }, [isLoading]);

    return (
        <Router>
            {isLoading && <Loader />}
            {!isLoading && (
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            )}
        </Router>
    );
}

export default App;
