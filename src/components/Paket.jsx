import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import LoadingLayanan from "./elements/LoadingLayanan";
import styles from "./Layanan.module.css"; // Import CSS module
import { BASE_URL } from "./layoutsAdmin/apiConfig";
import AOS from "aos"; // Tambahkan import AOS
import "aos/dist/aos.css"; // Tambahkan import CSS AOS

export default function Paket() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingPembimbingJurusan, setSettingPembimbimbingJurusan] =
    useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/setting-pembimbing-jurusan`
        );
        // console.log("respon : ", response.data.data);
        setSettingPembimbimbingJurusan(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="relative flex flex-col items-center justify-center lg:px-28">
          <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingLayanan key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="mt-10" data-aos="fade-up" data-aos-duration="800">
        <h1 className="font-extrabold text-3xl lg:text-3xl text-center text-gray-800">
          Daftar Guru Pembimbing
        </h1>
      </div>

      <div
        className="relative flex flex-col items-center px-6 justify-center mx-auto mt-4"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <span className="flex text-center text-gray-500">
          Daftar guru pembimbing untuk setiap jurusan yang siap membimbing Anda.
        </span>
      </div>

      <div className="relative flex flex-col items-center px-6 py-2 justify-center lg:px-24">
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3 xl:grid-cols-3 w-full">
          {settingPembimbingJurusan.map((item) => (
            <div
              className="shadow-lg rounded-lg overflow-hidden bg-white"
              key={item.id}
              data-aos="zoom-in"
              data-aos-duration="800"
            >
              <h2 className="flex justify-center font-bold h-16 py-4 bg-green-400 text-xl text-white">
                {item.jurusan.nama_jurusan}
              </h2>
              <div className="p-6">
                <h3 className="font-semibold mb-3">Guru Pembimbing:</h3>
                <ul className="space-y-2">
                  <li className="text-gray-600 border-b pb-2">
                    {item.pembimbing.nama_pembimbing}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
