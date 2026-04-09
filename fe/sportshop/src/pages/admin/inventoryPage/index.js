import { memo, useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState({});
  const [newEntry, setNewEntry] = useState({
    masp: "",
    mamau: "",
    size: "",
    soluong: "",
  });
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");

  useEffect(() => {
    fetchInventory();
    fetchProducts();
    fetchColors();
    fetchProductTypes();
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

  const fetchProductTypes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/loaisanpham");
      setProductTypes(res.data);
    } catch (err) {
      console.error("Lỗi khi tải loại sản phẩm:", err);
    }
  };

  const handleEdit = (variant_id, masp, mamau, size, soluong) => {
    setEditingKey(`${masp}-${mamau}-${size || ""}`);
    setEditedQuantity({ variant_id, masp, mamau, size, soluong });
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

  const handleDelete = async (variant_id) => {
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/tonkho/${variant_id}`);
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
      (item) => item.masp === newEntry.masp && item.mamau === newEntry.mamau,
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
      setNewEntry({ masp: "", mamau: "", soluong: "" });
      fetchInventory();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Lỗi không xác định khi thêm kho");
      }
    }
  }; // <--- ĐÃ SỬA: Đóng đúng ngoặc cho hàm handleAdd

  return (
    <div className="product-page">
      <div className="product-category-ad-page container">
        <h2>Quản lý tồn kho theo màu</h2>

        <div className="add-category-form">
          <select
            value={selectedProductType}
            onChange={(e) => setSelectedProductType(e.target.value)}
          >
            <option value="">-- Tất cả loại sản phẩm --</option>
            {productTypes.map((type) => (
              <option key={type.maloai} value={type.maloai}>
                {type.tenloai}
              </option>
            ))}
          </select>

          <select
            value={newEntry.masp}
            onChange={(e) => setNewEntry({ ...newEntry, masp: e.target.value })}
          >
            <option value="">Chọn sản phẩm</option>
            {products
              .filter(
                (p) =>
                  !selectedProductType ||
                  p.maloai === parseInt(selectedProductType),
              )
              .map((p) => (
                <option key={p.masp} value={p.masp}>
                  {p.tensp}
                </option>
              ))}
          </select>

          <select
            value={newEntry.mamau}
            onChange={(e) =>
              setNewEntry({ ...newEntry, mamau: e.target.value })
            }
          >
            <option value="">Chọn màu</option>
            {colors.map((c) => (
              <option key={c.mamau} value={c.mamau}>
                {c.tenmau}
              </option>
            ))}
          </select>

          <select
            value={newEntry.size}
            onChange={(e) => setNewEntry({ ...newEntry, size: e.target.value })}
          >
            <option value="">Chọn size (để trống nếu không có)</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
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
              <th>Size</th>
              <th>Số lượng tồn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {inventory
              .filter((item) => {
                if (!selectedProductType) return true;
                const product = products.find((p) => p.masp === item.masp);
                return (
                  product && product.maloai === parseInt(selectedProductType)
                );
              })
              .map(
                ({ variant_id, masp, tensp, mamau, tenmau, size, soluong }) => {
                  const key = `${masp}-${mamau}-${size || ""}`;
                  const isEditing = key === editingKey;
                  return (
                    <tr key={key}>
                      <td>{masp}</td>
                      <td>{tensp}</td>
                      <td>{tenmau}</td>
                      <td style={{ color: size ? "inherit" : "#999" }}>
                        {size || "—"}
                      </td>
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
                          <button
                            onClick={() =>
                              handleEdit(variant_id, masp, mamau, size, soluong)
                            }
                          >
                            Sửa
                          </button>
                        )}
                        <button onClick={() => handleDelete(variant_id)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                },
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(InventoryPage);
