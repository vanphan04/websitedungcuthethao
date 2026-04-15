import axios from "axios";
import ProductCard from "component/ProductCard";
import Quantity from "component/Quantity";
import { memo, useEffect, useMemo, useState } from "react";
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

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  // ====================== LOAD DATA ======================
  useEffect(() => {
    axios.get(`http://localhost:3001/api/sanpham/${id}`)
      .then((res) => {
        setProduct(res.data);
        setPrice(res.data.gia);
      });

    axios.get("http://localhost:3001/api/sanpham")
      .then((res) => {
        const mapped = res.data.map((sp) => ({
          id: sp.masp,
          name: sp.tensp,
          price: sp.gia,
          img: `/images/${sp.hinhanh}`,
        }));

        setSimilarProducts(mapped.sort(() => 0.5 - Math.random()).slice(0, 4));
      });

    axios.get("http://localhost:3001/api/tonkho")
      .then((res) => {
        const productVariants = res.data.filter(
          (v) => v.masp === parseInt(id)
        );

        setVariants(productVariants);

        const uniqueColors = [
          ...new Set(productVariants.map(v => Number(v.mamau)).filter(Boolean))
        ];

        setColors(uniqueColors);

        if (productVariants.length > 0) {
          setSelectedColor(Number(productVariants[0].mamau));
        }
      });
  }, [id]);

  // ====================== SIZE ======================
  const sizes = useMemo(() => {
    if (!selectedColor) return [];

    return [
      ...new Set(
        variants
          .filter(v => Number(v.mamau) === Number(selectedColor))
          .map(v => v.size)
          .filter(Boolean)
      ),
    ];
  }, [variants, selectedColor]);

  useEffect(() => {
    if (!sizes.length) {
      setSelectedSize("");
      return;
    }

    if (!sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes,selectedSize]);

  useEffect(() => {
    setSelectedSize("");
  }, [selectedColor]);

  // ====================== VARIANT ======================
  useEffect(() => {
    const selected = variants.find(
      (v) =>
        Number(v.mamau) === Number(selectedColor) &&
        (v.size || "") === selectedSize
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

          {/* IMAGE (LUÔN GIỮ ẢNH GỐC) */}
          <div className="col-lg-6 product__detail__pic">
            <img
              src={`/images/${product.hinhanh}`}
              alt={product.tensp}
            />
          </div>

          {/* INFO */}
          <div className="col-lg-6 product__detail__text">
            <h2>{product.tensp}</h2>
            <h3>{format(price)}</h3>
            <p>{product.mota}</p>

            {/* ===== MÀU ===== */}
            <div className="product__color__choose">
              <label>Màu sắc:</label>

              <div className="color-swatch">
                {colors.map((color) => {
                  const variant = variants.find(
                    v => Number(v.mamau) === Number(color)
                  );

                  return (
                    <div
                      key={color}
                      className={`color-box ${
                        selectedColor === color ? "active" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      title={variant?.tenmau}
                      style={{
                        backgroundColor: variant?.hex_code || "#ccc",
                        backgroundImage: variant?.image
                          ? `url(/images/${variant.image})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* ===== SIZE ===== */}
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

            {/* ===== QUANTITY ===== */}
            <Quantity
              productId={product.masp}
              variantId={selectedVariantId}
              name={product.tensp}
              price={price}
              img={product.hinhanh}
              stock={stock}
              color={selectedColor}
              colorName={
                variants.find(v => Number(v.mamau) === Number(selectedColor))?.tenmau || ""
              }
              size={selectedSize}
            />

            {/* INFO */}
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
                  {variants.find(v => Number(v.mamau) === Number(selectedColor))?.tenmau || "Chưa chọn"}
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

        {/* SIMILAR */}
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