import { ROUTERS } from "utils/router";
import { memo, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.scss";

const ProductAdPage = () => {
  const [products, setProducts] = useState([]);
  const [loaisp, setLoaiSP] = useState([]);
  const [mausac, setMauSac] = useState([]);
  const [danhmuc, setDanhMuc] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOptions();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/sanpham");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    }
  };

  const fetchOptions = async () => {
    try {
      const [loai, ms, dm] = await Promise.all([
        axios.get("http://localhost:3001/api/loaisanpham"),
        axios.get("http://localhost:3001/api/mausac"),
        axios.get("http://localhost:3001/api/danhmuc"),
      ]);
      setLoaiSP(loai.data);
      setMauSac(ms.data);
      setDanhMuc(dm.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu lựa chọn:", err);
    }
  };

  const handleDelete = async (masp) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

    try {
  await axios.delete(`http://localhost:3001/api/sanpham/${masp}`);
  alert("Xóa sản phẩm thành công");
  fetchProducts(); // cập nhật lại danh sách sản phẩm
} catch (error) {
  console.error("Lỗi khi xóa sản phẩm:", error);
  alert(error.response?.data?.error || "Không thể xóa sản phẩm");
}

  };

  const getTenById = (list, idKey, idValue, nameKey) => {
    const item = list.find((i) => i[idKey] === idValue);
    return item ? item[nameKey] : idValue;
  };

  return (
    <div className="product-page">
      <div className="product-ad-page container">
        <h2>Quản lý sản phẩm</h2>
        <Link to={ROUTERS.ADMIN.ADD_PRODUCT}>
          <button className="btn-add">+ Thêm sản phẩm mới</button>
        </Link>
        <table className="product-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Hình</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((sp) => (
              <tr key={sp.masp}>
                <td>{sp.masp}</td>
                <td>{sp.tensp}</td>
                <td>{sp.hinhanh}</td>
                <td>{sp.gia}</td>
                <td>{getTenById(loaisp, "maloai", sp.maloai, "tenloai")}</td>
                <td>{getTenById(danhmuc, "madm", sp.madm, "tendm")}</td>
                <td>
                  <Link
                    to={{
                      pathname: ROUTERS.ADMIN.EDIT_PRODUCT,
                      search: `?id=${sp.masp}`,
                    }}
                    state={{ product: sp }}
                  >
                    <button>Sửa</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(sp.masp)}
                    style={{ marginLeft: 8 }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ProductAdPage);