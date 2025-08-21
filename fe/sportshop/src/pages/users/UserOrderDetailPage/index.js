import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "utils/format";
import "./style.scss";

const OrderDetailPage = () => {
  const { id } = useParams(); // id = mahd

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
          `http://localhost:3001/api/hoadon/${id}/chitiet`
        );
        console.log("res.data:", res.data);
        if (res.data.info) {
          setOrderInfo(res.data.info);
        } else {
          throw new Error("Không tìm thấy thông tin hóa đơn");
        }
        setProducts(res.data.items || []);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
        setError(
          err.response?.data?.error || "Không thể tải chi tiết đơn hàng"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  if (!orderInfo) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="order-detail-page">
      <h2 style={{color :'red'}}>Chi tiết đơn hàng #{orderInfo.mahd}</h2>
      <p>
        <b>Khách hàng:</b> {orderInfo.tenkh || "Chưa có thông tin"}
      </p>
      <p>
        <b>Ngày đặt:</b>{" "}
        {new Date(orderInfo.ngayxuat).toLocaleDateString("vi-VN")}
      </p>
      <p>
        <b>Trạng thái:</b> {orderInfo.trangthai || "Chưa cập nhật"}
      </p>
      <p>
        <b>Phương thức thanh toán:</b> {orderInfo.pttt || "Chưa cập nhật"}
      </p>
      {orderInfo.ghichu && (
        <p>
          <b>Ghi chú:</b> {orderInfo.ghichu}
        </p>
      )}

      <h3>Sản phẩm:</h3>
      <table className="order-detail-table">
        <thead>
          <tr>
            <th>TÊN SẢN PHẨM</th>
            <th>MÀU</th>
            <th>SỐ LƯỢNG</th>
            <th>ĐƠN GIÁ</th>
            <th>THÀNH TIỀN</th>
          </tr>
        </thead>
        <tbody>
          {products.map((sp, i) => (
            <tr key={i}>
              <td>{sp.tensp || "Chưa xác định"}</td>
              <td>{sp.mausac || "Chưa có"}</td>
              <td>{sp.quantity || 0}</td>
                            <td>{format(sp.price) || "0"}</td>
              <td>{format(sp.price * (sp.quantity || 1)) || "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-detail-total">
        <b>Tổng tiền: {format(orderInfo.tongtien) || "0"}</b>
      </div>
    </div>
  );
};

export default OrderDetailPage;
