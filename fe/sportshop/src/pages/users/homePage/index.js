import axios from "axios";
import { memo, useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import cat2Img from "assets/users/images/categories/ao.jpg";
import cat4Img from "assets/users/images/categories/balo.jpg";
import cat1Img from "assets/users/images/categories/giay.png";
import cat5Img from "assets/users/images/categories/phukien.jpg";
import cat3Img from "assets/users/images/categories/vot.jpg";

import banner1Img from "assets/users/images/banner/index_banner_10.jpg";
import banner2Img from "assets/users/images/banner/index_banner_8.jpg";

import "./style.scss";

import ProductCard from "component/ProductCard";

const HomePage = () => {
  const [productData, setProductData] = useState([]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const sliderItems = [
    { bgImg: cat1Img, name: "Giày" },
    { bgImg: cat2Img, name: "Quần áo" },
    { bgImg: cat3Img, name: "Vợt" },
    { bgImg: cat4Img, name: "Ba lô" },
    { bgImg: cat5Img, name: "Phụ kiện" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/sanpham")
      .then((res) => {
        const mapped = res.data.map((sp) => ({
          id: sp.masp, // 👈 dùng cho chi tiết sản phẩm
          name: sp.tensp,
          price: sp.gia,
          img: `/images/${sp.hinhanh}`, // ảnh từ thư mục public/images
        }));
        setProductData(mapped);
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, []);

  const renderFeaturedProducts = () => {
    const shuffled = [...productData].sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, 4);

    return (
      <div className="row">
        {limited.map((item, idx) => (
          <div className="col-lg-3" key={idx}>
            <ProductCard
              id={item.id} // 👈 truyền id để routing
              name={item.name}
              img={item.img}
              price={item.price}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Categories Begin */}
      <div className="container container__categories_slider">
        <Carousel responsive={responsive} className="categories_slider">
          {sliderItems.map((item, key) => (
            <div
              className="categories_slider_item"
              style={{ backgroundImage: `url(${item.bgImg})` }}
              key={key}
            >
              <p>{item.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
      {/* Categories End */}

      {/* Featured Begin */}
      <div className="container">
        <div className="featured">
          <div className="section-tittle">
            <h2>Sản phẩm nổi bật</h2>
          </div>
          {renderFeaturedProducts()}
        </div>
      </div>
      {/* Featured End */}

      {/* Banner Begin */}
      <div className="container">
        <div className="banner">
          <div className="banner__pic">
            <img src={banner1Img} alt="banner" />
          </div>
          <div className="banner__pic">
            <img src={banner2Img} alt="banner" />
          </div>
        </div>
      </div>
      {/* Banner End */}
    </>
  );
};

export default memo(HomePage);
