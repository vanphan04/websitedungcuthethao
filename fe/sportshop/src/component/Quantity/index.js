import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import "./style.scss";

const Quantity = ({
  hasAddToCart = true,
  productId,
  variantId,
  name,
  price,
  img,
  quantity = 1,
  stock = 0,
  color,
  colorName,
  size,
  onQuantityChange,
}) => {
  const navigate = useNavigate();
  const [qty, setQty] = useState(quantity);

  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  const updateQty = (newQty) => {
    if (newQty < 1) return;
    setQty(newQty);

    if (!hasAddToCart) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = cart.map((item) =>
        item.variantId === variantId ? { ...item, quantity: newQty } : item,
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));
    }

    if (onQuantityChange) {
      onQuantityChange(newQty);
    }
  };

  const handleAddToCart = () => {
    // Kiểm tra user đã đăng nhập
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng!");
      navigate(ROUTERS.USER.LOGIN);
      return;
    }

    if (!variantId || !colorName) {
      alert("Vui lòng chọn phiên bản trước khi thêm vào giỏ hàng.");
      return;
    }

    if (qty > stock) {
      alert("Không đủ hàng trong kho.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = cart.findIndex(
      (item) => item.variantId === variantId,
    );

    if (existingItemIndex >= 0) {
      const newTotal = cart[existingItemIndex].quantity + qty;
      if (newTotal > stock) {
        alert("Không đủ hàng trong kho.");
        return;
      }
      cart[existingItemIndex].quantity = newTotal;
    } else {
      cart.push({
        id: productId,
        variantId,
        name,
        price,
        img,
        quantity: qty,
        color,
        colorName,
        size,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="quantity-container">
      <div className="quantity">
        <span className="qtybtn" onClick={() => updateQty(qty - 1)}>
          -
        </span>
        <input
          type="number"
          value={qty}
          onChange={(e) => updateQty(parseInt(e.target.value) || 1)}
        />
        <span className="qtybtn" onClick={() => updateQty(qty + 1)}>
          +
        </span>
      </div>
      {hasAddToCart && (
        <button
          type="button"
          className="button-submit"
          onClick={handleAddToCart}
        >
          Thêm giỏ hàng
        </button>
      )}
    </div>
  );
};

export default memo(Quantity);
