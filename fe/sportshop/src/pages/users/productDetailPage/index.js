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
  const [variants, setVariants] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/sanpham/${id}`)
      .then((res) => {
        setProduct(res.data);
        setPrice(res.data.gia);
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
      .get(`http://localhost:3001/api/tonkho`)
      .then((res) => {
        const productVariants = res.data.filter((v) => v.masp === parseInt(id));
        setVariants(productVariants);
        const uniqueColors = [...new Set(productVariants.map((v) => v.mamau))];
        setColors(uniqueColors);
        if (productVariants.length > 0) {
          setSelectedColor(productVariants[0].mamau);
          const sizesForFirstColor = [
            ...new Set(
              productVariants
                .filter((v) => v.mamau === productVariants[0].mamau)
                .map((v) => v.size)
                .filter((s) => s),
            ),
          ];
          setSizes(sizesForFirstColor);
          setSelectedSize(productVariants[0].size || "");
        }
      })
      .catch((err) => console.error("Lỗi khi tải variants:", err));
  }, [id]);

  useEffect(() => {
    if (selectedColor) {
      const sizesForColor = [
        ...new Set(
          variants
            .filter((v) => v.mamau === selectedColor)
            .map((v) => v.size)
            .filter((s) => s),
        ),
      ];
      setSizes(sizesForColor);

      if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
        setSelectedSize(sizesForColor[0]);
      } else if (sizesForColor.length === 0) {
        setSelectedSize("");
      }
    }
  }, [selectedColor, variants, selectedSize]);

  useEffect(() => {
    const selected = variants.find(
      (variant) =>
        variant.mamau === selectedColor &&
        (variant.size || "") === selectedSize,
    );

    if (selected) {
      setSelectedVariantId(selected.variant_id);
      setStock(selected.soluong || 0);
      setPrice(selected.price || product?.gia || 0);
    } else {
      setSelectedVariantId("");
      setStock(0);
      setPrice(product?.gia || 0);
    }
  }, [selectedColor, selectedSize, variants, product]);

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
            <h3>{format(price)}</h3>
            <p>{product.mota}</p>

            <div className="product__color__choose">
              <label>Màu sắc:</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="form-control mt-2 mb-2"
              >
                <option value="">-- Chọn màu --</option>
                {colors.map((color) => {
                  const variant = variants.find((v) => v.mamau === color);
                  return (
                    <option key={color} value={color}>
                      {variant?.tenmau || color}
                    </option>
                  );
                })}
              </select>
            </div>

            {sizes.length > 0 && (
              <div className="product__size__choose">
                <label>Size:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="form-control mt-2 mb-2"
                >
                  <option value="">-- Chọn size --</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Quantity
              productId={product.masp}
              variantId={selectedVariantId}
              name={product.tensp}
              price={price}
              img={product.hinhanh}
              stock={stock}
              color={selectedColor}
              colorName={
                variants.find((v) => v.mamau === selectedColor)?.tenmau || ""
              }
              size={selectedSize}
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
                <b>Màu sắc:</b>{" "}
                <span>
                  {variants.find((v) => v.mamau === selectedColor)?.tenmau ||
                    "Chưa chọn"}
                </span>
              </li>
              {selectedSize && (
                <li>
                  <b>Size:</b> <span>{selectedSize}</span>
                </li>
              )}
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
