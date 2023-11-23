import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import SingleBook from "../shop/SingleBook";
import DashboardLayout from "../dashboard/DashboardLayout";
import DashBoard from "../dashboard/DashBoard";
import UploadBook from "../dashboard/UploadBook";
import ManageBooks from "../dashboard/ManageBooks";
import EditBooks from "../dashboard/EditBooks";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import PrivateRoute from "../privateRoute/PrivateRoute";
import Logout from "../components/Logout";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const router = createBrowserRouter([
  
  {
    path: "/",
    element: <App/>,
    children: [
        {
            path: '/',
            element: <Home/>
        },
        {
            path: '/shop',
            element: <Shop/>
        },
        {
          path: '/book/:id',
          element: <SingleBook/>,
          loader: ({params}) => fetch(`${apiUrl}/book/${params.id}`)
        }
    ]
  },
  {
    path: "/admin/dashboard",
    element: <DashboardLayout/>,
    children: [
      {
        path: "/admin/dashboard",
        element: <PrivateRoute><DashBoard/></PrivateRoute>
      },
      {
        path: "/admin/dashboard/upload",
        element: <UploadBook/>
      },
      {
        path: "/admin/dashboard/manage",
        element: <ManageBooks/>
      },
      {
        path: "/admin/dashboard/edit-books/:id",
        element: <EditBooks/>,
        loader: ({params}) => fetch(`${apiUrl}/book/${params.id}`)
      }
    ]
  },
  {
    path: "sign-up",
    element: <SignUp/>
  },
  {
    path: "login",
    element: <Login/>
  },
  {
    path: "logout",
    element: <Logout/>
  }
]);

export default router;
