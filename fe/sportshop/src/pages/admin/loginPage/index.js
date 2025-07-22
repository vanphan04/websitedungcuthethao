import axios from "axios";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import "./style.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/api/admin/login", {
  username,
  password
});


      alert("Đăng nhập thành công!");
      // TODO: có thể lưu thông tin vào localStorage nếu cần
      navigate(ROUTERS.ADMIN.ORDERS);
    } catch (err) {
      if (err.response?.status === 401) {
        alert(err.response.data.error || "Tên đăng nhập hoặc mật khẩu không đúng!");
      } else {
        alert("Lỗi hệ thống khi đăng nhập!");
        console.error("Lỗi đăng nhập:", err);
      }
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
