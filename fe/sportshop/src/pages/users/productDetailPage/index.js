import { memo } from "react";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss"
import { Link } from "react-router-dom";
import { categories } from "../theme/header";
import { ROUTERS } from "utils/router";
import feature1Img from "assets/users/images/featured/giày.jpg";
import { ProductCard } from "component";

const ProductDetailPage = () => {
    
    return( <>
    <Breadcrumb name="Chi tiết sản phẩm" />
    <div className="container">
        <div className="row">
            <div className="col-lg-6">
                Hình Ảnh
            </div>
            <div className="col-lg-6">
                Chi tiết
            </div>
        </div>
    </div>
    </>
);};

export default memo(ProductDetailPage);