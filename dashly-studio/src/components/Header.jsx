import "./Header.css"
import arrowIcon from '../assets/arrow.png';

function Header() {
  return (
    <header className="glass-navbar">
      <div className="logo">Dashly</div>
      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">Stages</a>
        <a href="#">FAQ</a>
        <a href="#">Contact</a>
        <a href="#" className="cta">
            Get In Touch
            <img src={arrowIcon} alt="Arrow icon" className="arrow-icon" />
        </a>
      </nav>
    </header>
  );
}

export default Header;
