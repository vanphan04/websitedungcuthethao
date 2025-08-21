import { memo, useEffect, useState } from "react";
import axios from "axios";
import { format } from "utils/format";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import { ClipLoader } from "react-spinners";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    tenkh: "",
    sdt: "",
    email: "",
    diachi: "",
    ghichu: "",
  });
  const [pttt, setPttt] = useState("Tiền mặt");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = total < 300000 ? 30000 : 0;
  const totalAmount = total + shippingFee;

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setPttt(e.target.value);
  };

  const validate = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống, không thể thanh toán!");
      return false;
    }

    if (!form.tenkh || !form.sdt || !form.email || !form.diachi) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }

    const phoneRegex = /^(0[0-9]{9})$/;
    if (!phoneRegex.test(form.sdt)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số và bắt đầu bằng 0.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      return false;
    }

    for (const item of cart) {
      if (!item.color) {
        alert(`Thiếu mã màu cho sản phẩm "${item.name}"`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    try {
      const cartForBackend = cart.map((item) => ({
        masp: item.id,
        mamau: item.color,
        soluong: item.quantity,
        gia: item.price,
      }));

      const apiUrl =
        pttt === "MoMo"
          ? "http://localhost:3001/api/momo/checkout"
          : "http://localhost:3001/api/checkout";

      const res = await axios.post(apiUrl, {
        ...form,
        cart: cartForBackend,
        pttt,
        tongtien: totalAmount,
      });

      if (pttt === "MoMo" && res.data.payUrl) {
        window.location.href = res.data.payUrl;
      } else {
        alert("Đặt hàng thành công!");
        localStorage.removeItem("cart");
        window.location.href = "/";
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi đặt hàng!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb name="Thanh toán" />
      <div className="container">
        <div className="row">
          {/* Thông tin khách hàng */}
          <div className="col-lg-6">
            <div className="checkout__input">
              <label>Họ và tên:</label>
              <input name="tenkh" value={form.tenkh} onChange={handleInput} />
            </div>
            <div className="checkout__input">
              <label>Địa chỉ:</label>
              <input name="diachi" value={form.diachi} onChange={handleInput} />
            </div>
            <div className="checkout__input__group">
              <div className="checkout__input">
                <label>Số điện thoại:</label>
                <input name="sdt" value={form.sdt} onChange={handleInput} />
              </div>
              <div className="checkout__input">
                <label>Email:</label>
                <input name="email" value={form.email} onChange={handleInput} />
              </div>
            </div>
            <div className="checkout__input">
              <label>Phương thức thanh toán:</label>
              <div className="checkout-pttt">
                <label>
                  <input
                    type="radio"
                    name="pttt"
                    value="Tiền mặt"
                    checked={pttt === "Tiền mặt"}
                    onChange={handleChange}
                  />
                  Tiền mặt
                </label>
                <label>
                  <input
                    type="radio"
                    name="pttt"
                    value="MoMo"
                    checked={pttt === "MoMo"}
                    onChange={handleChange}
                  />
                  MoMo
                </label>
              </div>
            </div>
            <div className="checkout__input">
              <label>Ghi chú:</label>
              <textarea
                name="ghichu"
                value={form.ghichu}
                onChange={handleInput}
                placeholder="Nhập ghi chú"
                rows={5}
              />
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="col-lg-6">
            <div className="checkout__order">
              <h3>Đơn hàng</h3>
              <ul>
                {cart.map((item) => (
                  <li key={`${item.id}-${item.color}`}>
                    <span>
                      {item.name} – Màu: <b>{item.colorName}</b>
                    </span>
                    <b>{format(item.price)} ({item.quantity})</b>
                  </li>
                ))}
                <li className="checkout__order__subtotal">
                  <span>Tạm tính</span>
                  <b>{format(total)}</b>
                </li>
                <li>
                  <span>Phí vận chuyển</span>
                  <b>{format(shippingFee)}</b>
                </li>
                <li className="checkout__order__subtotal">
                  <h3>Tổng đơn</h3>
                  <b>{format(totalAmount)}</b>
                </li>
              </ul>
              <button
                type="button"
                className="button-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <ClipLoader color="#fff" size={20} /> : "Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CheckoutPage);
