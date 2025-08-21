import axios from "axios";
import { ProductCard } from "component";
import { memo, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";

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

  // Lấy sản phẩm theo keyword, madm, maloai
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let endpoint = "";

        if (keyword) {
          endpoint = `http://localhost:3001/api/sanpham/timkiem?keyword=${encodeURIComponent(
            keyword
          )}`;
        } else if (madm) {
          endpoint = `http://localhost:3001/api/sanpham/danhmuc/${madm}`;
        } else if (maloai) {
          endpoint = `http://localhost:3001/api/sanpham/loai/${maloai}`;
        } else {
          endpoint = `http://localhost:3001/api/sanpham`;
        }

        const res = await axios.get(endpoint);
        setAllProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [madm, maloai, keyword]);

  // Gọi API danh mục sản phẩm
  useEffect(() => {
    const fetchDanhMuc = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/danhmuc");
        setDanhMucList(res.data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };

    fetchDanhMuc();
  }, []);

  const handleFilterPrice = () => {
    let result = allProducts;

    if (minPrice !== "") {
      result = result.filter((sp) => sp.gia >= parseInt(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter((sp) => sp.gia <= parseInt(maxPrice));
    }

    setFilteredProducts(result);
  };

  const sortProducts = (list) => {
    switch (selectedSort) {
      case "Giảm dần":
        return list.slice().sort((a, b) => b.gia - a.gia);
      case "Tăng dần":
        return list.slice().sort((a, b) => a.gia - b.gia);
      default:
        return list;
    }
  };

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

              <div className="sidebar__item">
                <h2>Sắp xếp</h2>
                <div className="tags">
                  {sorts.map((item, key) => (
                    <div
                      className={`tag ${selectedSort === item ? "active" : ""}`}
                      key={key}
                      onClick={() => setSelectedSort(item)}
                      style={{ cursor: "pointer" }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar__item">
                <h2>Thể loại khác</h2>
                <ul>
                  {danhMucList.map((cat, key) => (
                    <li key={key}>
                      <Link
                        to={`/san-pham/danh-muc/${cat.madm}`}
                        className={madm === String(cat.madm) ? "active" : ""}
                      >
                        {cat.tendm}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="row">
              {sortProducts(filteredProducts).length > 0 ? (
                sortProducts(filteredProducts).map((item) => (
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
