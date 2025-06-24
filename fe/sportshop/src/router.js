import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/users/homePage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePage from "./pages/users/profilePage";
import ProductsPage from "./pages/users/productsPage";
import ProductDetailPage from "./pages/users/productDetailPage";
import ShoppingcartPage from "pages/users/shoppingcartPage";

const renderUserRouter = () => {
    const userRouters = [
        {
            path: ROUTERS.USER.HOME,
            component: <HomePage />,
        },
        {
            path: ROUTERS.USER.PROFILE,
            component: <ProfilePage />,
        },
        {
            path: ROUTERS.USER.PRODUCTS,
            component: <ProductsPage />,
        },
        {
            path: ROUTERS.USER.PRODUCT,
            component: <ProductDetailPage />,
        },
        {
            path: ROUTERS.USER.SHOPPING_CART,
            component: <ShoppingcartPage />,
        },
    ]
    return (
        <MasterLayout>
        <Routes>
            {
                userRouters.map((item, key) =>(<Route key ={key} path={item.path} element={item.component} />))
            }
        </Routes>
        </MasterLayout>
    );
};
const RouterCustom = () => {
    return renderUserRouter();
};

export default RouterCustom;