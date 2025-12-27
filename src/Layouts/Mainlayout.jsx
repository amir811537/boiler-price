import { Outlet } from "react-router-dom";
// import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";

const Mainlayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default Mainlayout;