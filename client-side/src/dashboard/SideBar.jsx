import React, { useContext } from "react";
import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiOutlineCloudUpload,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import sidebarlogo from "../assets/sidebarlogo.jpeg";
import { AuthContext } from "../contexts/AuthProvider";

export const SideBar = () => {
  const { user } = useContext(AuthContext);
  return (
    <Sidebar aria-label='Sidebar with content separator example'>
      <Sidebar.Logo
        href='/'
        img={user?.photoURL}
        imgAlt=''
        className='w-16 h-16 rounded'>
        {user?.displayName || "Demo User"}
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href='/admin/dashboard' icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            href='/admin/dashboard/upload'
            icon={HiOutlineCloudUpload}>
            Upload Book
          </Sidebar.Item>
          <Sidebar.Item href='/admin/dashboard/manage' icon={HiInbox}>
            Manage Books
          </Sidebar.Item>
          <Sidebar.Item href='/' icon={HiArrowSmRight}>
            Home
          </Sidebar.Item>
          <Sidebar.Item href='/logout' icon={HiTable} >
            Log Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
