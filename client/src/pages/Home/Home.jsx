import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.scss";

export default function Home() {
  return (
    <div className="app app_homepage">
      <Header />
      <div className="content_wrapper">
        <h1>Головна сторінка</h1>
        <p>Ласкаво просимо до Prilipko Design!</p>
      </div>
      <Footer />
    </div>
  );
}