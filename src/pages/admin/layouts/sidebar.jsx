import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NotificationDropdown from "@/components/layoutsAdmin/NotificationDropdown";
import UserDropdown from "@/components/layoutsAdmin/UserDropdown";
import axios from "axios";
import { useCookies } from "react-cookie";
import CekRole from "@/components/CekRole";
import { CSSTransition } from "react-transition-group"; // Import CSSTransition
import styles from "./Sidebar.module.css"; // Import CSS module
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["token"]);

  // akses berdasarkan role
  const role = CekRole();

  // SECTION Fungsi untuk menghapus cookie berdasarkan namanya
  function deleteCookie(name) {
    // Menetapkan tanggal kedaluwarsa yang sudah lewat
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  const handleLogout = async () => {
    try {
      const token = cookies.token;
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      await axios.post(`${BASE_URL}/api/auth/logout`, null, config);
      deleteCookie("token");
      router.push("/auth/login");
    } catch (error) {}
  };

  const [dropdownOpenPaket, setDropdownOpenPaket] = useState(
    router.pathname.indexOf("/admin/paket") !== -1 ||
      router.pathname.indexOf("/admin/benefit_paket") !== -1 ||
      router.pathname.indexOf("/admin/contoh_desain") !== -1
  );
  const [dropdownOpenKlien, setDropdownOpenKlien] = useState(
    router.pathname.indexOf("/admin/kategoriKlien") !== -1 ||
      router.pathname.indexOf("/admin/klien") !== -1
  );
  const [dropdownOpenPembayaran, setDropdownOpenPembayaran] = useState(
    router.pathname.indexOf("/admin/pembayaran") !== -1 ||
      router.pathname.indexOf("/admin/testimoni") !== -1 ||
      router.pathname.indexOf("/admin/kategoriWebsite") !== -1 ||
      router.pathname.indexOf("/admin/syarat_ketentuan") !== -1
  );

  return (
    <>
           <nav className="relative z-10 flex flex-wrap items-center justify-between px-6 py-4 bg-white shadow-xl md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden md:w-64 h-full">
        <div
          className="flex flex-wrap items-center justify-between w-full px-0 mx-auto md:flex-col md:items-stretch md:min-h-full md:flex-nowrap md:overflow-hidden md:w-64"
          style={{ overflow: "hidden" }}
        >
          <button
            className="px-3 py-1 text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          <Link
            href={"/"}
            className="inline-block mr-0 text-sm font-bold text-left uppercase md:block md:pb-2 text-blueGray-600 whitespace-nowrap"
          >
            GMT SOFT DEVELOPMENT
          </Link>
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            <div className="block pb-4 mb-4 border-b border-solid md:min-w-full md:hidden border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    href="/"
                    className="inline-block text-sm font-bold uppercase md:block md:pb-2 text-blueGray-600 whitespace-nowrap"
                  >
                    GMT SOFTWARE DEVELOPMENT
                  </Link>
                </div>
                <div className="flex justify-end w-6/12">
                  <button
                    type="button"
                    className="px-3 py-1 text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col list-none md:flex-col md:min-w-full">
              <div className="flex justify-start">
                <div className="relative">
                  <button
                    className="flex items-center w-full py-3 text-xs font-bold uppercase"
                    onClick={() => {
                      setDropdownOpenPaket(!dropdownOpenPaket);
                      setDropdownOpenKlien(false);
                    }}
                  >
                    <i className="fa-solid fa-box text-sm mr-3"></i>
                    <span>Paket</span>
                    <i
                      className={`fas fa-chevron-${
                        dropdownOpenPaket ? "up" : "down"
                      } mx-2`}
                    ></i>
                  </button>
                  <CSSTransition
                    in={dropdownOpenPaket}
                    timeout={300}
                    classNames={{
                      enter: styles.dropdownEnter,
                      enterActive: styles.dropdownEnterActive,
                      exit: styles.dropdownExit,
                      exitActive: styles.dropdownExitActive,
                    }}
                    unmountOnExit
                  >
                    <ul
                      className="left-0 w-full bg-white shadow-lg px-3"
                      style={{ width: "200px" }}
                    >
                      <li className="py-2">
                        <Link
                          href={"/admin/paket"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf("/admin/paket") !== -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Paket
                        </Link>
                      </li>
                      <li className="py-2">
                        <Link
                          href={"/admin/benefit_paket"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf("/admin/benefit_paket") !==
                            -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Benefit Paket
                        </Link>
                      </li>
                      <li className="pt-2 pb-6">
                        <Link
                          href={"/admin/contoh_desain"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf("/admin/contoh_desain") !==
                            -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Contoh Desain
                        </Link>
                      </li>
                    </ul>
                  </CSSTransition>
                </div>
              </div>

              <li className="items-center">
                <div className="relative">
                  <button
                    className="flex items-center w-full py-3 text-xs font-bold uppercase"
                    onClick={() => {
                      setDropdownOpenKlien(!dropdownOpenKlien);
                      setDropdownOpenPaket(false);
                    }}
                  >
                    <i className="fa-solid fa-user mr-3 text-sm"></i>
                    <span>Klien</span>
                    <i
                      className={`fas fa-chevron-${
                        dropdownOpenKlien ? "up" : "down"
                      } mx-2`}
                    ></i>
                  </button>
                  <CSSTransition
                    in={dropdownOpenKlien}
                    timeout={300}
                    classNames={{
                      enter: styles.dropdownEnter,
                      enterActive: styles.dropdownEnterActive,
                      exit: styles.dropdownExit,
                      exitActive: styles.dropdownExitActive,
                    }}
                    unmountOnExit
                  >
                    <ul
                      className="left-0 w-full bg-white shadow-lg px-3"
                      style={{ width: "200px" }}
                    >
                      <li className="py-2">
                        <Link
                          href={"/admin/kategoriKlien"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf("/admin/kategoriKlien") !==
                            -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Kategori Klien
                        </Link>
                      </li>
                      <li className="pt-2 pb-4">
                        <Link
                          href={"/admin/klien"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf("/admin/klien") !== -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Klien
                        </Link>
                      </li>
                    </ul>
                  </CSSTransition>
                </div>
              </li>

              {dropdownOpenKlien && <li className="h-4"></li>}

              {/* Dropdown for Pembayaran, Testimoni, Kategori Website, and Syarat Ketentuan */}
              <li className="items-center">
                <div className="relative">
                  <button
                    className="flex items-center w-full py-3 text-xs font-bold uppercase"
                    onClick={() => {
                      setDropdownOpenPembayaran(!dropdownOpenPembayaran);
                      setDropdownOpenKlien(false);
                      setDropdownOpenPaket(false);
                    }}
                  >
                    <i className="fa-solid fa-money-bill mr-3 text-sm"></i>
                    <span>Manajemen</span>
                    <i
                      className={`fas fa-chevron-${
                        dropdownOpenPembayaran ? "up" : "down"
                      } mx-2`}
                    ></i>
                  </button>
                  <CSSTransition
                    in={dropdownOpenPembayaran}
                    timeout={300}
                    classNames={{
                      enter: styles.dropdownEnter,
                      enterActive: styles.dropdownEnterActive,
                      exit: styles.dropdownExit,
                      exitActive: styles.dropdownExitActive,
                    }}
                    unmountOnExit
                  >
                    <ul
                      className="left-0 w-full bg-white shadow-lg px-3"
                      style={{ width: "200px" }}
                    >
                      <li className="py-2">
                        <Link
                          href={"/admin/pembayaran"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf("/admin/pembayaran") !== -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Pembayaran
                        </Link>
                      </li>
                      <li className="py-2">
                        <Link
                          href={"/admin/testimoni"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf("/admin/testimoni") !== -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Testimoni
                        </Link>
                      </li>
                      <li className="py-2">
                        <Link
                          href={"/admin/kategoriWebsite"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf(
                              "/admin/kategoriWebsite"
                            ) !== -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Kategori Website
                        </Link>
                      </li>
                      <li className="pt-2 pb-4">
                        <Link
                          href={"/admin/syarat_ketentuan"}
                          className={`text-blueGray-700 hover:text-blueGray-500 font-semibold text-sm ${
                            router.pathname.indexOf(
                              "/admin/syarat_ketentuan"
                            ) !== -1
                              ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                              : ""
                          }`}
                        >
                          Syarat & Ketentuan
                        </Link>
                      </li>
                    </ul>
                  </CSSTransition>
                </div>
              </li>

              <li className="items-center">
                <Link
                  href={"/admin/invoice"}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/invoice") !== -1
                      ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fa-solid fa-file-invoice mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/invoice") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Invoice
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={"/admin/pelanggan"}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/pelanggan") !== -1
                      ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fa-regular fa-handshake mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/pelanggan") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Pelanggan
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={"/admin/wcu"}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/wcu") !== -1
                      ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fa-solid fa-question mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/wcu") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  WCU
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={"/admin/keterangan"}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/keterangan") !== -1
                      ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fa-solid fa-info mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/keterangan") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Keterangan
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={"/admin/backup_data"}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/backup_data") !== -1
                      ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fa-solid fa-cloud-arrow-up mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/backup_data") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Backup Data
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={"/admin/administrators"}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/administrators") !== -1
                      ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fa-solid fa-user-tie mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/administrators") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Administrators
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={"/admin/setting"}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/setting") !== -1
                      ? "bg-orange-300 text-black rounded-lg px-4 py-2"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  <i
                    className={
                      "fa-solid fa-gear mr-2 text-sm " +
                      (router.pathname.indexOf("/admin/setting") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Setting
                </Link>
              </li>

              <li className="items-center">
                <button
                  onClick={handleLogout}
                  className="block py-3 text-xs font-bold uppercase "
                >
                  <i className="mr-2 text-sm fas fa-sign-out-alt "></i>
                  logout
                </button>
              </li>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
