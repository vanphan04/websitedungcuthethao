import { memo, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tài khoản
    if (username === "admin" && password === "admin123") {
      navigate(ROUTERS.ADMIN.ORDERS); // chuyển trang nếu đúng
    } else {
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__tittle">HỆ THỐNG QUẢN TRỊ</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form-group">
            <label htmlFor="username" className="login__label">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login__form-group">
            <label htmlFor="password" className="login__label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login__btn">ĐĂNG NHẬP</button>
        </form>
      </div>
    </div>
  );
};

export default memo(LoginPage);
