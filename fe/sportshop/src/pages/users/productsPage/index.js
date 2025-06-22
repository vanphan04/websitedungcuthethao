import { memo } from "react";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss"
import { Link } from "react-router-dom";
import { categories } from "../theme/header";
import { ROUTERS } from "utils/router";
import feature1Img from "assets/users/images/featured/giày.jpg";
import { ProductCard } from "component";

const ProfilePage = () => {
    const sorts = [
        "Giảm dần",
        "Tăng dần",
        "Mới nhất",
        "Cũ nhất",
        "Bán chạy",
        "Giảm giá"
    ];

    const products = [
        {
            img:feature1Img ,
            name:"Giày" ,
            price: "200000"
        },
        {
            img:feature1Img ,
            name:"Giày" ,
            price: "200000"
        },
        {
            img:feature1Img ,
            name:"Giày" ,
            price: "200000"
        },
        {
            img:feature1Img ,
            name:"Giày" ,
            price: "200000"
        },
    ];

    return <>
    <Breadcrumb name="Danh sách sản phẩm" />
    <div className="container">
        <div className="row">
            <div className="col-lg-3">
                <div className="sidebar">
                    <div className="sidebar__item">
                        <h2>Tìm kiếm</h2>
                        <input type="text" />
                    </div>
                    <div className="sidebar__item">
                        <h2>Mức giá</h2>
                        <div className="price-range-wrap">
                            <div>
                                <p>Từ:</p>
                                <input type="number" min={0}/>
                            </div>
                            <div>
                                <p>Đến:</p>
                                <input type="number" min={0}/>
                            </div>
                        </div>
                    </div>
                    <div className="sidebar__item">
                        <h2>Sắp xếp</h2>
                        <div className="tags">
                            {sorts.map((item,key) => (
                            <div className={`tag ${key === 0 ? "active" : ""}`} key={key}>
                                {item}
                            </div>
                            ))}
                        </div>
                         <div className="sidebar__item">
                        <h2>Thể loại khác</h2>
                        <ul>
                            {categories.map((name,key) => (
                                <li key={key}>
                                    <Link to={ROUTERS.USER.PRODUCTS}>{name}</Link>
                                </li>
                            ))}
                            
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-9">
                <div className="row">
                    {
                        products.map((item, key) => (
                            <div className="col-lg-4" key={key}>
                        <ProductCard 
                        name={item.name} 
                        img={item.img} 
                        price={item.price} 
                        />
                    </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
    </>;
};

export default memo(ProfilePage);