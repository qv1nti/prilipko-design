import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import { Link, useParams, Navigate } from "react-router-dom";
import "./Shop.scss";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { gender } = useParams(); // "him", "her" або undefined

  useEffect(() => {
    if (!gender) return; // не виконуємо запит, якщо немає статі

    axios.get("/api/products")
      .then((res) => {
        const all = res.data;
        const filtered = all.filter(p => p.gender === gender);
        setProducts(filtered);
      })
      .catch((err) => console.error("Помилка товарів:", err));
  }, [gender]);

  if (!gender) {
    return <Navigate to="/shop/him" replace />;
  }

  return (
    <Layout>
      <div className="shop-page">
        <div className="shop-grid">
          {products.map((p) => (
            <Link to={`/shop/product/${p._id}`} className="product-tile" key={p._id}>
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
