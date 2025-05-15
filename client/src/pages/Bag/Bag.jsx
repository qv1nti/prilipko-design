import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../layout/Layout";
import { removeFromBag, updateQuantity } from "../../store/bagSlice";
import { useNavigate } from "react-router-dom";
import "./Bag.scss";

const Bag = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.bag.items);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="bag-wrapper">
          <h1>BAG</h1>
          <p className="empty-bag">Your bag is empty.</p>
          <a href="/shop" className="continue">← Continue Shopping</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bag-wrapper">
        <h1>BAG</h1>
        <div className="bag-grid">
          <div className="bag-items">
            {items.map((item) => (
              <div className="bag-item" key={item._id}>
                <img src={item.image} alt={item.name} />
                <div className="bag-info">
                  <h3>{item.name}</h3>
                  <p className="price">{item.price.toFixed(2)} UAH</p>
                  <div className="quantity">
                    x{" "}
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        dispatch(updateQuantity({ id: item._id, quantity: parseInt(e.target.value) }))
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromBag(item._id))}
                  className="remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="bag-summary">
            <div className="line">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} UAH</span>
            </div>
            <div className="line">
              <span>Sales Tax</span>
              <span>{tax.toFixed(2)} UAH</span>
            </div>
            <div className="line total">
              <span>ESTIMATED TOTAL</span>
              <span>
                <strong>{total.toFixed(2)} UAH</strong>
              </span>
            </div>

            {items.length > 0 && (
              <button className="checkout" onClick={() => navigate("/checkout")}>
                CHECKOUT
              </button>
            )}

            <p className="terms">
              By continuing to checkout, I agree to the{" "}
              <a href="#">Terms & Conditions</a>,{" "}
              <a href="#">Privacy Policy</a>, and{" "}
              <a href="#">Returns Policy</a>.
            </p>
            <a href="/shop" className="continue">← Continue Shopping</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bag;
