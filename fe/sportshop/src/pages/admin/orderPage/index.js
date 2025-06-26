import { memo } from "react";
import "./style.scss";
import { format } from "utils/format";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const OrderAdPage = () => {
  const orders = [
    {
      id: 1,
      total: 200000,
      customerName: "Van",
      date: "10/10/2025",
      status: "Đang chuẩn bị",
    },
    {
      id: 1,
      total: 200000,
      customerName: "Van",
      date: "10/10/2025",
      status: "Đang chuẩn bị",
    },
  ];

  return (
    <div className="container">
      <div className="orders">
        <h2>Quản lý đơn hàng</h2>

        <div className="orders__content">
          <table className="orders__table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Tổng tiền</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
              </tr>

            </thead>
              <tbody>
                {orders.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <span>{item.id}</span>
                    </td>
                    <td>{format(item.total)}</td>
                    <td>{item.customerName}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>

        <div className="orders__footer">
          <div className="orders__pagination">
            <div className="orders__page-number">
                <button className="orders__page-btn"><AiOutlineLeft /></button>
                <button className="orders__page-btn orders__page-btn--active">1</button>
                <button className="orders__page-btn">2</button>
                <button className="orders__page-btn">3</button>
                <button className="orders__page-btn">4</button>
                <button className="orders__page-btn">5</button>
                
                <button className="orders__page-btn"><AiOutlineRight /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderAdPage);
