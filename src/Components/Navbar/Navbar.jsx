/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from "../../assets/logo-fresh.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/addPrice", label: "Add Price" },
    { path: "/updateSellingRate", label: "Selling Rate" },
    { path: "/addCustomer", label: "Add Customer" },
  ];
  return (
  <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <NavLink to="/home" className="flex items-center gap-2">
              <img src={logo} alt="logo" className="h-9 w-auto" />
              <span className="text-xl font-bold text-purple-700">
                Office App
              </span>
            </NavLink>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `font-medium transition ${
                        isActive
                          ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                          : "text-gray-600 hover:text-purple-700"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Button */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-2xl text-gray-700"
            >
              <RiMenu3Line />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold text-purple-700">
            CMS Menu
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-2xl text-gray-700"
          >
            <RiCloseLine />
          </button>
        </div>

        <ul className="flex flex-col p-4 gap-4">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
