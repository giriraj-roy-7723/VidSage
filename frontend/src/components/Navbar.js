import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">
        <Link to="/">✨ VidSage</Link>
      </h1>
      <ul className="nav-links">
        <li><Link to="/video-uploader">Upload Video</Link></li>
        <li><Link to="/chatbot">Chatbot</Link></li>
        <li><Link to="/summary">Detailed Summary</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
