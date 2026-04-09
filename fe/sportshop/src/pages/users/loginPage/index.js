import axios from "axios";
import { memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTERS } from "utils/router";
import "./style.scss";

const UserLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        alert("Vui lòng nhập email và mật khẩu!");
        setIsLoading(false);
        return;
      }

      const res = await axios.post("http://127.0.0.1:3001/api/user/login", {
        email,
        password,
      });

      alert("Đăng nhập thành công!");
      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("storage"));
      navigate(ROUTERS.USER.HOME);
    } catch (err) {
      if (err.response?.status === 401) {
        alert(err.response.data.error || "Email hoặc mật khẩu không đúng!");
      } else {
        alert("Lỗi hệ thống khi đăng nhập!");
        console.error("Lỗi đăng nhập:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">ĐĂNG NHẬP</h2>
          <p className="login-subtitle">Chào mừng trở lại! Vui lòng nhập thông tin của bạn</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
            </button>
          </form>
          <p className="login-footer">
            Chưa có tài khoản? <Link to={ROUTERS.USER.SIGNUP}>Đăng ký tại đây</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(UserLoginPage);
