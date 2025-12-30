import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import Home from "../Components/pages/Home";
import AddPrice from "../Components/pages/AddPrice";
import UpdateSellingRate from "../Components/pages/UpdateSelling";
import AddCustomer from "../Components/pages/AddCustomer";
import DailyAttendance from "../Components/pages/DailyAttendance";
import EmployeeManager from "../Components/pages/EmployeeManager";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "addPrice",
        element: <AddPrice />,
      },
      {
        path: "updateSellingRate",
        element: <UpdateSellingRate></UpdateSellingRate>,
      },
      {
        path: "addCustomer",
        element: <AddCustomer></AddCustomer>,
      },
    
      {
        path: "MangeEmployee",
        element:<EmployeeManager></EmployeeManager>
      },
      {
        path: "dailyAttendance",
        element: <DailyAttendance></DailyAttendance>
   
   
      },
    ],
  },
]);

export default router;
