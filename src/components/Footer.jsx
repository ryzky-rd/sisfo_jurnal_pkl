import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { BASE_URL } from "../components/layoutsAdmin/apiConfig";

export default function Footer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setting, setSetting] = useState(""); // State untuk menyimpan nomor WA

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/setting`);
        setSetting(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching data layanan:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                  <Link href={"/paket"} className="hover:opacity-75">
                    {" "}
                    Pengisian Jurnal{" "}
                  </Link>
                </nav>
              </div>

              <div>
                <p className="font-bold text-white">Contact Us</p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                  <p className="hover:opacity-75">
                    {" "}
                    Jl. Perjuangan By Pass Sunyaragi, Cirebon, Indonesia 45132
                  </p>
                  <p className="hover:opacity-75"> Email: info@smkn1-cirebon.sch.id</p>
                  <p className="hover:opacity-75"> Telp & Fax: +62-0231-480202 </p>
                </nav>
              </div>
            </div>

            {/* Menambahkan peta Google Maps menggunakan link embed */}
            <div>
              <p className="font-bold text-white">Lokasi Kami</p>
              <div className="mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.2830232659376!2d108.53415787338668!3d-6.735285965852508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1df0e55b2ed3%3A0x51cf481547b4b319!2sSMK%20Negeri%201%20Cirebon!5e0!3m2!1sid!2sid!4v1738553713562!5m2!1sid!2sid"
                  className="w-full h-64"
                  title="Peta Lokasi Kami" // Menambahkan judul bingkai
                ></iframe>
              </div>
            </div>
          </div>
          <hr className="my-8 border-gray-100" />
          <p className="mt-8 text-xs text-center text-white">
           Copyright © 2025 SMK NEGERI 1 CIREBON - Amanah, Profesional dan Berprestasi
          </p>
        </div>
      </footer>
    </>
  );
}
