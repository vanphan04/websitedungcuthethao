import { useEffect, useState, memo } from "react";
import axios from "axios";
import "../dmPage/style.scss";
import HeaderAd from "../theme/header";

const ColorPage = () => {
  const [colors, setColors] = useState([]);
  const [newColorName, setNewColorName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/mausac");
      setColors(res.data);
    } catch (err) {
      console.error("Lỗi khi tải màu sắc:", err);
    }
  };

  const handleAddColor = async () => {
    if (!newColorName.trim()) {
      alert("Vui lòng nhập tên màu sắc");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/mausac", {
        tenmau: newColorName.trim(),
      });
      setNewColorName("");
      fetchColors();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Tên màu sắc đã tồn tại");
      } else {
        console.error("Lỗi khi thêm màu sắc:", err);
        alert("Đã xảy ra lỗi khi thêm màu sắc");
      }
    }
  };

  const handleDeleteColor = async (mamau) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa màu sắc này?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/mausac/${mamau}`);
      fetchColors();
    } catch (err) {
      alert("Màu sắc này còn sản phẩm");
    }
  };

  const handleEditClick = (mamau, tenmau) => {
    setEditId(mamau);
    setEditName(tenmau);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleSaveEdit = async (mamau) => {
    if (!editName.trim()) {
      alert("Tên màu sắc không được để trống");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/mausac/${mamau}`, {
        tenmau: editName.trim(),
      });

      setEditId(null);
      setEditName("");
      fetchColors();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Tên màu sắc đã tồn tại");
      } else {
        console.error("Lỗi khi cập nhật màu sắc:", err);
        alert("Đã xảy ra lỗi khi cập nhật màu sắc");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="product-category-ad-page container">
        <h2>Quản lý màu sắc</h2>

        <div className="add-category-form">
          <input
            placeholder="Tên màu sắc"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
          />
          <button onClick={handleAddColor}>Thêm màu sắc</button>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th>Mã màu</th>
              <th>Tên màu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {colors.map(({ mamau, tenmau }) => (
              <tr key={mamau}>
                <td>{mamau}</td>
                <td>
                  {editId === mamau ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    tenmau
                  )}
                </td>
                <td>
                  {editId === mamau ? (
                    <>
                      <button onClick={() => handleSaveEdit(mamau)}>Lưu</button>
                      <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(mamau, tenmau)}>Sửa</button>
                      <button
                        onClick={() => handleDeleteColor(mamau)}
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

export default memo(ColorPage);
