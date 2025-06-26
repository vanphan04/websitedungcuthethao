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
  },

  ADMIN: {
    LOGIN:`${ADMIN_PATH}/dang-nhap`,
    ORDERS:`${ADMIN_PATH}/dat-hang`,
    LOGOUT:`${ADMIN_PATH}/dang-xuat`,
  },
};
