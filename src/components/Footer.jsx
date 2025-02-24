import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { BASE_URL } from "../components/layoutsAdmin/apiConfig";
import Swal from "sweetalert2";

export default function Footer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setting, setSetting] = useState({
    nama_sekolah: "",
    alamat: "",
    email: "",
    wa: "",
    telp: "",
    url_gmaps: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/setting`);
        // Cek apakah data ada dan tidak kosong
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setSetting(response.data.data[0]);
        } else {
          // Jika data kosong, set state setting menjadi default atau kosong
          setSetting({
            nama_sekolah: "",
            alamat: "",
            email: "",
            wa: "",
            telp: "",
            url_gmaps: "",
          });
        }
      } catch (error) {
        console.error("Error fetching data setting:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePengisianJurnalClick = () => {
    const isLoggedIn = false; // Ganti dengan logika pengecekan login yang sesuai
    if (!isLoggedIn) {
      Swal.fire({
        title: "Akses Ditolak",
        text: "Anda harus login untuk mengakses halaman ini.",
        icon: "warning",
        confirmButtonText: "OK",
        showCloseButton: true,
        closeButtonHtml: '<span style="font-size: 30px;">&times;</span>',
      });
    } else {
      // Arahkan ke halaman pengisian jurnal
      window.location.href = "/pengisian_jurnal";
    }
  };

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#1f2937"
          fillOpacity="1"
          d="M0,128L34.3,138.7C68.6,149,137,171,206,202.7C274.3,235,343,277,411,272C480,267,549,213,617,176C685.7,139,754,117,823,122.7C891.4,128,960,160,1029,154.7C1097.1,149,1166,107,1234,106.7C1302.9,107,1371,149,1406,170.7L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
        ></path>
      </svg>

      <footer className="bg-gray-800">
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="grid grid-cols-1 gap-8 lg:col-span-2 md:grid-cols-2 ">
              <div>
                <p className="font-bold text-white text-lg">MENU</p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                  <Link href={"/"} className="hover:opacity-75">
                    {" "}
                    Home{" "}
                  </Link>
                  <Link
                    href="#"
                    onClick={handlePengisianJurnalClick}
                    className="hover:opacity-75"
                  >
                    {" "}
                    Pengisian Jurnal{" "}
                  </Link>
                </nav>
              </div>

              <div>
                <p className="font-bold text-white">Contact Us</p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                  {/* Validasi jika alamat tidak kosong */}
                  {setting.alamat && (
                    <p className="hover:opacity-75">{setting.alamat}</p>
                  )}
                  {/* Validasi jika email tidak kosong */}
                  {setting.email && (
                    <p className="hover:opacity-75"> Email: {setting.email}</p>
                  )}
                  {/* Validasi jika telp tidak kosong */}
                  {setting.telp && (
                    <p className="hover:opacity-75">
                      {" "}
                      Telp & Fax: {setting.telp}{" "}
                    </p>
                  )}
                </nav>
              </div>
            </div>

            {/* Menambahkan peta Google Maps menggunakan link embed */}
            <div>
              <p className="font-bold text-white">Lokasi Kami</p>
              <div className="mt-4">
                {/* Validasi jika url_gmaps tidak kosong */}
                {setting.url_gmaps ? (
                  <iframe
                    src={setting.url_gmaps}
                    className="w-full h-64"
                    title="Peta Lokasi Kami"
                  ></iframe>
                ) : (
                  <p className="text-white">Lokasi tidak tersedia</p>
                )}
              </div>
            </div>
          </div>
          <hr className="my-8 border-gray-100" />
          <p className="mt-8 text-xs text-center text-white">
            Copyright © 2025 SMK NEGERI 1 CIREBON - Amanah, Profesional dan
            Berprestasi
          </p>
        </div>
      </footer>
    </>
  );
}
