import React, { memo, useEffect, useState } from "react";
import axios from "axios";
import { format } from "utils/format";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import "./style.scss";

const OrderAdPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const statusPriority = {
    "Đang chuẩn bị": 1,
    "Đang giao": 2,
    "Đã giao": 3,
    "Đã hủy": 4,
  };

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

  const handleStatusChange = async (mahd, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/hoadon/${mahd}`, {
        trangthai: newStatus,
      });
      alert("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại");
    }
  };

  const statusOptions = ["Đang chuẩn bị", "Đang giao", "Đã giao", "Đã hủy"];

  const filteredOrders = orders
    .filter((item) => {
      const searchLower = search.toLowerCase();
      return (
        item.tenkh.toLowerCase().includes(searchLower) ||
        item.mahd.toString().includes(searchLower)
      );
    })
    .sort(
      (a, b) =>
        (statusPriority[a.trangthai] || 99) -
        (statusPriority[b.trangthai] || 99)
    );

  return (
    <div className="container">
      <div className="orders">
        <h2>Quản lý đơn hàng</h2>

        <div className="orders__search">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="orders__content">
          <table className="orders__table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Tổng tiền</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái đơn</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item) => (
                <tr key={item.mahd}>
                  <td>{item.mahd}</td>
                  <td>{format(item.tongtien)}</td>
                  <td>{item.tenkh}</td>
                  <td>{new Date(item.ngayxuat).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={item.trangthai}
                      onChange={(e) =>
                        handleStatusChange(item.mahd, e.target.value)
                      }
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-detail"
                      onClick={() =>
                        navigate(
                          ROUTERS.ADMIN.ORDER_DETAIL.replace(":id", item.mahd)
                        )
                      }
                    >
                      ...
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không tìm thấy đơn hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderAdPage);
