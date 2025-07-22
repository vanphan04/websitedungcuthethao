import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "utils/format";
import "./style.scss";

const OrderDetailPage = () => {
  const { id } = useParams(); // id = mahd

  const [orderInfo, setOrderInfo] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/hoadon/${id}/chitiet`);
        console.log("res.data.info:", res.data.info); // 👈 Thêm dòng này
        setOrderInfo(res.data.info);
        setProducts(res.data.items);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (!orderInfo) return <div>Đang tải đơn hàng...</div>;

  return (
    <div className="order-detail-page">
      <h2>Chi tiết đơn hàng #{orderInfo.mahd}</h2>
      <p><b>Khách hàng:</b> {orderInfo.tenkh}</p>
      <p><b>Địa chỉ:</b> {orderInfo.diachi}</p> 
      <p><b>Ngày đặt:</b> {new Date(orderInfo.ngayxuat).toLocaleDateString()}</p>
      <p><b>Trạng thái:</b> {orderInfo.trangthai}</p>
      <p><b>Phương thức thanh toán:</b> {orderInfo.pttt}</p>
      {orderInfo.ghichu && <p><b>Ghi chú:</b> {orderInfo.ghichu}</p>}

      <h3>Sản phẩm:</h3>
      <table className="order-detail-table">
        <thead>
          <tr>
            <th>TÊN SẢN PHẨM</th>
            <th>SỐ LƯỢNG</th>
            <th>ĐƠN GIÁ</th>
            <th>THÀNH TIỀN</th>
            <th>MÀU</th>
      <th>KÍCH CỠ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((sp, i) => (
            <tr key={i}>
              <td>{sp.tensp}</td>
               <td>{sp.mausac}</td>
        <td>{sp.kichco}</td>
              <td>{sp.quantity}</td>
              <td>{format(sp.price / sp.quantity)}</td>
              <td>{format(sp.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-detail-total">
        <b>Tổng tiền: {format(orderInfo.tongtien)}</b>
      </div>
    </div>
  );
};

export default OrderDetailPage;
