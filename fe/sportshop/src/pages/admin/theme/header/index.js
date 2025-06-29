import { memo } from "react";
import {
  AiOutlineLogout,
  AiOutlineShoppingCart,
  AiOutlineAppstore,
  AiOutlineTags,
} from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import "./style.scss";

const HeaderAd = ({ children, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: ROUTERS.ADMIN.ORDERS,
      onClick: () => navigate(ROUTERS.ADMIN.ORDERS),
      label: "Đơn hàng",
      icon: <AiOutlineShoppingCart />,
    },
    {
      path: ROUTERS.ADMIN.PRODUCTS,
      onClick: () => navigate(ROUTERS.ADMIN.PRODUCTS),
      label: "Sản phẩm",
      icon: <AiOutlineAppstore />,
    },
    {
      path: ROUTERS.ADMIN.CATEGORIES,
      onClick: () => navigate(ROUTERS.ADMIN.CATEGORIES),
      label: "Loại sản phẩm",
      icon: <AiOutlineTags />,
    },
    {
      path: ROUTERS.ADMIN.LOGOUT,
      onClick: () => {}, // TODO: thêm xử lý đăng xuất
      label: "Đăng xuất",
      icon: <AiOutlineLogout />,
    },
  ];

  return (
    <div className="admin__header container" {...props}>
      <nav className="admin__header__nav">
        {navItems.map(({ path, onClick, label, icon }) => (
          <div
            key={path}
            className={`admin__header__nav-item ${
              typeof location.pathname === "string" &&
              typeof path === "string" &&
              location.pathname.includes(path)
                ? "admin__header__nav-item--active"
                : ""
            }`}
            onClick={onClick}
          >
            <span className="admin__header__nav-icon">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default memo(HeaderAd);
