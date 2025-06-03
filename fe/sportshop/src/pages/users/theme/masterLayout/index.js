import { memo } from "react";
import Footer from "../footer";
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