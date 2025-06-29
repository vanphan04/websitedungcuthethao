import { ROUTERS } from "utils/router";

import { memo, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.scss";

const ProductAdPage = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    tensp: "",
    hinhanh: "",
    soluong: 0,
    gia: 0,
    mota: "",
    maloai: 1,
    makichco: 1,
    mamau: 1,
    madm: 1,
  });

  const [loaisp, setLoaiSP] = useState([]);
  const [kichco, setKichCo] = useState([]);
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
      const [loai, kc, ms, dm] = await Promise.all([
        axios.get("http://localhost:3001/api/loaisanpham"),
        axios.get("http://localhost:3001/api/kichco"),
        axios.get("http://localhost:3001/api/mausac"),
        axios.get("http://localhost:3001/api/danhmuc"),
      ]);
      setLoaiSP(loai.data);
      setKichCo(kc.data);
      setMauSac(ms.data);
      setDanhMuc(dm.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu lựa chọn:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (masp) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/sanpham/${masp}`);
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const handleEditClick = (product) => {
    setEditId(product.masp);
    setEditForm(product);
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleSaveEdit = async (masp) => {
    try {
      await axios.put(`http://localhost:3001/api/sanpham/${masp}`, {
        ...editForm,
        soluong: Number(editForm.soluong),
        gia: Number(editForm.gia),
      });

      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
    }
  };

  const getTenById = (list, id, field = "ten") => {
    const item = list.find((i) => i[Object.keys(i)[0]] === id);
    return item ? Object.values(item).find((v) => typeof v === "string") : id;
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
              <th>SL</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Loại</th>
              <th>Kích cỡ</th>
              <th>Màu</th>
              <th>Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((sp) => (
              <tr key={sp.masp}>
                <td>{sp.masp}</td>
                {editId === sp.masp ? (
                  <>
                    <td><input type="text" name="tensp" value={editForm.tensp} onChange={handleChange} /></td>
                    <td><input type="text" name="hinhanh" value={editForm.hinhanh} onChange={handleChange} /></td>
                    <td><input type="number" name="soluong" value={editForm.soluong} onChange={handleChange} /></td>
                    <td><input type="number" name="gia" value={editForm.gia} onChange={handleChange} /></td>
                    <td><input type="text" name="mota" value={editForm.mota} onChange={handleChange} /></td>
                    <td>
                      <select name="maloai" value={editForm.maloai} onChange={handleChange}>
                        {loaisp.map((l) => <option key={l.maloai} value={l.maloai}>{l.tenloai}</option>)}
                      </select>
                    </td>
                    <td>
                      <select name="makichco" value={editForm.makichco} onChange={handleChange}>
                        {kichco.map((k) => <option key={k.makichco} value={k.makichco}>{k.tenkichco}</option>)}
                      </select>
                    </td>
                    <td>
                      <select name="mamau" value={editForm.mamau} onChange={handleChange}>
                        {mausac.map((m) => <option key={m.mamau} value={m.mamau}>{m.tenmau}</option>)}
                      </select>
                    </td>
                    <td>
                      <select name="madm" value={editForm.madm} onChange={handleChange}>
                        {danhmuc.map((d) => <option key={d.madm} value={d.madm}>{d.tendm}</option>)}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleSaveEdit(sp.masp)}>Lưu</button>
                      <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>Hủy</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{sp.tensp}</td>
                    <td>{sp.hinhanh}</td>
                    <td>{sp.soluong}</td>
                    <td>{sp.gia}</td>
                    <td>{sp.mota}</td>
                    <td>{getTenById(loaisp, sp.maloai)}</td>
                    <td>{getTenById(kichco, sp.makichco)}</td>
                    <td>{getTenById(mausac, sp.mamau)}</td>
                    <td>{getTenById(danhmuc, sp.madm)}</td>
                    <td>
                      <button onClick={() => handleEditClick(sp)}>Sửa</button>
                      <button onClick={() => handleDelete(sp.masp)} style={{ marginLeft: 8 }}>Xóa</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ProductAdPage);
