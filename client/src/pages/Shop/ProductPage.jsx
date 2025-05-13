import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../layout/Layout";
import { useDispatch } from "react-redux";
import { addToBag } from "../../store/bagSlice"; // шляхи за потребою адаптуй
import "./ProductPage.scss";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ⬅️ redux dispatcher
  const [product, setProduct] = useState(null);
  const [openSections, setOpenSections] = useState({
    care: false,
    returns: false
  });

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddToBag = () => {
    dispatch(addToBag(product));
  };

  if (!product) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="product-page">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">{product.price} UAH</p>

          <button className="add-to-bag" onClick={handleAddToBag}>
            ADD TO BAG
          </button>

          <div className="details">
            <h3>DETAILS</h3>
            <ul>
              <li>{product.description}</li>
            </ul>
          </div>

          <div className="section">
            <h3 onClick={() => toggleSection('care')} className="section-title">
              CARE <span>{openSections.care ? '−' : '+'}</span>
            </h3>
            {openSections.care && (
              <p className="section-content">Care instructions will go here...</p>
            )}
          </div>

          <div className="section">
            <h3 onClick={() => toggleSection('returns')} className="section-title">
              RETURNS / EXCHANGES <span>{openSections.returns ? '−' : '+'}</span>
            </h3>
            {openSections.returns && (
              <p className="section-content">Return and exchange policy details...</p>
            )}
          </div>

          <button onClick={() => navigate(-1)} className="back-button">
            ← BACK TO ALL
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
