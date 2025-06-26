import { memo } from "react";
import Footer from "../../../common/footer";
import Header from "../header";

const MasterLayout = ({ children, ...props}) => {
    return (
        <div {...props}>
            <Header />
            {children}
            <Footer />
        </div>
        
    );
};

export default memo(MasterLayout);