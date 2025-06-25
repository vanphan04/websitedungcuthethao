import { memo } from "react";
import "./style.scss";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { generatePath, Link } from "react-router-dom";
import { format } from "utils/format";
import { ROUTERS } from "utils/router";

const ProductCard = ({ id, img, name, price }) => {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        img,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="featured__item">
      <div className="featured__item__pic">
        <img src={img} alt={name} />
        <ul className="featured__item__pic__hover">
          <li>
            {" "}
            <Link to={generatePath(ROUTERS.USER.PRODUCT, { id })}>
              <AiOutlineEye />
            </Link>
          </li>
          <li onClick={handleAddToCart}>
            <AiOutlineShoppingCart />
          </li>
        </ul>
      </div>
      <div className="featured__item__text">
        <h6>
          <Link to={generatePath(ROUTERS.USER.PRODUCT, { id })}>{name}</Link>
        </h6>
        <h5>{format(price)}</h5>
      </div>
    </div>
  );
};

export default memo(ProductCard);
