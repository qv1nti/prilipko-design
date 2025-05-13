import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import { Link, useParams } from "react-router-dom";
import "./Shop.scss";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { gender } = useParams(); // "him", "her" або undefined

  useEffect(() => {
    axios.get("/api/products")
      .then((res) => {
        const all = res.data;
        const filtered = gender ? all.filter(p => p.gender === gender) : all;
        setProducts(filtered);
      })
      .catch((err) => console.error("Помилка товарів:", err));
  }, [gender]);

  return (
    <Layout>
      <div className="shop-page">
        <div className="shop-grid">
          {products.map((p) => (
            <Link to={`/shop/${p._id}`} className="product-tile" key={p._id}>
              <div className="image-wrapper">
                <img src={p.image} alt={p.name} />
                <div className="overlay">
                  <h3>{p.name}</h3>
                  <span>{p.price} грн</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
