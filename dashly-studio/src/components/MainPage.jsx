import "./MainPage.css";
import arrowImage from "../assets/arrow.png";
export function MainPage() {
    return (
        <>
            <div className="hero-wrapper">
                <div className="hero">
                    <div className="hero-content">
                        <div className="hero-left">
                            <p className="subtitle">
                                Dashly Studio builds modern, reliable websites
                                that align with your business goals and deliver
                                real results.
                            </p>
                            <a href="#packages" className="services-link">
                                Services{" "}
                                <img
                                    src={arrowImage}
                                    alt="Arrow"
                                    className="arrow-icon"
                                />
                            </a>
                        </div>

                        <div className="hero-line"></div>

                        <div className="hero-right">
                            <h1 className="headline">
                                Your Digital <br />
                                <span className="highlight">
                                    Excellence
                                </span>{" "}
                                <br />
                                Begins Here
                            </h1>
                        </div>
                    </div>

                    <div className="hero-stats">
                        <div>
                            <p className="stat-number">
                                3<span>+</span>
                            </p>
                            <p className="stat-label">Experience</p>
                        </div>
                        <div>
                            <p className="stat-number">
                                30<span>+</span>
                            </p>
                            <p className="stat-label">Projects</p>
                        </div>
                        <div>
                            <p className="stat-number">
                                1000<span>+</span>
                            </p>
                            <p className="stat-label">Hours of work</p>
                        </div>
                        <div>
                            <p className="stat-number">
                                5<span>+</span>
                            </p>
                            <p className="stat-label">Countries</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
