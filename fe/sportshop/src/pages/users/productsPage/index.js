import axios from "axios";
import { ProductCard } from "component";
import { memo, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Breadcrumb from "../theme/breadcrumb";
import { categories } from "../theme/header";
import "./style.scss";

const ProductsPage = () => {
  const sorts = ["Giảm dần", "Tăng dần", "Mới nhất", "Cũ nhất", "Bán chạy", "Giảm giá"];
  const { madm, maloai } = useParams(); // 👈 lấy thêm maloai
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let endpoint = "";

        if (keyword) {
          endpoint = `http://localhost:3001/api/sanpham/timkiem?keyword=${encodeURIComponent(keyword)}`;
        } else if (madm) {
          endpoint = `http://localhost:3001/api/sanpham/danhmuc/${madm}`;
        } else if (maloai) {
          endpoint = `http://localhost:3001/api/sanpham/loai/${maloai}`; // 👈 gọi theo loại
        } else {
          endpoint = `http://localhost:3001/api/sanpham`;
        }

        const res = await axios.get(endpoint);
        setProducts(res.data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [madm, maloai, keyword]); // 👈 thêm maloai vào dependency

  return (
    <>
      <Breadcrumb name="Danh sách sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="sidebar">
              <div className="sidebar__item">
                <h2>Mức giá</h2>
                <div className="price-range-wrap">
                  <div><p>Từ:</p><input type="number" min={0} disabled /></div>
                  <div><p>Đến:</p><input type="number" min={0} disabled /></div>
                </div>
              </div>
              <div className="sidebar__item">
                <h2>Sắp xếp</h2>
                <div className="tags">
                  {sorts.map((item, key) => (
                    <div className={`tag ${key === 0 ? "active" : ""}`} key={key}>{item}</div>
                  ))}
                </div>
              </div>
              <div className="sidebar__item">
                <h2>Thể loại khác</h2>
                <ul>
                  {categories.map((cat, key) => (
                    <li key={key}>
                      <Link to={`/san-pham/danh-muc/${cat.madm}`}>{cat.tendm}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="row">
              {products.length > 0 ? (
                products.map((item) => (
                  <div className="col-lg-4" key={item.masp}>
                    <ProductCard
                      id={item.masp}
                      name={item.tensp}
                      img={`/images/${item.hinhanh}`}
                      price={item.gia}
                    />
                  </div>
                ))
              ) : (
                <p>Không có sản phẩm nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProductsPage);
