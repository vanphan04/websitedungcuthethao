// src/router.js
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/users/homePage";
import { ADMIN_PATH, ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePage from "./pages/users/profilePage";
import ProductsPage from "./pages/users/productsPage";
import ProductDetailPage from "./pages/users/productDetailPage";
import ShoppingcartPage from "pages/users/shoppingcartPage";
import CheckoutPage from "pages/users/checkoutPage";
import TrackOrderPage from "pages/users/TrackOrderPage";
import LoginAdPage from "pages/admin/loginPage";
import MasterAdLayout from "pages/admin/theme/masterAdLayout";
import OrderAdPage from "pages/admin/orderPage";
import OrderDetailPage from "pages/admin/OrderDetailPage";
import UserOrderDetailPage from "pages/users/UserOrderDetailPage";
import ProductAdPage from "pages/admin/productPage";
import CategoryAdPage from "pages/admin/categoryPage";
import AddProductPage from "pages/admin/AddProductPage";
import DmPage from "pages/admin/dmPage";
import ColorPage from "pages/admin/colorPage";
import InventoryPage from "pages/admin/inventoryPage"; // ✅ Trang tồn kho
import EditProductPage from "pages/admin/editProductPage";

const renderUserRouter = () => {
  const userRouters = [
    { path: ROUTERS.USER.HOME, component: <HomePage /> },
    { path: ROUTERS.USER.PROFILE, component: <ProfilePage /> },
    { path: ROUTERS.USER.PRODUCTS, component: <ProductsPage /> },
    { path: ROUTERS.USER.PRODUCTS_BY_CATEGORY, component: <ProductsPage /> },
    { path: "/san-pham/danh-muc/:madm", component: <ProductsPage /> },
    { path: "/san-pham/loai/:maloai", component: <ProductsPage /> },
    { path: ROUTERS.USER.PRODUCT, component: <ProductDetailPage /> },
    { path: ROUTERS.USER.SHOPPING_CART, component: <ShoppingcartPage /> },
    { path: ROUTERS.USER.CHECKOUT, component: <CheckoutPage /> },
    { path: "/tra-cuu-don-hang", component: <TrackOrderPage /> },
    { path: ROUTERS.USER.ORDER_DETAIL, component: <UserOrderDetailPage /> },
    { path: ROUTERS.USER.ABOUT, component: <div>Phan Thành Văn</div> }, // Placeholder for "Về chúng tôi" page
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
    { path: ROUTERS.ADMIN.LOGIN, component: <LoginAdPage /> },
    { path: ROUTERS.ADMIN.ORDERS, component: <OrderAdPage /> },
    { path: ROUTERS.ADMIN.ORDER_DETAIL, component: <OrderDetailPage /> },
    { path: ROUTERS.ADMIN.PRODUCTS, component: <ProductAdPage /> },
    { path: ROUTERS.ADMIN.CATEGORIES, component: <CategoryAdPage /> },
    { path: ROUTERS.ADMIN.ADD_CATEGORY, component: <DmPage /> },
    { path: ROUTERS.ADMIN.ADD_PRODUCT, component: <AddProductPage /> },
    { path: ROUTERS.ADMIN.EDIT_PRODUCT, component: <EditProductPage /> },
    { path: ROUTERS.ADMIN.COLOR, component: <ColorPage /> },
    { path: ROUTERS.ADMIN.INVENTORY, component: <InventoryPage /> }, 
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
