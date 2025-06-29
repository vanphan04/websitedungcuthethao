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
    soluong: "",
    gia: "",
    mota: "",
    maloai: "",
    makichco: "",
    mamau: "",
    madm: "",
  });

  const [loais, setLoais] = useState([]);
  const [kichcos, setKichcos] = useState([]);
  const [mausacs, setMausacs] = useState([]);
  const [danhmucs, setDanhmucs] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [resLoai, resKichco, resMau, resDanhmuc] = await Promise.all([
        axios.get("http://localhost:3001/api/loaisanpham"),
        axios.get("http://localhost:3001/api/kichco"),
        axios.get("http://localhost:3001/api/mausac"),
        axios.get("http://localhost:3001/api/danhmuc"),
      ]);
      setLoais(resLoai.data);
      setKichcos(resKichco.data);
      setMausacs(resMau.data);
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
    const { tensp, hinhanh, soluong, gia, mota, maloai, makichco, mamau, madm } = form;
    if (!tensp || !hinhanh || !soluong || !gia || !mota || !maloai || !makichco || !mamau || !madm) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/sanpham", {
        tensp,
        hinhanh,
        soluong: parseInt(soluong),
        gia: parseInt(gia),
        mota,
        maloai: parseInt(maloai),
        makichco: parseInt(makichco),
        mamau: parseInt(mamau),
        madm: parseInt(madm),
      });
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm.");
    }
  };

  return (
    <div className="container add-product-page">
      <h2>Thêm sản phẩm mới</h2>
      <div className="add-product-form">
        <input type="text" name="tensp" placeholder="Tên sản phẩm" value={form.tensp} onChange={handleChange} />
        <input type="text" name="hinhanh" placeholder="Link hình ảnh" value={form.hinhanh} onChange={handleChange} />
        <input type="number" name="soluong" placeholder="Số lượng" value={form.soluong} onChange={handleChange} />
        <input type="number" name="gia" placeholder="Giá sản phẩm" value={form.gia} onChange={handleChange} />
        <input type="text" name="mota" placeholder="Mô tả sản phẩm" value={form.mota} onChange={handleChange} />
        <div className="option">
        <select name="maloai" value={form.maloai} onChange={handleChange}>
          <option value="">-- Chọn loại sản phẩm --</option>
          {loais.map((item) => (
            <option key={item.maloai} value={item.maloai}>{item.tenloai}</option>
          ))}
        </select>

        <select name="makichco" value={form.makichco} onChange={handleChange}>
          <option value="">-- Chọn kích cỡ --</option>
          {kichcos.map((item) => (
            <option key={item.makichco} value={item.makichco}>{item.tenkichco}</option>
          ))}
        </select>

        <select name="mamau" value={form.mamau} onChange={handleChange}>
          <option value="">-- Chọn màu sắc --</option>
          {mausacs.map((item) => (
            <option key={item.mamau} value={item.mamau}>{item.tenmau}</option>
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
