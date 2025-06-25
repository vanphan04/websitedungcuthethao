import axios from "axios";
import ProductCard from "component/ProductCard";
import Quantity from "component/Quantity";
import { memo, useEffect, useState } from "react";
import {
  AiOutlineCopy,
  AiOutlineFacebook,
  AiOutlineInstagram,
} from "react-icons/ai";
import { useParams } from "react-router-dom";
import { format } from "utils/format";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/sanpham/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Lỗi khi tải chi tiết:", err));

    axios.get("http://localhost:3001/api/sanpham").then((res) => {
      const mapped = res.data.map((sp) => ({
        id: sp.masp,
        name: sp.tensp,
        price: sp.gia,
        img: `/images/${sp.hinhanh}`,
      }));
      const shuffled = mapped.sort(() => 0.5 - Math.random());
      setSimilarProducts(shuffled.slice(0, 4));
    });
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  return (
    <>
      <Breadcrumb name="Chi tiết sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 product__detail__pic">
            <img src={`/images/${product.hinhanh}`} alt={product.tensp} />
          </div>
          <div className="col-lg-6 product__detail__text">
            <h2>{product.tensp}</h2>
            <h3>{format(product.gia)}</h3>
            <p>{product.mota}</p>
            <Quantity
              productId={product.masp}
              name={product.tensp}
              price={product.gia}
              img={`/images/${product.hinhanh}`}
            />

            <ul>
              <li>
                <b>Tình trạng:</b>{" "}
                <span>{product.soluong > 0 ? "Còn hàng" : "Hết hàng"}</span>
              </li>
              <li>
                <b>Số lượng:</b> <span>{product.soluong}</span>
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

        <div className="section-title">
          <h2>Sản phẩm tương tự</h2>
        </div>
        <div className="row">
          {similarProducts.map((item) => (
            <div key={item.id} className="col-lg-3">
              <ProductCard
                id={item.id}
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
