import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Layout = ({ children }) => {
  return (
    <div className="page_wrapper">
      <Header />
      <main className="page_content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
