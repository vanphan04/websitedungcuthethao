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
  const [selectedColor, setSelectedColor] = useState("");
  const [colors, setColors] = useState([]);
  const [stock, setStock] = useState(0);
  const [selectedColorName, setSelectedColorName] = useState("");

  // Lấy thông tin sản phẩm + danh sách sản phẩm liên quan
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/sanpham/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
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

    axios
      .get(`http://localhost:3001/api/sanpham/${id}/mausac`)
      .then((res) => {
        setColors(res.data);
      })
      .catch((err) => console.error("Lỗi khi tải màu sắc:", err));
  }, [id]);

  // Khi chọn màu, lấy số lượng và tên màu
  useEffect(() => {
    if (selectedColor) {
      const selected = colors.find((mau) => mau.mamau.toString() === selectedColor);

      setSelectedColorName(selected?.tenmau || "");

      axios
        .get(
          `http://localhost:3001/api/sanpham/${id}/stock?mamau=${selectedColor}`
        )
        .then((res) => {
          const qty = res.data.soluong || 0;
          setStock(qty);
        })
        .catch((err) => {
          console.error("Lỗi khi tải tồn kho:", err);
          setStock(0);
        });
    } else {
      setStock(0);
      setSelectedColorName("");
    }
  }, [selectedColor, colors, id]);

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

            <div className="product__color__choose">
              <label>Màu sắc:</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="form-control mt-2 mb-2"
              >
                <option value="">-- Chọn màu --</option>
                {colors.map((mau) => (
                  <option key={mau.mamau} value={mau.mamau}>
                    {mau.tenmau}
                  </option>
                ))}
              </select>
            </div>

            <Quantity
              productId={product.masp}
              name={product.tensp}
              price={product.gia}
              img={product.hinhanh}
              stock={stock}
              color={selectedColor}
              colorName={selectedColorName}
            />

            <ul>
              <li>
                <b>Tình trạng:</b>{" "}
                <span>{stock > 0 ? "Còn hàng" : "Hết hàng"}</span>
              </li>
              <li>
                <b>Số lượng:</b> <span>{stock}</span>
              </li>
              <li>
                <b>Màu sắc:</b> <span>{selectedColorName || "Chưa chọn"}</span>
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
