import { memo } from "react";
import { format } from "utils/format";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";

const CheckoutPage = () => {
  return (
    <>
      <Breadcrumb name="Thanh toán" />
      <div className="container">
        <div className="row">
          {/* Thông tin khách hàng */}
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout__input">
              <label>
                Họ và tên: <span className="required">*</span>
              </label>
              <input type="text" placeholder="Nhập họ và tên" />
            </div>
            <div className="checkout__input">
              <label>
                Địa chỉ: <span className="required">*</span>
              </label>
              <input type="text" placeholder="Nhập địa chỉ" />
            </div>
            <div className="checkout__input__group">
              <div className="checkout__input">
                <label>
                  Số điện thoại: <span className="required">*</span>
                </label>
                <input type="text" placeholder="Nhập số điện thoại" />
              </div>
              <div className="checkout__input">
                <label>
                  Email: <span className="required">*</span>
                </label>
                <input type="text" placeholder="Nhập email" />
              </div>
            </div>
            <div className="checkout__input">
              <label>Ghi chú:</label>
              <textarea rows={5} placeholder="Nhập ghi chú" />
            </div>
          </div>

          {/* Đơn hàng */}
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout__order">
              <h3>Đơn hàng</h3>
              <ul>
                <li>
                  <span>Sản phẩm 1</span>
                  <b>{format(100000)} (1)</b>
                </li>
                <li>
                  <span>Sản phẩm 2</span>
                  <b>{format(100000)} (1)</b>
                </li>
                <li>
                  <span>Sản phẩm 3</span>
                  <b>{format(100000)} (2)</b>
                </li>
                <li className="checkout__order__subtotal">
                  <h3>Tổng đơn</h3>
                  <b>{format(200000)}</b>
                </li>
              </ul>
              <button type="button" className="button-submit">Thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CheckoutPage);
