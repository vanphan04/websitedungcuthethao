export const ADMIN_PATH = "/quan-tri"

export const ROUTERS = {
  USER: {
    HOME: "/",
    PROFILE: "/profile",
    PRODUCTS: "/san-pham",
    PRODUCTS_BY_CATEGORY: "/san-pham/danh-muc/:madm",
    PRODUCT: "/san-pham/:id",
    SHOPPING_CART: "/gio-hang",
    PRODUCT_BY_TYPE: "/san-pham/loai/:maloai",
    CHECKOUT: "/thanh-toan",
    TRACK_ORDER: "/tra-cuu-don-hang",
    ORDER_DETAIL: "/tra-cuu-don-hang/:id",
    ABOUT:"/ve-chung-toi",
  },

  ADMIN: {
    LOGIN: `${ADMIN_PATH}/dang-nhap`,
    ORDERS: `${ADMIN_PATH}/dat-hang`,
    ORDER_DETAIL: `${ADMIN_PATH}/don-hang/:id`, 
    PRODUCTS: `${ADMIN_PATH}/san-pham`,      
    CATEGORIES: `${ADMIN_PATH}/loai-san-pham`, 
    LOGOUT: `${ADMIN_PATH}/dang-xuat`,
    ADD_PRODUCT: `${ADMIN_PATH}/them-san-pham`,
    EDIT_PRODUCT: `${ADMIN_PATH}/sua-san-pham`,
    ADD_CATEGORY: `${ADMIN_PATH}/danh-muc`,
    SIZE: `${ADMIN_PATH}/kich-co`,
    COLOR: `${ADMIN_PATH}/mau-sac`,
    INVENTORY: `${ADMIN_PATH}/ton-kho`,
  },
};
