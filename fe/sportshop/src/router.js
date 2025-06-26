import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/users/homePage";
import { ADMIN_PATH, ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePage from "./pages/users/profilePage";
import ProductsPage from "./pages/users/productsPage";
import ProductDetailPage from "./pages/users/productDetailPage";
import ShoppingcartPage from "pages/users/shoppingcartPage";
import CheckoutPage from "pages/users/checkoutPage";
import LoginAdPage from "pages/admin/loginPage";
import MasterAdLayout from "pages/admin/theme/masterAdLayout";
import OrderAdPage from "pages/admin/orderPage";

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
      path: ROUTERS.USER.PRODUCTS_BY_CATEGORY,
      component: <ProductsPage />,
    },
    {
      path: "/san-pham/danh-muc/:madm",
      component: <ProductsPage />,
    },
    {
      path: "/san-pham/loai/:maloai",
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
    {
      path: ROUTERS.USER.CHECKOUT,
      component: <CheckoutPage />,
    },
  ];

  return (
    <MasterLayout>
      <Routes>
        {userRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
  );
};

const renderAdminRouter = () => {
  const adminRouter = [
    {
      path: ROUTERS.ADMIN.LOGIN,
      component: <LoginAdPage />,
    },
    {
      path: ROUTERS.ADMIN.ORDERS,
      component: <OrderAdPage />,
    },
  ];

  return (
    <MasterAdLayout>
      <Routes>
        {adminRouter.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterAdLayout>
  );
};

const RouterCustom = () => {
  const location = useLocation();
  const isAdminRouters = location.pathname.startsWith(ADMIN_PATH);

  return isAdminRouters ? renderAdminRouter() : renderUserRouter();
};

export default RouterCustom;
