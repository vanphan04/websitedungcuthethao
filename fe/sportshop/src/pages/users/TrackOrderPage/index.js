import { memo, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "utils/format";
import { ROUTERS } from "utils/router";
import "./style.scss";

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Lỗi đọc user:", err);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.sdt) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:3001/api/hoadon/sdt/${encodeURIComponent(user.sdt)}`,
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.sdt]);

  if (!user) {
    return (
      <div className="track-order-page">
        <div className="container">
          <div className="track-order-empty">
            <h2>Bạn cần đăng nhập để xem đơn hàng của mình</h2>
            <button onClick={() => navigate(ROUTERS.USER.LOGIN)}>
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="track-order-page">
      <div className="container">
        <div className="track-order-header">
          <h2>Đơn hàng của {user.tenkh || user.name || "bạn"}</h2>
          <p>Số điện thoại: {user.sdt || "Chưa có"}</p>
        </div>

        {loading ? (
          <div className="track-order-loading">Đang tải đơn hàng...</div>
        ) : error ? (
          <div className="track-order-error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="track-order-empty">
            Hiện tại bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="track-order-table-wrap">
            <table className="track-order-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.mahd}>
                    <td>{order.mahd}</td>
                    <td>
                      {new Date(order.ngayxuat).toLocaleDateString("vi-VN")}
                    </td>
                    <td>{order.trangthai}</td>
                    <td>{format(order.tongtien)}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            ROUTERS.USER.ORDER_DETAIL.replace(
                              ":id",
                              order.mahd,
                            ),
                          )
                        }
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TrackOrderPage);
