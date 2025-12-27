import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../Layouts/Mainlayout";
import Home from "../Components/pages/Home";
import AddPrice from "../Components/pages/AddPrice";
import UpdateSellingRate from "../Components/pages/UpdateSelling";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        index: true, 
        element:<Home></Home>
      },
      {
        path: "home", 
        element: <Home/>,
      },
      {
        path: "addPrice",
        element: <AddPrice />,
      },
      {
        path: "updateSellingRate",
        element: <UpdateSellingRate></UpdateSellingRate>
      },
    ],
  },
]);

export default router;
