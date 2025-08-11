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

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.scrollTo({ top: 0, behavior: "smooth" });

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        if (!isLoading && window.location.hash) {
            const id = decodeURIComponent(window.location.hash.slice(1));
            // wait one frame so the DOM is painted
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
