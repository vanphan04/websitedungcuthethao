import { memo, useState, useEffect } from "react";
import "./style.scss";

const Quantity = ({
  hasAddToCart = true,
  productId,
  name,
  price,
  img,
  quantity = 1,
  onQuantityChange, // optional callback
}) => {
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
        item.id === productId ? { ...item, quantity: newQty } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage")); // Cập nhật các component lắng nghe
    }

    if (onQuantityChange) {
      onQuantityChange(newQty);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = cart.findIndex((item) => item.id === productId);
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += qty;
    } else {
      cart.push({
        id: productId,
        name,
        price,
        img,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
    window.dispatchEvent(new Event("storage")); // Cho Header hoặc Giỏ hàng cập nhật
  };

  return (
    <div className="quantity-container">
      <div className="quantity">
        <span className="qtybtn" onClick={() => updateQty(qty - 1)}>-</span>
        <input
          type="number"
          value={qty}
          onChange={(e) => updateQty(parseInt(e.target.value) || 1)}
        />
        <span className="qtybtn" onClick={() => updateQty(qty + 1)}>+</span>
      </div>
      {hasAddToCart && (
        <button type="button" className="button-submit" onClick={handleAddToCart}>
          Thêm giỏ hàng
        </button>
      )}
    </div>
  );
};

export default memo(Quantity);
