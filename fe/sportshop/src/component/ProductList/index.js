import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/sanpham")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sản phẩm:", err);
      });
  }, []);

  return (
    <div className="row">
      {products.map((item) => (
        <div key={item.masp} className="col-lg-4 col-md-6 col-sm-6">
          <ProductCard
            img={item.hinhanh}
            name={item.tensp}
            price={item.gia}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
