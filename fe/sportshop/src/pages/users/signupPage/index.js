import axios from "axios";
import { memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTERS } from "utils/router";
import "./style.scss";

const UserSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp!");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        setIsLoading(false);
        return;
      }

      await axios.post("http://127.0.0.1:3001/api/user/signup", {
        tenkh: formData.name,
        email: formData.email,
        sdt: formData.phone,
        password: formData.password,
      });

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate(ROUTERS.USER.LOGIN);
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.error || "Email này đã được đăng ký!");
      } else {
        alert("Lỗi hệ thống khi đăng ký!");
        console.error("Lỗi đăng ký:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">ĐĂNG KÝ TÀI KHOẢN</h2>
          <p className="signup-subtitle">Tạo tài khoản để bắt đầu mua sắm ngay hôm nay</p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Họ tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ tên của bạn"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại (tùy chọn)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                required
              />
            </div>
            <button type="submit" className="btn-signup" disabled={isLoading}>
              {isLoading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
            </button>
          </form>
          <p className="signup-footer">
            Đã có tài khoản? <Link to={ROUTERS.USER.LOGIN}>Đăng nhập tại đây</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(UserSignupPage);
