import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";

const EditProductPage = () => {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const masp = queryParams.get("id");

  const [product, setProduct] = useState(
    state?.product || {
      tensp: "",
      hinhanh: "",
      gia: "",
      mota: "",
      maloai: "",
      madm: "",
    }
  );

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Load sản phẩm nếu không có từ state
  useEffect(() => {
    if (masp && !state?.product) {
      axios
        .get(`http://localhost:3001/api/sanpham/${masp}`)
        .then((res) => setProduct(res.data))
        .catch((err) => console.error("Lỗi khi tải sản phẩm:", err));
    }
  }, [masp, state]);

  // Load danh mục và loại sản phẩm
  useEffect(() => {
    axios.get("http://localhost:3001/api/danhmuc")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi tải danh mục:", err));

    axios.get("http://localhost:3001/api/loaisanpham")
      .then((res) => setTypes(res.data))
      .catch((err) => console.error("Lỗi khi tải loại sản phẩm:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async () => {
    const { tensp, hinhanh, gia, mota, maloai, madm } = product;

    if (!tensp || !hinhanh || !gia || !mota || !maloai || !madm) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (parseInt(gia) <= 0) {
      alert("Giá sản phẩm phải lớn hơn 0.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/sanpham/${masp}`, {
        tensp: tensp.trim(),
        hinhanh,
        gia: parseInt(gia),
        mota,
        maloai: parseInt(maloai),
        madm: parseInt(madm),
      });

      alert("Cập nhật sản phẩm thành công!");
      navigate("/quan-tri/san-pham");
    } catch (error) {
      const { response } = error;

      if (!response) {
        alert("Không thể kết nối đến máy chủ.");
        return;
      }

      const { status, data } = response;

      if (status === 400 && data.error === "Giá không hợp lệ") {
        alert("Giá không hợp lệ. Vui lòng nhập giá lớn hơn 0.");
      } else if (status === 409 && data.error === "Tên sản phẩm đã tồn tại") {
        alert("Tên sản phẩm đã tồn tại. Vui lòng nhập tên khác.");
      } else if (status === 404) {
        alert("Sản phẩm không tồn tại.");
      } else {
        alert("Lỗi: " + data.error || "Cập nhật thất bại.");
      }
    }
  };

  return (
    <div className="add-product-page container">
      <h2>Sửa sản phẩm</h2>
      <div className="add-product-form">
        <input
          type="text"
          name="tensp"
          placeholder="Tên sản phẩm"
          value={product.tensp}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="hinhanh"
          placeholder="Link hình ảnh"
          value={product.hinhanh}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="gia"
          placeholder="Giá sản phẩm"
          value={product.gia}
          onChange={handleChange}
          required
        />
        <textarea
          name="mota"
          placeholder="Mô tả sản phẩm"
          value={product.mota}
          onChange={handleChange}
          rows="4"
        />
        <div className="option">
          <select name="maloai" value={product.maloai} onChange={handleChange} required>
            <option value="">-- Chọn loại sản phẩm --</option>
            {types.map((loai) => (
              <option key={loai.maloai} value={loai.maloai}>
                {loai.tenloai}
              </option>
            ))}
          </select>
          <select name="madm" value={product.madm} onChange={handleChange} required>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((dm) => (
              <option key={dm.madm} value={dm.madm}>
                {dm.tendm}
              </option>
            ))}
          </select>
        </div>
        <div className="form-buttons">
          <button onClick={handleSubmit}>Lưu thay đổi</button>
          <button onClick={() => navigate("/quan-tri/san-pham")} style={{ marginLeft: 10 }}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
