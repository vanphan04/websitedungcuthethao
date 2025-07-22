import { useEffect, useState, memo } from "react";
import axios from "axios";
import "../dmPage/style.scss";

const SizePage = () => {
  const [sizes, setSizes] = useState([]);
  const [newSizeName, setNewSizeName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/kichco");
      console.log("Dữ liệu kích cỡ nhận được:", res.data);
      setSizes(res.data);
    } catch (err) {
      console.error("Lỗi khi tải kích cỡ:", err);
    }
  };

  const handleAddSize = async () => {
    if (!newSizeName.trim()) {
      alert("Vui lòng nhập tên kích cỡ");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/kichco", {
        tenkichco: newSizeName.trim(),
      });
      setNewSizeName("");
      fetchSizes();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Tên kích cỡ đã tồn tại");
      } else {
        console.error("Lỗi khi thêm kích cỡ:", err);
        alert("Đã xảy ra lỗi khi thêm kích cỡ");
      }
    }
  };

  const handleDeleteSize = async (makichco) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kích cỡ này?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/kichco/${makichco}`);
      fetchSizes();
    } catch (err) {
      alert("Kích cỡ này còn sản phẩm");
    }
  };

  const handleEditClick = (makichco, tenkichco) => {
    setEditId(makichco);
    setEditName(tenkichco);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleSaveEdit = async (makichco) => {
    if (!editName || !editName.trim()) {
      alert("Tên kích cỡ không được để trống");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/kichco/${makichco}`, {
        tenkichco: editName.trim(),
      });

      setEditId(null);
      setEditName("");
      fetchSizes();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Tên kích cỡ đã tồn tại");
      } else {
        console.error("Lỗi khi cập nhật kích cỡ:", err);
        alert("Đã xảy ra lỗi khi cập nhật kích cỡ");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="product-category-ad-page container">
        <h2>Quản lý kích cỡ</h2>

        <div className="add-category-form">
          <input
            placeholder="Tên kích cỡ"
            value={newSizeName}
            onChange={(e) => setNewSizeName(e.target.value)}
          />
          <button onClick={handleAddSize}>Thêm kích cỡ</button>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th>Mã kích cỡ</th>
              <th>Tên kích cỡ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map(({ makichco, tenkichco }, index) => (
              <tr key={makichco ?? `row-${index}`}>
                <td>{makichco}</td>
                <td>
                  {editId === makichco ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    tenkichco || "[Chưa có tên]"
                  )}
                </td>
                <td>
                  {editId === makichco ? (
                    <>
                      <button onClick={() => handleSaveEdit(makichco)}>Lưu</button>
                      <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(makichco, tenkichco)}>Sửa</button>
                      <button
                        onClick={() => handleDeleteSize(makichco)}
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

export default memo(SizePage);
