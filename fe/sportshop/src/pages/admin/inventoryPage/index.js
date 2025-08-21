import { memo, useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState({});
  const [newEntry, setNewEntry] = useState({ masp: "", mamau: "", soluong: "" });
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
    fetchColors();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/tonkho");
      setInventory(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu tồn kho:", err);
    }
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3001/api/sanpham");
    setProducts(res.data);
  };

  const fetchColors = async () => {
    const res = await axios.get("http://localhost:3001/api/mausac");
    setColors(res.data);
  };

 const handleEdit = (masp, mamau, soluong) => {
  setEditingKey(`${masp}-${mamau}`);
  setEditedQuantity({ masp, mamau, soluong });
};

const handleSave = async () => {
  const soluong = parseInt(editedQuantity.soluong, 10);
  if (isNaN(soluong) || soluong < 0) {
    alert("Số lượng phải là số và không được nhỏ hơn 0");
    return;
  }
  try {
    await axios.put("http://localhost:3001/api/tonkho", {
      ...editedQuantity,
      soluong,
    });
    setEditingKey(null);
    fetchInventory();
  } catch (err) {
    console.error("Lỗi khi cập nhật tồn kho:", err);
  }
};



  const handleDelete = async (masp, mamau) => {
  if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
  try {
    await axios.delete(`http://localhost:3001/api/tonkho/${masp}/${mamau}`);
    fetchInventory();
  } catch (err) {
    console.error("Lỗi khi xóa:", err);
  }
};

const handleAdd = async () => {
  const soluong = parseInt(newEntry.soluong, 10);

  if (!newEntry.masp || !newEntry.mamau || isNaN(soluong)) {
    alert("Vui lòng chọn sản phẩm, màu sắc và nhập số lượng hợp lệ");
    return;
  }

  if (soluong < 0) {
    alert("Số lượng không được nhỏ hơn 0");
    return;
  }

  const isDuplicate = inventory.some(
    (item) => item.masp === newEntry.masp && item.mamau === newEntry.mamau
  );
  if (isDuplicate) {
    alert("Tồn tại sản phẩm với màu này rồi.");
    return;
  }

  try {
  await axios.post("http://localhost:3001/api/tonkho", {
    ...newEntry,
    soluong,
  });
  setNewEntry({ masp: "", mamau: "", soluong: 0 });
  fetchInventory();
} catch (err) {
  // Nếu server trả về lỗi rõ ràng
  if (err.response && err.response.data && err.response.data.error) {
    alert(err.response.data.error);
  } else {
    alert("Lỗi không xác định khi thêm kho");
  }
}

};



  return (
    <div className="product-page">
      <div className="product-category-ad-page container">
        <h2>Quản lý tồn kho theo màu</h2>

        <div className="add-category-form">
          <select
            value={newEntry.masp}
            onChange={(e) => setNewEntry({ ...newEntry, masp: e.target.value })}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((p) => (
              <option key={p.masp} value={p.masp}>
                {p.tensp}
              </option>
            ))}
          </select>

          <select
            value={newEntry.mamau}
            onChange={(e) => setNewEntry({ ...newEntry, mamau: e.target.value })}
          >
            <option value="">Chọn màu</option>
            {colors.map((c) => (
              <option key={c.mamau} value={c.mamau}>
                {c.tenmau}
              </option>
            ))}
          </select>

          <input
  type="number"
  min={0}
  placeholder="Số lượng"
  value={newEntry.soluong}
  onChange={(e) =>
    setNewEntry({ ...newEntry, soluong: e.target.value })
  }
/>


          <button onClick={handleAdd}>Thêm</button>
        </div>

        <table className="category-table">
          <thead>
  <tr>
    <th>Mã SP</th>
    <th>Tên sản phẩm</th>

    <th>Tên màu</th>
    <th>Số lượng tồn</th>
    <th>Hành động</th>
  </tr>
</thead>
<tbody>
  {inventory.map(({ masp, tensp, mamau, tenmau, soluong }) => {
    const key = `${masp}-${mamau}`;
    const isEditing = key === editingKey;
    return (
      <tr key={key}>
        <td>{masp}</td>
        <td>{tensp}</td>
        <td>{tenmau}</td>
        <td>
          {isEditing ? (
            <input
              type="number"
              min={0}
              value={editedQuantity.soluong}
              onChange={(e) =>
                setEditedQuantity({
                  ...editedQuantity,
                  soluong: e.target.value,
                })
              }
            />
          ) : (
            soluong
          )}
        </td>
        <td>
          {isEditing ? (
            <button onClick={handleSave}>Lưu</button>
          ) : (
            <button onClick={() => handleEdit(masp, mamau, soluong)}>Sửa</button>
          )}
          <button onClick={() => handleDelete(masp, mamau)}>Xóa</button>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default memo(InventoryPage);
