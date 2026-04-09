import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "utils/format";
import "./style.scss";

const UserOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:3001/api/hoadon/${id}/chitiet`,
        );
        setOrderInfo(res.data.info);
        setProducts(res.data.items || []);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
        setError("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  return (
    <div className="user-order-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Quay lại
        </button>

        {loading ? (
          <div className="detail-loading">Đang tải chi tiết đơn hàng...</div>
        ) : error ? (
          <div className="detail-error">{error}</div>
        ) : !orderInfo ? (
          <div className="detail-empty">Không tìm thấy đơn hàng.</div>
        ) : (
          <div className="detail-content">
            <h2>Chi tiết đơn hàng #{orderInfo.mahd}</h2>
            <div className="detail-info">
              <p>
                <b>Khách hàng:</b> {orderInfo.tenkh || "Chưa có thông tin"}
              </p>
              <p>
                <b>Địa chỉ:</b> {orderInfo.diachi || "Chưa có thông tin"}
              </p>
              <p>
                <b>Số điện thoại:</b> {orderInfo.sdt || "Chưa có thông tin"}
              </p>
              <p>
                <b>Ngày đặt:</b>{" "}
                {new Date(orderInfo.ngayxuat).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <b>Trạng thái:</b> {orderInfo.trangthai || "Chưa cập nhật"}
              </p>
              <p>
                <b>Phương thức thanh toán:</b>{" "}
                {orderInfo.pttt || "Chưa cập nhật"}
              </p>
              {orderInfo.ghichu && (
                <p>
                  <b>Ghi chú:</b> {orderInfo.ghichu}
                </p>
              )}
            </div>

            <div className="detail-products">
              <h3>Sản phẩm trong đơn</h3>
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Màu</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr key={index}>
                      <td>{item.tensp || "Chưa xác định"}</td>
                      <td>{item.mausac || "-"}</td>
                      <td>{item.quantity || 0}</td>
                      <td>{format(item.price)}</td>
                      <td>{format(item.price * (item.quantity || 1))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="detail-total">
              <strong>Tổng tiền: {format(orderInfo.tongtien)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrderDetailPage;
