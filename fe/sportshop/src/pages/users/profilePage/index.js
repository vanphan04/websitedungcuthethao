import { memo, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "utils/format";
import { ROUTERS } from "utils/router";
import "./style.scss";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    tenkh: "",
    email: "",
    diachi: ""
  });
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditForm({
          tenkh: parsedUser.tenkh || parsedUser.name || "",
          email: parsedUser.email || "",
          diachi: parsedUser.diachi || ""
        });
      } catch (error) {
        console.error("Không đọc được thông tin người dùng:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.sdt) return;
      setLoadingOrders(true);
      try {
        const res = await axios.get(
          `http://localhost:3001/api/hoadon/sdt/${encodeURIComponent(user.sdt)}`,
        );
        setOrders(res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng của người dùng:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user?.sdt]);

  const handleUpdateProfile = async () => {
    if (!user?.sdt) return;

    setUpdating(true);
    try {
      await axios.put(
        `http://localhost:3001/api/khachhang/update/${encodeURIComponent(user.sdt)}`,
        editForm
      );

      // Cập nhật localStorage và state
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      tenkh: user.tenkh || user.name || "",
      email: user.email || "",
      diachi: user.diachi || ""
    });
    setIsEditing(false);
  };

  const orderSummary = useMemo(() => {
    return {
      count: orders.length,
      total: orders.reduce((sum, order) => sum + (order.tongtien || 0), 0),
    };
  }, [orders]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-page__empty">
            <h2>Vui lòng đăng nhập để xem hồ sơ</h2>
            <button onClick={() => navigate(ROUTERS.USER.LOGIN)}>
              Đến trang đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-page__heading">
          <div>
            <p className="profile-page__eyebrow">Hồ sơ khách hàng</p>
            <h1>Chào {user.tenkh || user.name || "bạn"}</h1>
          </div>
          <button
            className="profile-page__action"
            onClick={() => navigate(ROUTERS.USER.TRACK_ORDER)}
          >
            Xem toàn bộ đơn hàng
          </button>
        </div>

        <div className="profile-page__content">
          <aside className="profile-card">
            <div className="profile-card__header">
              <div className="profile-card__avatar">
                {(user.tenkh || user.name || "?").charAt(0)}
              </div>
              <div>
                <p className="profile-card__label">Tài khoản</p>
                <h2>{user.tenkh || user.name || "Khách hàng"}</h2>
                <p>{user.email || "Chưa có email"}</p>
              </div>
            </div>

            <div className="profile-card__stats">
              <div className="profile-card__stat">
                <span>{orderSummary.count}</span>
                <p>Đơn hàng</p>
              </div>
              <div className="profile-card__stat">
                <span>{format(orderSummary.total)}</span>
                <p>Tổng chi tiêu</p>
              </div>
            </div>

            <div className="profile-card__details">
              {isEditing ? (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label>Họ tên *</label>
                    <input
                      type="text"
                      value={editForm.tenkh}
                      onChange={(e) => setEditForm({...editForm, tenkh: e.target.value})}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      placeholder="Nhập email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      value={editForm.diachi}
                      onChange={(e) => setEditForm({...editForm, diachi: e.target.value})}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn-cancel"
                      onClick={handleCancelEdit}
                      disabled={updating}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn-save"
                      onClick={handleUpdateProfile}
                      disabled={updating || !editForm.tenkh.trim() || !editForm.email.trim()}
                    >
                      {updating ? "Đang cập nhật..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p>Họ tên</p>
                    <strong>{user.tenkh || user.name || "Chưa có"}</strong>
                  </div>
                  <div>
                    <p>Email</p>
                    <strong>{user.email || "Chưa có"}</strong>
                  </div>
                  <div>
                    <p>Số điện thoại</p>
                    <strong>{user.sdt || "Chưa có"}</strong>
                  </div>
                  {user.diachi && (
                    <div>
                      <p>Địa chỉ</p>
                      <strong>{user.diachi}</strong>
                    </div>
                  )}
                  <div className="profile-actions">
                    <button
                      className="btn-edit"
                      onClick={() => setIsEditing(true)}
                    >
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>

          <section className="profile-orders">
            <div className="profile-orders__header">
              <div>
                <h2>Đơn hàng gần nhất</h2>
                <p>Hiển thị tối đa 5 đơn hàng mới nhất.</p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="profile-orders__loading">
                Đang tải đơn hàng...
              </div>
            ) : orders.length === 0 ? (
              <div className="profile-orders__empty">Chưa có đơn hàng nào.</div>
            ) : (
              <table className="profile-orders__table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.mahd}>
                      <td>{order.mahd}</td>
                      <td>
                        {new Date(order.ngayxuat).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <span
                          className={`order-status order-status--${order.trangthai
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.trangthai}
                        </span>
                      </td>
                      <td>{format(order.tongtien)}</td>
                      <td>
                        <button
                          type="button"
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfilePage);
