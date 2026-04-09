import { memo } from "react";
import "./style.scss";
import { AiOutlineEye } from "react-icons/ai";
import { generatePath, Link } from "react-router-dom";
import { format } from "utils/format";
import { ROUTERS } from "utils/router";

const ProductCard = ({ id, img, name, price }) => {

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
