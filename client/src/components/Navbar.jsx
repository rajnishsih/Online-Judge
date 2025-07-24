import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Problemset", href: "/problemset" },
  { name: "Compiler", href: "/compiler" },
  { name: "Leaderboard", href: "/leaderboard" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const {userData,backendUrl,setUserData,setIsLoggedIn} = useContext(AppContext)

  const logout = async()=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+'/api/auth/logout');
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate('/')
    } catch (error) {
      toast.error(error.message);
    }
  }

  const sendVerificationOtp = async()=>{
    try {
       axios.defaults.withCredentials = true;
       const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp')
       if(data.success){
          navigate('/email-verify');
          toast.success(data.message);
       }
       else{
        toast.error(data.message);
       }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* login and profile section */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {userData ? (
              <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
                {userData.name[0].toUpperCase()}
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                  <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                    {!userData.isAccountVerified && (
                      <li
                        onClick={sendVerificationOtp}
                        className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                      >
                        Verify Email
                      </li>
                    )}

                    <li
                      onClick={logout}
                      className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-10 bg-gray-100 hover:bg-gray-900 hover:text-white transition-all "
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
