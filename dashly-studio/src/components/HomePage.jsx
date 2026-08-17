// Keep semantic homepage sections in the first React tree. Their own
// components gate animation, measurement, and pointer effects near the
// viewport; content does not wait for those enhancements to mount.
import { Hero } from "./hero/Hero";
import { MainPage } from "./MainPage.jsx";
import { EstimatorHost } from "./estimator/EstimatorHost.jsx";
import { SelectedWork } from "./selected-work/SelectedWork";
import Packages from "./Packages.jsx";
import Stages from "./Stages.jsx";
import FAQ from "./FAQ.jsx";
import Contact from "./contact/Contact";

export default function HomePage({ onHeroReady }) {
    return (
        <main id="main-content" tabIndex={-1}>
            <Hero onReady={onHeroReady}>
                <MainPage />
            </Hero>
            <SelectedWork />
            <Packages />
            <Stages />
            <FAQ />
            <Contact />
            <EstimatorHost />
        </main>
    );
}
