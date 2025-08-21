import Quantity from "component/Quantity";
import { memo, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { format } from "utils/format";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import { ROUTERS } from "utils/router";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // ✅ Xóa sản phẩm theo id + mamau
const handleRemoveItem = (id, color) => {
  const newCart = cartItems.filter((item) => !(item.id === id && item.color === color));
  setCartItems(newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
};

const handleQuantityChange = (id, color, newQty) => {
  const updated = cartItems.map((item) =>
    item.id === id && item.color === color ? { ...item, quantity: newQty } : item
  );
  setCartItems(updated);
  localStorage.setItem("cart", JSON.stringify(updated));
};


  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Breadcrumb name="Giỏ hàng" />
      <div className="container">
        <div className="table__cart">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Màu</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th />
              </tr>
            </thead>
            <tbody>
  {cartItems.map((item) => (
    <tr key={`${item.id}-${item.color}`}>
      
      <td className="shopping__cart__item">
    
        <h4>{item.name}<td></td></h4>
      </td>
      <td>{item.colorName || "Chưa chọn màu"}</td>
      <td>{format(item.price)}</td>
      <td>
        <Quantity
          quantity={item.quantity}
          hasAddToCart={false}
          productId={item.id}
          color={item.color}
          onQuantityChange={(newQty) =>
            handleQuantityChange(item.id, item.color, newQty)
          }
        />
      </td>
      <td>{format(item.price * item.quantity)}</td>
      <td
        className="icon_close"
        onClick={() => handleRemoveItem(item.id, item.color)}
      >
        <AiOutlineClose />
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="shopping__checkout">
              <h2>Tổng đơn:</h2>
              <ul>
                <li>Số lượng: <span>{totalQuantity}</span></li>
                <li>Thành tiền: <span>{format(totalPrice)}</span></li>
              </ul>
              <button type="button" className="button-submit" onClick={() => navigate(ROUTERS.USER.CHECKOUT)}>Thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ShoppingCartPage);
