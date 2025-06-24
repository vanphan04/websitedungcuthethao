import { memo, useEffect, useState } from "react";
import axios from "axios";

import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import feature1Img from "assets/users/images/featured/giay.jpg";
import {
  AiOutlineCopy,
  AiOutlineEye,
  AiOutlineFacebook,
  AiOutlineInstagram
} from "react-icons/ai";
import { format } from "utils/format";
import ProductCard from "component/ProductCard";
import Quantity from "component/Quantity";

const ProductDetailPage = () => {
  const [similarProducts, setSimilarProducts] = useState([]);

  const imgs = [feature1Img, feature1Img, feature1Img];

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/sanpham")
      .then((res) => {
        const mapped = res.data.map((sp) => ({
          name: sp.tensp,
          price: sp.gia,
          img: `/images/${sp.hinhanh}`
        }));

        // Lấy ngẫu nhiên 4 sản phẩm
        const shuffled = mapped.sort(() => 0.5 - Math.random());
        setSimilarProducts(shuffled.slice(0, 4));
      })
      .catch((err) => {
        console.error("Lỗi tải sản phẩm tương tự:", err);
      });
  }, []);

  return (
    <>
      <Breadcrumb name="Chi tiết sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 product__detail__pic">
            <img src={feature1Img} alt="product-pic" />
            <div className="main">
              {imgs.map((item, key) => (
                <img src={item} alt="product-pic" key={key} />
              ))}
            </div>
          </div>
          <div className="col-lg-6 product__detail__text">
            <h2>Giày cầu lông</h2>
            <div className="seen-icon">
              <AiOutlineEye />
              {`10 (lượt đã xem)`}
            </div>
            <h3>{format(200000)}</h3>
            <p>
              Zan Sport là cửa hàng chuyên cung cấp dụng cụ thể thao chất lượng
              cao phục vụ cho 3 môn thể thao phổ biến: bóng đá, bóng chuyền và
              cầu lông. Với phương châm "Chất lượng tạo nên thương hiệu", Zan
              Sport cam kết mang đến cho khách hàng những sản phẩm chính hãng,
              đa dạng mẫu mã và phù hợp với mọi đối tượng – từ người chơi phong
              trào đến vận động viên chuyên nghiệp.
            </p>
            <Quantity />
            <ul>
              <li>
                <b>Tình trạng:</b> <span>Còn hàng</span>
              </li>
              <li>
                <b>Số lượng:</b> <span>20</span>
              </li>
              <li>
                <b>Chia sẻ:</b>{" "}
                <span>
                  <AiOutlineFacebook />
                  <AiOutlineInstagram />
                  <AiOutlineCopy />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="product__detail__tab">
          <h4>Thông tin chi tiết</h4>
          <div>
            <ul>
              <li></li>
            </ul>
          </div>
        </div>

        <div className="section-title">
          <h2>Sản phẩm tương tự</h2>
        </div>
        <div className="row">
          {similarProducts.map((item, key) => (
            <div key={key} className="col-lg-3">
              <ProductCard
                img={item.img}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(ProductDetailPage);
