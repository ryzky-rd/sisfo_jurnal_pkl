import React, { useEffect } from "react";

// components
import AdminNavbar from "@/components/layoutsAdmin/AdminNavbar.js";
import HeaderStats from "@/components/layoutsAdmin/HeaderStats";
import FooterAdmin from "@/components/layoutsAdmin/FooterAdmin";
import Sidebar from "./sidebar";
import CekRolePembimbing from "@/components/CekRolePembimbing"; // Import CekRolePembimbing

export default function AdminLayout({ children }) {
  const role = CekRolePembimbing(); // Panggil CekRolePembimbing untuk cek akses

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <div className="bg-gray-800">
          {/* Header */}
          <HeaderStats />
        </div>
        <div className="w-full px-4 mx-auto -m-24 md:px-10">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
