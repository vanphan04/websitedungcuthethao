import { memo } from "react";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss"
import { format } from "utils/format";
import { Quantity } from "component";
import { AiOutlineClose } from "react-icons/ai";
import ProductList from "component/ProductList";

const ShoppingCartPage = () => {
  return (
    <>
      <Breadcrumb name="Giỏ hàng" />
      <div className="container">
        <div className="table__cart">
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="shopping__cart__item">
                            <img src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRolQmKno63XWPxeqrm0SCJmtZMnEq1nPcessOaEaAcDyiKBQRajnjRTNRqxWxO3jlpz2pGuSe6AzGykqnhftKFAFht3Wn1lY_wW4w8SuxQaZsAguiULAHN9g" alt="product-pic"/>
                            <h4>Tên sản phẩm 1</h4>
                        </td>
                        <td>{format(200000)}</td>
                        <td><Quantity quantity = "2" hasAddToCart={false}/></td>
                        <td>{format(200000)}</td>
                        <td className="icon_close">
                            <AiOutlineClose/>
                        </td>
                    </tr>
                    <tr>
                        <td className="shopping__cart__item">
                            <img src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRolQmKno63XWPxeqrm0SCJmtZMnEq1nPcessOaEaAcDyiKBQRajnjRTNRqxWxO3jlpz2pGuSe6AzGykqnhftKFAFht3Wn1lY_wW4w8SuxQaZsAguiULAHN9g" alt="product-pic"/>
                            <h4>Tên sản phẩm 1</h4>
                        </td>
                        <td>{format(200000)}</td>
                        <td><Quantity quantity = "2" hasAddToCart={false}/></td>
                        <td>{format(200000)}</td>
                        <td className="icon_close">
                            <AiOutlineClose/>
                        </td>
                    </tr>
                    <tr>
                        <td className="shopping__cart__item">
                            <img src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRolQmKno63XWPxeqrm0SCJmtZMnEq1nPcessOaEaAcDyiKBQRajnjRTNRqxWxO3jlpz2pGuSe6AzGykqnhftKFAFht3Wn1lY_wW4w8SuxQaZsAguiULAHN9g" alt="product-pic"/>
                            <h4>Tên sản phẩm 1</h4>
                        </td>
                        <td>{format(200000)}</td>
                        <td><Quantity quantity = "2" hasAddToCart={false}/></td>
                        <td>{format(200000)}</td>
                        <td className="icon_close">
                            <AiOutlineClose/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12" >
                    <div className="shopping__checkout">
                        <h2>Tổng đơn:</h2>
                        <ul>
                            <li>Số lượng: <span>{2}</span></li>
                            <li>Thành tiền: <span>{format(600000)}</span></li>
                        </ul>
                        <button type="button" className="button-submit">
                            Thanh toán
                        </button>
                    </div>
                </div>
        </div>
      </div>
    </>
  );
};
<ProductList />
export default memo(ShoppingCartPage);
