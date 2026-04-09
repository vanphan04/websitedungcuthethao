
import axios from "axios";
import { ProductCard } from "component";
import { memo, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001"; 

const ProductsPage = () => {
  const sorts = ["Giảm dần", "Tăng dần"];
  const { madm, maloai } = useParams();
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSort, setSelectedSort] = useState("Giảm dần");
  const [danhMucList, setDanhMucList] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let endpoint = "";

        if (keyword) {
          endpoint = `${BASE_URL}/api/sanpham/timkiem?keyword=${encodeURIComponent(
            keyword
          )}`;
        } else if (madm) {
          endpoint = `${BASE_URL}/api/sanpham/danhmuc/${madm}`;
        } else if (maloai) {
          endpoint = `${BASE_URL}/api/sanpham/loai/${maloai}`;
        } else {
          endpoint = `${BASE_URL}/api/sanpham`;
        }

        const res = await axios.get(endpoint);
        setAllProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [madm, maloai, keyword, location.search]);

  // ================= FETCH DANH MỤC =================
  useEffect(() => {
    const fetchDanhMuc = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/danhmuc`);
        setDanhMucList(res.data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };

    fetchDanhMuc();
  }, []);

  // ================= FILTER GIÁ =================
  const handleFilterPrice = () => {
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || Infinity;

    const result = allProducts.filter(
      (sp) => sp.gia >= min && sp.gia <= max
    );

    setFilteredProducts(result);
  };

  // ================= SORT =================
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (selectedSort) {
      case "Giảm dần":
        return list.sort((a, b) => b.gia - a.gia);
      case "Tăng dần":
        return list.sort((a, b) => a.gia - b.gia);
      default:
        return list;
    }
  }, [filteredProducts, selectedSort]);

  return (
    <>
      <Breadcrumb name="Danh sách sản phẩm" />

      <div className="container">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-lg-3">
            <div className="sidebar">
              {/* FILTER GIÁ */}
              <div className="sidebar__item">
                <h2>Mức giá</h2>
                <div className="price-range-wrap">
                  <div>
                    <p>Từ:</p>
                    <input
                      type="number"
                      min={0}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>

                  <div>
                    <p>Đến:</p>
                    <input
                      type="number"
                      min={0}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>

                  <button className="btn_loc" onClick={handleFilterPrice}>
                    Lọc
                  </button>
                </div>
              </div>

              {/* SORT */}
              <div className="sidebar__item">
                <h2>Sắp xếp</h2>
                <div className="tags">
                  {sorts.map((item) => (
                    <div
                      key={item}
                      className={`tag ${
                        selectedSort === item ? "active" : ""
                      }`}
                      onClick={() => setSelectedSort(item)}
                      style={{ cursor: "pointer" }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* DANH MỤC */}
              <div className="sidebar__item">
                <h2>Thể loại khác</h2>
                <ul>
                  {danhMucList.map((cat) => (
                    <li key={cat.madm}>
                      <Link
                        to={`/san-pham/danh-muc/${cat.madm}`}
                        className={
                          madm === String(cat.madm) ? "active" : ""
                        }
                      >
                        {cat.tendm}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="col-lg-9">
            <div className="row">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((item) => (
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

