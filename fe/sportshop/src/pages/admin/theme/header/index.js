import { memo } from "react";
import { AiOutlineLogout, AiOutlineShoppingCart } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Đã thêm useNavigate
import { ROUTERS } from "utils/router";
import "./style.scss";

const HeaderAd = ({ children, ...props }) => {
  const navigate = useNavigate(); // ✅ Hook phải khai báo ở đây
  const location = useLocation();

  const navItems = [
    {
      path: ROUTERS.ADMIN.ORDERS,
      onClick: () => navigate(ROUTERS.ADMIN.ORDERS),
      label: "Mua hàng",
      icon: <AiOutlineShoppingCart />,
    },
    {
      path: ROUTERS.ADMIN.LOGOUT,
      onClick: () => {},
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
