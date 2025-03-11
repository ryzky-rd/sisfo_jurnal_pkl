import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function BackupData() {
  const router = useRouter();
  const [backupHistory, setBackupHistory] = useState([]);

  const handleBackup = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/backupdb`, {
        responseType: "blob",
      });

      // Tidak langsung mendownload file, hanya menyimpan histori
      const now = new Date();
      const backupEntry = {
        date: now.toLocaleDateString("id-ID"),
        time: now.toLocaleTimeString("id-ID"),
        url: window.URL.createObjectURL(new Blob([response.data])),
      };

      const savedHistory =
        JSON.parse(localStorage.getItem("backupHistory")) || [];
      const updatedHistory = [...savedHistory, backupEntry];

      setBackupHistory(updatedHistory);
      localStorage.setItem("backupHistory", JSON.stringify(updatedHistory));

      // Tampilkan notifikasi sukses
      toast.success("Backup berhasil disimpan!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error during backup:", error);
      toast.error("Backup gagal!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleClearHistory = () => {
    setBackupHistory([]);
    localStorage.removeItem("backupHistory");
    toast.info("Semua histori backup telah dihapus.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    // Memuat sejarah backup dari localStorage saat komponen dimuat
    const savedHistory =
      JSON.parse(localStorage.getItem("backupHistory")) || [];
    setBackupHistory(savedHistory);

    const checkBackupInterval = () => {
      const now = new Date();
      const lastBackupDate =
        savedHistory.length > 0
          ? new Date(
              `${savedHistory[savedHistory.length - 1].date} ${
                savedHistory[savedHistory.length - 1].time
              }`
            )
          : null;

      // Hanya lakukan backup otomatis jika sudah lewat 30 hari dari backup terakhir
      if (!lastBackupDate || now - lastBackupDate >= 2592000000) {
        // 2592000000ms = 30 hari
        handleBackup();
      }
    };

    // Panggil fungsi pengecekan setiap hari
    const intervalId = setInterval(checkBackupInterval, 86400000); // 86400000ms = 1 hari

    return () => clearInterval(intervalId); // Bersihkan interval ketika komponen dibongkar
  });

  return (
    <>
      <Head>
        <title>Backup Data</title>
      </Head>
      <AdminLayout>
        <ToastContainer />
        <div className="justify-center rounded-lg lg:-mt-40">
          <h3 className="text-center text-xl text-white font-semibold pb-6">
            Tekan Untuk Backup Data nya
          </h3>
          <div className="flex justify-center">
            <button
              className="bg-green-400 px-10 py-2 text-white rounded-xl"
              onClick={handleBackup}
            >
              Backup Manual
            </button>
          </div>
          <div className="flex justify-center pt-3 pb-8">
            <p className="text-center text-white text-lg font-semibold">
              Backup Automatis Setiap 30 Hari Sekali
            </p>
          </div>
        </div>
        <div className="py-8">
          <h4 className="text-center text-lg font-semibold">Histori Backup</h4>
          <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Tanggal Backup</th>
                <th className="border px-4 py-2">Jam Backup</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {backupHistory.map((entry, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">{entry.date}</td>
                  <td className="border px-4 py-2 text-center">{entry.time}</td>
                  <td className="border px-4 py-2 text-center">
                    <a
                      href={entry.url}
                      download={`backup-${entry.date}.sql`}
                      className="bg-green-400 rounded-xl px-4 py-1 text-white"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {backupHistory.length > 0 && (
            <div className="flex justify-center py-4">
              <button
                className="bg-red-500 px-10 py-2 text-white rounded-xl"
                onClick={handleClearHistory}
              >
                Hapus Semua Histori
              </button>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

