import { memo } from "react";
import Footer from "../../../common/footer";
import { ROUTERS } from "utils/router";
import { useLocation } from "react-router-dom";
import HeaderAd from "../header";


const MasterAdLayout = ({ children, ...props }) => {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith(ROUTERS.ADMIN.LOGIN);

  return (
    <div {...props}>
      {
        !isLoginPage && <HeaderAd/>
      }
      {children}
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default memo(MasterAdLayout);
