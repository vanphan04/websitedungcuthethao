import { useEffect, useState, memo } from "react";
import axios from "axios";
import "./style.scss";

const DmPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/danhmuc");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/danhmuc", {
        tendm: newCategoryName.trim(),
      });
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Tên danh mục đã tồn tại");
      } else {
        console.error("Lỗi khi thêm danh mục:", err);
        alert("Đã xảy ra lỗi khi thêm danh mục");
      }
    }
  };

  const handleDeleteCategory = async (madm) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/danhmuc/${madm}`);
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Không thể xóa danh mục vì vẫn còn sản phẩm liên quan");
      } else {
        console.error("Lỗi khi xóa danh mục:", err);
        alert("Đã xảy ra lỗi khi xóa danh mục");
      }
    }
  };

  const handleEditClick = (madm, tendm) => {
    setEditId(madm);
    setEditName(tendm);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleSaveEdit = async (madm) => {
    if (!editName.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/danhmuc/${madm}`, {
        tendm: editName.trim(),
      });

      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Tên danh mục đã tồn tại");
      } else {
        console.error("Lỗi khi cập nhật danh mục:", err);
        alert("Đã xảy ra lỗi khi cập nhật danh mục");
      }
    }
  };

  return (
    <div className="admin-container">
      
      <div className="product-category-ad-page container">
        <h2>Quản lý danh mục</h2>

        <div className="add-category-form">
          <input
            placeholder="Tên danh mục"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory}>Thêm danh mục</button>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th>Mã danh mục</th>
              <th>Tên danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(({ madm, tendm }) => (
              <tr key={madm}>
                <td>{madm}</td>
                <td>
                  {editId === madm ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    tendm
                  )}
                </td>
                <td>
                  {editId === madm ? (
                    <>
                      <button onClick={() => handleSaveEdit(madm)}>Lưu</button>
                      <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(madm, tendm)}>Sửa</button>
                      <button
                        onClick={() => handleDeleteCategory(madm)}
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

export default memo(DmPage);
