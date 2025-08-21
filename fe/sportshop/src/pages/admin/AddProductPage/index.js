// src/pages/admin/addProductPage/index.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROUTERS } from "utils/router";
import "./style.scss";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tensp: "",
    hinhanh: "",
    gia: "",
    mota: "",
    maloai: "",
    madm: "",
  });

  const [loais, setLoais] = useState([]);
  const [danhmucs, setDanhmucs] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [resLoai, resDanhmuc] = await Promise.all([
        axios.get("http://localhost:3001/api/loaisanpham"),
        axios.get("http://localhost:3001/api/danhmuc"),
      ]);
      setLoais(resLoai.data);
      setDanhmucs(resDanhmuc.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chọn:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
  const { tensp, hinhanh, gia, mota, maloai, madm } = form;
  if (!tensp || !hinhanh || !gia || !mota || !maloai || !madm) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  if (parseInt(gia) < 0) {
    alert("Giá sản phẩm phải lớn hơn hoặc bằng 0");
    return;
  }

  try {
    const res = await axios.post("http://localhost:3001/api/sanpham", {
      tensp,
      hinhanh,
      gia: parseInt(gia),
      mota,
      maloai: parseInt(maloai),
      madm: parseInt(madm),
    });

    if (res.data.error) {
      alert(res.data.error); // lỗi từ backend trả về
    } else {
      alert("Thêm sản phẩm thành công!");
      navigate(ROUTERS.ADMIN.PRODUCTS);
    }
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error); // hiển thị lỗi cụ thể từ backend
    } else {
      alert("Có lỗi xảy ra khi thêm sản phẩm.");
    }
  }
};


  return (
    <div className="container add-product-page">
      <h2>Thêm sản phẩm mới</h2>
      <div className="add-product-form">
        <input type="text" name="tensp" placeholder="Tên sản phẩm" value={form.tensp} onChange={handleChange} />
        <input type="text" name="hinhanh" placeholder="Link hình ảnh" value={form.hinhanh} onChange={handleChange} />
        <input type="number" name="gia" placeholder="Giá sản phẩm" value={form.gia} onChange={handleChange} />
        <input type="text" name="mota" placeholder="Mô tả sản phẩm" value={form.mota} onChange={handleChange} />
        <div className="option">
          <select name="maloai" value={form.maloai} onChange={handleChange}>
            <option value="">-- Chọn loại sản phẩm --</option>
            {loais.map((item) => (
              <option key={item.maloai} value={item.maloai}>{item.tenloai}</option>
            ))}
          </select>
          <select name="madm" value={form.madm} onChange={handleChange}>
            <option value="">-- Chọn danh mục --</option>
            {danhmucs.map((item) => (
              <option key={item.madm} value={item.madm}>{item.tendm}</option>
            ))}
          </select>
        </div>
        <div className="form-buttons">
          <button onClick={handleAdd}>Thêm sản phẩm</button>
          <button onClick={() => navigate(ROUTERS.ADMIN.PRODUCTS)} style={{ marginLeft: 10 }}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
