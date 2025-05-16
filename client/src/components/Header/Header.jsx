import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import "./Header.scss";
import mainLogo from "../../img/main_logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShopSub, setShowShopSub] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.bag.items);
  const user = useSelector((state) => state.auth.user);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

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
          <Link to="#" className="shop-heading" onClick={toggleMenu}>HISTORY</Link>
          <Link to="#" onClick={toggleMenu}>LOOKBOOK</Link>
        </nav>

        <div className="mobile-auth">
          {user ? (
            <>
              <Link to="/profile" onClick={toggleMenu}>MY ACCOUNT</Link>
              <button onClick={handleLogout}>LOGOUT</button>
            </>
          ) : (
            <Link to="/login" onClick={toggleMenu}>LOGIN</Link>
          )}
        </div>

      </aside>

      <a className="header_middle_logo" href="/">
        <img src={mainLogo} alt="Prilipko Design" />
      </a>

      <div className="prilipko-topbar">
        <div className="topbar-links">
          {user ? (
            <div className="user-dropdown">
              <Link to="/profile">
                {"MY ACCOUNT"}
              </Link>
              <div className="logout-hover">
                <button onClick={handleLogout}>LOGOUT</button>
              </div>
            </div>
          ) : (
            <Link to="/login">LOGIN</Link>
          )}
          <span>/</span>
          {totalQuantity > 0 ? (
            <Link to="/bag" className="bag-link">BAG {totalQuantity}</Link>
          ) : (
            <span className="bag-link disabled">BAG 0</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
