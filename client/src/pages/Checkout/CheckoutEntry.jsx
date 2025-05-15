import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckoutEntry = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate("/checkout/form");
    } else {
      navigate("/checkout/login");
    }
  }, [user, navigate]);

  return null;
};

export default CheckoutEntry;
