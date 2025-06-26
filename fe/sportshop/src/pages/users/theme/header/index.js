import axios from "axios";
import { memo, useEffect, useState } from "react";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlinePhone,
  AiOutlineShoppingCart
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "utils/format";
import { ROUTERS } from "utils/router";
import "./style.scss";

// Danh mục sản phẩm
export const categories = [
  { madm: 1, tendm: "Giày" },
  { madm: 6, tendm: "Quần áo" },
  { madm: 7, tendm: "Vợt" },
  { madm: 8, tendm: "Ba lô" },
  { madm: 9, tendm: "Phụ Kiện" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const [cartTotal, setCartTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loaiSanPham, setLoaiSanPham] = useState([]);

  const [menus] = useState([
    { name: "Trang chủ", path: ROUTERS.USER.HOME },
    {
      name: "Sản phẩm",
      path: "",
      isShowSubmenu: false,
      child: [], // <-- sẽ render động
    },
    { name: "Sản phẩm mới", path: "" },
    { name: "Tin tức", path: "" },
    { name: "Liên hệ", path: "" },
  ]);

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const isHomePage = location.pathname.length <= 1;
    setIsHome(isHomePage);
    setShowCategories(isHomePage);
  }, [location]);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setCartCount(totalQuantity);
      setCartTotal(totalPrice);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // ✅ Gọi API lấy danh sách loại sản phẩm
  useEffect(() => {
    const fetchLoaiSanPham = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/loaisanpham");
        setLoaiSanPham(res.data);
      } catch (err) {
        console.error("Lỗi tải loại sản phẩm: ", err);
      }
    };
    fetchLoaiSanPham();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim() !== "") {
      navigate(`/san-pham?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <>
      <div className="header__top">
        <div className="container">
          <div className="row">
            <div className="col-6 header__top_left">
              <ul>
                <li>
                  <AiOutlineMail />
                  vanphan44330003@gmail.com
                </li>
                <li>Miễn phí ship đơn từ {format(300000)}</li>
              </ul>
            </div>
            <div className="col-6 header__top_right">
              <ul>
                <li>
                  <Link to={""}>
                    <AiOutlineFacebook />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <AiOutlineInstagram />
                  </Link>
                </li>
                <li onClick={() => navigate(ROUTERS.ADMIN.LOGIN)}>
                    <span>Đăng nhập</span>                 
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header__logo">
              <h1>ZAN SPORT</h1>
            </div>
          </div>

          <div className="col-lg-6">
            <nav className="header__menu">
              <ul>
                {menus.map((menu, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                    <Link to={menu.path}>{menu.name}</Link>
                    {menu.name === "Sản phẩm" && loaiSanPham.length > 0 && (
                      <ul className="header__menu__dropdown">
                        {loaiSanPham.map((loai) => (
                          <li key={loai.maloai}>
                            <Link to={`/san-pham/loai/${loai.maloai}`}>
                              {loai.tenloai}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-lg-3">
            <div className="header__cart">
              <div className="header__cart__price">
                <span>{format(cartTotal)}</span>
              </div>
              <ul>
                <li>
                  <Link to={ROUTERS.USER.SHOPPING_CART}>
                    <AiOutlineShoppingCart />
                    <span>{cartCount}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row hero__categories_container">
          <div className="col-lg-3 hero__categories">
            <div
              className="hero__categories__all"
              onClick={() => setShowCategories(!isShowCategories)}
            >
              <AiOutlineMenu />
              Danh sách sản phẩm
            </div>
            <ul className={isShowCategories ? "" : "hidden"}>
              {categories.map((cat, key) => (
                <li key={key}>
                  <Link to={`/san-pham/danh-muc/${cat.madm}`}>{cat.tendm}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-9 hero__search_container">
            <div className="hero__search">
              <div className="hero__search__form">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Bạn đang tìm gì"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <button type="submit">Tìm kiếm</button>
                </form>
              </div>
              <div className="hero__search__phone">
                <div className="hero__search__form__icon">
                  <AiOutlinePhone />
                </div>
                <div className="hero__search__form__text">
                  <p>0868.254.679</p>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
            {isHome && <div className="hero__item"></div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Header);
