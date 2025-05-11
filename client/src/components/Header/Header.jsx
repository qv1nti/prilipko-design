import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">Prilipko Design</div>
      <nav className="header__nav">
        <a href="/">Home</a>
        <a href="/shop">Shop</a>
        <a href="/login">Login</a>
      </nav>
    </header>
  );
};

export default Header;
