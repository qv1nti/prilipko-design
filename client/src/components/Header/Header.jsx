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

  const [showShopSub, setShowShopSub] = useState(false);

  return (
    <header className="prilipko-header">
      <div className="menu-toggle" onClick={toggleMenu}>✶</div>

      <aside className={`prilipko-sidebar ${menuOpen ? "open" : ""}`}>
        <nav className="sidebar-menu">
          <div className="shop-group">
            <div className="shop-heading" onClick={() => setShowShopSub(!showShopSub)}>
              SHOP
            </div>
            {showShopSub && (
              <div className="shop-sub">
                <Link to="/shop/him" onClick={toggleMenu}>FOR HIM</Link>
                <Link to="/shop/her" onClick={toggleMenu}>FOR HER</Link>
              </div>
            )}
          </div>

          <Link to="#" onClick={toggleMenu}>HISTORY</Link>
          <Link to="#" onClick={toggleMenu}>LOOKBOOK</Link>
        </nav>
      </aside>

      <a className="header_middle_logo" href="/">
        <img src={mainLogo} alt="Prilipko Design" />
      </a>

      <div className="prilipko-topbar">

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
