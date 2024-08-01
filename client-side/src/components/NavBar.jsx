import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FaBlog, FaBars, FaBox } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const { user } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { link: "Home", path: "/" },
    { link: "Shop", path: "/shop" },

    { link: "sell your book", path: "/admin/dashboard" },
    { link: "Event Planner", path: "/eventPlanner" },
  ];

  return (
    <header className='w-full bg-transparent fixed top-0 left-0 right-0 transistion-all ease-in duration-300'>
      <nav
        className={`py-4 lg:px-24 ${
          isSticky ? "sticky top-0 left-0  right-0 bg-blue-300" : ""
        }`}>
        <div className='flex justify-between items-center text-base gap-8'>
          {/* logo */}
          <Link
            to='/'
            className='text-2xl font-bold text-blue-700 flex items-center gap-2'>
            <FaBlog className='inline-block' />
            Books
          </Link>
          {/* nav items for large device */}
          <ul className='md:flex space-x-12 hidden'>
            {navItems.map(({ link, path }) => (
              <Link
                key={path}
                to={path}
                className='block text-base text-black uppercase cursor-pointer hover:text-blue-700'>
                {link}
              </Link>
            ))}
          </ul>

          {/*btn for lg device*/}
          <div className='space-x-12 hidden lg:flex items-center'>
            <button>
              <FaBars className='w-5 hover:text-blue-700' />
            </button>
            {/*
                           // user? user.email : ""
                            */}
          </div>

          {/*menu button for mobile devices*/}
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-black focus:outline-none'>
              {isMenuOpen ? (
                <FaBox className='h-5 w-5 text-black' />
              ) : (
                <FaBars className='h-5 w-5 text-black' />
              )}
            </button>
          </div>
        </div>
        {/*nav item for small devices */}
        <div
          className={`space-y-4 px-4 mt-12 py-7 bg-blue-700 ${
            isMenuOpen ? "block fixed top-0 right-0 left-0" : "hidden"
          }`}>
          {navItems.map(({ link, path }) => (
            <Link
              key={path}
              to={path}
              className='block text-base text-white uppercase cursor-pointer'>
              {link}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
