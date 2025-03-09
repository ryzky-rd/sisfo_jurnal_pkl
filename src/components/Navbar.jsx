import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "./layoutsAdmin/apiConfig";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const router = useRouter();
  const [setting, setSetting] = useState({
    gambar_setting: "",
  });
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    checkLoginStatus();
  }, [cookies.token]);

  const checkLoginStatus = () => {
    const token = cookies.token;
    console.log("Token:", token);
    setIsLoggedIn(!!token);
  };

  // Ambil data setting
  useEffect(() => {
    fetchDataSetting();
  }, []);

  const fetchDataSetting = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/setting`);
      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setSetting(response.data.data[0]);
      } else {
        setSetting({ gambar_setting: "" }); // Set default jika data tidak ada
      }
    } catch (error) {
      console.error("Error fetching data setting", error);
    } finally {
      setLoading(false); // Set loading ke false setelah fetch selesai
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    setIsLoggedIn(false);
    router.push("/auth_user/login");
  };

  // Jika masih loading, tampilkan skeleton atau pesan loading
  if (loading) {
    return (
      <div className="antialiased bg-gray-100 dark-mode:bg-gray-900 mb-5">
        <div className="w-full text-white bg-gray-800 dark-mode:text-gray-200 dark-mode:bg-gray-800">
          <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center lg:flex-row lg:justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-10 sm:h-14 w-24 bg-gray-600 animate-pulse rounded"></div>
                <div className="ml-3 -mr-48 h-6 w-48 bg-gray-600 animate-pulse rounded"></div>
              </div>
              <button className="rounded-lg lg:hidden">
                <div className="w-6 h-6 bg-gray-600 animate-pulse rounded"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased bg-gray-100 dark-mode:bg-gray-900 mb-5">
      <div className="w-full text-white bg-gray-800 dark-mode:text-gray-200 dark-mode:bg-gray-800">
        <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center lg:flex-row lg:justify-between">
          {/* Logo di kiri */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Link href={"/"} aria-label="Kembali ke Beranda">
                {setting.gambar_setting ? (
                  <img
                    className="h-10 sm:h-14 w-auto"
                    src={setting.gambar_setting}
                    alt="Logo Sekolah"
                  />
                ) : (
                  <div className="h-10 sm:h-14 w-24 bg-gray-600 rounded flex items-center justify-center text-sm">
                    No Logo
                  </div>
                )}
              </Link>
              <h2 className="ml-3 -mr-48 text-base sm:text-lg font-bold">
                SISFO JURNAL PKL
              </h2>
            </div>

            {/* Tombol hamburger untuk mobile */}
            <button
              onClick={toggleNavbar}
              className="rounded-lg lg:hidden"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  ></path>
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  ></path>
                )}
              </svg>
            </button>
          </div>

          {/* Menu navigasi */}
          <div
            className={`${
              isOpen ? "flex" : "hidden"
            } flex-col py-4 lg:py-0 lg:flex lg:flex-row lg:justify-center lg:items-center lg:flex-2`}
          >
            <Link
              href={"/"}
              className={`nav-link ${
                router.pathname === "/" ? "font-bold text-white underline" : ""
              } px-4 py-2 text-sm font-bold bg-transparent rounded-lg hover:text-white focus:underline underline-offset-8 focus:text-white text-center lg:text-left`}
            >
              HOME
            </Link>
            <Link
              href={"/pengisian_jurnal"}
              className={`nav-link ${
                router.pathname === "/pengisian_jurnal"
                  ? "font-bold text-white underline"
                  : ""
              } px-4 py-2 text-sm font-bold bg-transparent rounded-lg hover:text-white focus:underline underline-offset-8 focus:text-white text-center lg:text-left`}
              onClick={(e) => {
                const now = new Date();
                const currentHour = now.getHours();

                if (!isLoggedIn) {
                  e.preventDefault();
                  Swal.fire({
                    title: "Akses Ditolak",
                    text: "Anda harus login untuk mengakses Pengisian Jurnal.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    showCloseButton: true,
                    closeButtonHtml: '<span aria-label="close">&times;</span>',
                  });
                } else if (currentHour < 8 || currentHour >= 15) {
                  e.preventDefault();
                  Swal.fire({
                    title: "Akses Ditutup",
                    text: "Menu Pengisian Jurnal hanya dapat diakses dari pukul 08:00 hingga 15:00.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    showCloseButton: true,
                    closeButtonHtml: '<span aria-label="close">&times;</span>',
                  });
                }
              }}
            >
              PENGISIAN JURNAL
            </Link>

            {/* Menu Profile untuk Mobile */}
            <div className="lg:hidden border-t border-gray-700 mt-4 pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-gray-700 text-center"
                  >
                    MY PROFILE
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-bold text-white hover:bg-gray-700 text-center"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth_user/login"
                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-gray-700 text-center"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/auth_user/register"
                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-gray-700 text-center"
                  >
                    REGISTER
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Profile di kanan - Hanya tampil di desktop */}
          <div className="hidden lg:flex items-center justify-center p-4 lg:justify-end">
            <div className="relative">
              <button onClick={toggleProfile} className="flex items-center">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {isLoggedIn ? (
                    // Menu untuk user yang sudah login
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    // Menu untuk user yang belum login
                    <>
                      <Link
                        href="/auth_user/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth_user/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
