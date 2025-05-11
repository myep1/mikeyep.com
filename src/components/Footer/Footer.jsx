import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ toggleTheme }) => {
    const year = new Date().getFullYear();
    const build = import.meta.env.VITE_DEPLOY_STRING;
  
    return (
      <footer className="footer">
        <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/2048">2048</Link>
            {/*<Link to="/2048test">2048 Test</Link>*/}
            <Link to="/calculator">Calculator</Link>
            <Link to="/item4">Item4</Link>
            <Link to="/item5">Item5</Link>
        </nav>
        <div className="footer-info">
          <span>© {year} Mike Yep. All Rights Reserved.</span>
          <span>{build}</span>
          <button className="theme-toggle" onClick={toggleTheme}>Light / Dark</button>
        </div>
      </footer>
    );
  };
  

export default Footer;
