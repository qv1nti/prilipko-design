import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Prilipko Design. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
