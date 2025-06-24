import "./Footer.css";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="footer-support">
                    <span>Stand With Ukraine</span>
                    <span className="ukraine-flag"></span>
                </div>

                <div className="footer-bottom">
                    <div className="footer-left">© 2025 DASHLY STUDIO</div>
                    <div className="footer-links">
                        <a
                            href="https://www.instagram.com/dashly__studio?igsh=bDhteTk3cTNwbHZs&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
