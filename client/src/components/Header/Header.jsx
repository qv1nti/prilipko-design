import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Header.scss";
import mainLogo from "../../img/main_logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="prilipko-header">
      <div className="menu-toggle" onClick={toggleMenu}>✶</div>

      <aside className={`prilipko-sidebar ${menuOpen ? "open" : ""}`}>
        <nav className="sidebar-menu">
          <Link to="/shop" onClick={toggleMenu}>SHOP</Link>
          <Link to="#" onClick={toggleMenu}>HISTORY</Link>
          <Link to="#" onClick={toggleMenu}>LOOKBOOK</Link>
        </nav>
      </aside>

      <div className="prilipko-topbar">
        <a className="header_middle_logo" href="/">
          <img src={mainLogo} alt="Prilipko Design" />
        </a>

        <div className="topbar-links">
          {isAuthenticated ? (
            <div className="user-dropdown">
              <Link to="/profile">{"MY ACCOUNT" || "PROFILE"}</Link>
              <div className="logout-hover">
                <button onClick={handleLogout}>LOGOUT</button>
              </div>
            </div>
          ) : (
            <Link to="/login">LOGIN</Link>
          )}
          <span>/</span>
          <Link to="/bag">BAG 0</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
