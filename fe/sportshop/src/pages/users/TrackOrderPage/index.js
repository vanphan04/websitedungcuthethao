import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const TrackOrderPage = () => {
  const [sdt, setSdt] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSearch = async (e) => {
  e.preventDefault();
  if (!sdt.trim()) {
    setError("Vui lòng nhập số điện thoại");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:3001/api/hoadon/sdt/${sdt}`);

    // Sắp xếp từ mới đến cũ theo ngày xuất
    const sortedOrders = res.data.sort((a, b) => new Date(b.ngayxuat) - new Date(a.ngayxuat));

    setOrders(sortedOrders);
    setError("");
  } catch (err) {
    setOrders([]);
    setError("Không tìm thấy đơn hàng với số điện thoại này");
  }
};



  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="track-order-page">
      <h2>Tra cứu đơn hàng</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={sdt}
          onChange={(e) => setSdt(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
      </form>
      {error && <p className="error">{error}</p>}

      {orders.length > 0 && (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày xuất</th>
                <th>Tổng tiền</th>
                <th>PTTT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.mahd}>
                  <td>{order.mahd}</td>
                  <td>{formatDate(order.ngayxuat)}</td>
                  <td>{formatCurrency(order.tongtien)}</td>
                  <td>{order.pttt}</td>
                  <td><button onClick={() => navigate(`/tra-cuu-don-hang/${order.mahd}`)}>
  Xem chi tiết
</button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
