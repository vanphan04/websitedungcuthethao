import { memo } from "react";
import "./style.scss"
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";

const LoginPage = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(ROUTERS.ADMIN.ORDERS)
        
    }


    return <div className="login">
        <div className="login__container">
            <h2 className="login__tittle">HỆ THỐNG QUẢN TRỊ</h2>
            <form className="login__form" onSubmit={handleSubmit}>
                <div className="login__form-group">
                    <label htmlFor="username" className="login__label">Tên đăng nhập</label>
                    <input type="text" name="username"/>
                </div>
                <div className="login__form-group">
                    <label htmlFor="password" className="login__label">Mật khẩu</label>
                    <input type="password" name="password"/>
                </div>
                <button type="submit" className="login__btn">ĐĂNG NHẬP</button>
            </form>
        </div>
    </div>;
};

export default memo(LoginPage);