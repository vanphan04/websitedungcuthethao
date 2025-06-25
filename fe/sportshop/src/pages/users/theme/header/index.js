import { memo, useEffect, useState } from "react";
import "./style.scss";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlinePhone,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { format } from "utils/format";
import { ROUTERS } from "utils/router";

export const categories = ["Giày", "Quần áo", "Vợt", "Ba lô", "Phụ kiện"];

const Header = () => {
  const location = useLocation();
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const [cartTotal, setCartTotal] = useState(0);


  const [menus] = useState([
    { name: "Trang chủ", path: ROUTERS.USER.HOME },
    {
      name: "Sản phẩm",
      path: "",
      isShowSubmenu: false,
      child: [
        { name: "Cầu lông", path: "" },
        { name: "Bóng đá", path: "" },
        { name: "Bóng chuyền", path: "" },
      ],
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
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  setCartCount(totalQuantity);
  setCartTotal(totalPrice);
};


    updateCartCount(); // ban đầu

    // Nghe sự kiện giả lập từ Quantity
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

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
                <li>
                  <Link to={""}>
                    <AiOutlineUser />
                  </Link>
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
                {menus?.map((menu, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                    <Link to={menu?.path}>{menu?.name}</Link>
                    {menu.child && (
                      <ul className="header__menu__dropdown">
                        {menu.child.map((childItem, childKey) => (
                          <li key={`${menuKey}-${childKey}`}>
                            <Link to={childItem.path}>{childItem.name}</Link>
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
              {categories.map((category, key) => (
                <li key={key}>
                  <Link to={ROUTERS.USER.PRODUCTS}>{category}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-9 hero__search_container">
            <div className="hero__search">
              <div className="hero__search__form">
                <form>
                  <input type="text" placeholder="Bạn đang tìm gì" />
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
