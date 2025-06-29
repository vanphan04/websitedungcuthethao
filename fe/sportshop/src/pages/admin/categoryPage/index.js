import { memo, useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";

const ProductCategoryAdPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editId, setEditId] = useState(null);        // ID loại sản phẩm đang sửa
  const [editName, setEditName] = useState("");      // Tên loại sản phẩm đang sửa

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/loaisanpham");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi tải loại sản phẩm:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Vui lòng nhập tên loại sản phẩm");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/loaisanpham", {
        tenloai: newCategoryName.trim(),
      });

      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi thêm loại sản phẩm:", err);
    }
  };

  const handleDeleteCategory = async (maloai) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa loại sản phẩm này?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/loaisanpham/${maloai}`);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi xóa loại sản phẩm:", err);
    }
  };

  // Bắt đầu chỉnh sửa một loại sản phẩm
  const handleEditClick = (maloai, tenloai) => {
    setEditId(maloai);
    setEditName(tenloai);
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  // Lưu tên loại sản phẩm đã chỉnh sửa
  const handleSaveEdit = async (maloai) => {
    if (!editName.trim()) {
      alert("Tên loại sản phẩm không được để trống");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/loaisanpham/${maloai}`, {
        tenloai: editName.trim(),
      });

      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi cập nhật loại sản phẩm:", err);
    }
  };

  return (
    <div className="product-page">
      <div className="product-category-ad-page container">
        <h2>Quản lý loại sản phẩm</h2>

        <div className="add-category-form">
          <input
            placeholder="Tên loại sản phẩm"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory}>Thêm loại sản phẩm</button>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th>Mã loại</th>
              <th>Tên loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(({ maloai, tenloai }) => (
              <tr key={maloai}>
                <td>{maloai}</td>
                <td>
                  {editId === maloai ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    tenloai
                  )}
                </td>
                <td>
                  {editId === maloai ? (
                    <>
                      <button onClick={() => handleSaveEdit(maloai)}>Lưu</button>
                      <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(maloai, tenloai)}>Sửa</button>
                      <button
                        onClick={() => handleDeleteCategory(maloai)}
                        style={{ marginLeft: 8 }}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ProductCategoryAdPage);
