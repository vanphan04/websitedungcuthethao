import { memo } from "react";
import './style.scss';
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { generatePath, Link } from "react-router-dom";
import { format } from "utils/format";
import { ROUTERS } from "utils/router";

const ProductCard = ({ id, img, name, price }) => {
  const productLink = id ? generatePath(ROUTERS.USER.PRODUCT, { id }) : "#";

  return (
    <div className="featured__item">
      <div className="featured__item__pic">
        <img src={img} alt={name} />
        <ul className="featured__item__pic__hover">
          <li><AiOutlineEye /></li>
          <li><AiOutlineShoppingCart /></li>
        </ul>
      </div>
      <div className="featured__item__text">
        <h6>
          <Link to={productLink}>{name}</Link>
        </h6>
        <h5>{format(price)}</h5>
      </div>
    </div>
  );
};

export default memo(ProductCard);
