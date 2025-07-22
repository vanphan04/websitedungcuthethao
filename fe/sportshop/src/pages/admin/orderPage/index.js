import React, { memo, useEffect, useState } from "react";
import axios from "axios";
import { format } from "utils/format";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import "./style.scss";

const OrderAdPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/hoadon");
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/hoadon/${id}`, {
        trangthai: newStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  const statusOptions = ["Đang chuẩn bị", "Đang giao", "Đã giao", "Đã hủy"];

  return (
    <div className="container">
      <div className="orders">
        <h2>Quản lý đơn hàng</h2>

        <div className="orders__content">
          <table className="orders__table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Tổng tiền</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái đơn</th>
                <th>Thanh toán</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item.mahd}>
                  <td>{item.mahd}</td>
                  <td>{format(item.tongtien)}</td>
                  <td>{item.tenkh}</td>
                  <td>{new Date(item.ngayxuat).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={item.trangthai}
                      onChange={(e) => handleStatusChange(item.mahd, e.target.value)}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span
                      className={
                        item.trangthai_thanhtoan === "Đã thanh toán"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {item.trangthai_thanhtoan}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-detail"
                      onClick={() =>
                        navigate(ROUTERS.ADMIN.ORDER_DETAIL.replace(":id", item.mahd))
                      }
                    >
                      ...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderAdPage);
