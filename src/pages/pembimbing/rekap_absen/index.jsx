import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";
import { jwtDecode } from "jwt-decode";
import Head from "next/head";
import Link from "next/link"; // Import Link dari Next.js

// Komponen Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-2 my-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-400"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === index + 1
              ? "bg-amber-400 hover:bg-amber-500 text-white"
              : "bg-gray-200 hover:bg-gray-400"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default function Rekap_absen() {
  const router = useRouter();
  const [jurnalData, setJurnalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token)
        throw new Error("Token tidak tersedia, silakan login kembali.");
      const decodedToken = jwtDecode(token);
      const id_pembimbing = decodedToken.id;
      if (!id_pembimbing)
        throw new Error("ID Pembimbing tidak ditemukan dalam token.");

      // Fetch data jurnal berdasarkan id_pembimbing
      const jurnalResponse = await axios.get(`${BASE_URL}/api/jurnal`, {
        params: { id_pembimbing },
        headers: { Authorization: `Bearer ${token}` },
      });

      let jurnalData = Array.isArray(jurnalResponse.data)
        ? jurnalResponse.data
        : jurnalResponse.data.data;

      // Fetch informasi siswa untuk setiap jurnal
      const siswaIds = [
        ...new Set(jurnalData.map((jurnal) => jurnal.id_siswa)),
      ];

      const siswaResponse = await axios.get(`${BASE_URL}/api/siswa`, {
        params: { ids: siswaIds.join(",") },
        headers: { Authorization: `Bearer ${token}` },
      });

      const siswaData = Array.isArray(siswaResponse.data)
        ? siswaResponse.data
        : siswaResponse.data.data;

      // Buat map untuk mempermudah lookup data siswa
      const siswaMap = {};
      siswaData.forEach((siswa) => {
        siswaMap[siswa.id] = siswa;
      });

      // Organize jurnal data by siswa
      const jurnalBySiswa = siswaIds.map((id_siswa) => {
        const siswaInfo = siswaMap[id_siswa] || {};
        const jurnalSiswa = jurnalData.filter(
          (jurnal) => jurnal.id_siswa === id_siswa
        );

        // Hitung total kehadiran per bulan
        const kehadiranPerBulan = {};
        jurnalSiswa.forEach((jurnal) => {
          const tanggal = new Date(jurnal.tanggal_pengisian);
          const bulan = tanggal.getMonth() + 1;
          if (!kehadiranPerBulan[bulan]) {
            kehadiranPerBulan[bulan] = 0;
          }
          kehadiranPerBulan[bulan]++;
        });

        return {
          id_siswa,
          nama_lengkap: siswaInfo.nama_lengkap || "-",
          kelas: siswaInfo.kelasInfo ? siswaInfo.kelasInfo.nama_kelas : "-",
          jurusan: siswaInfo.jurusanInfo
            ? siswaInfo.jurusanInfo.nama_jurusan
            : "-",
          kehadiranPerBulan,
          totalKehadiran: jurnalSiswa.length,
        };
      });

      setJurnalData(jurnalBySiswa);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJurnal = jurnalData.filter((item) => {
    const matchesSearch = searchTerm
      ? item.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredJurnal.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJurnal.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getMonthName = (monthNumber) => {
    return new Date(0, monthNumber - 1).toLocaleString("id-ID", {
      month: "long",
    });
  };

  return (
    <>
      <Head>
        <title>Rekap Kehadiran Siswa</title>
      </Head>
      <AdminLayout>
        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <input
            type="text"
            placeholder="Cari Siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 md:w-56 lg:w-72 rounded-xl border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-600 outline-none focus:border-blue-500 focus:shadow-md"
          />
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-48 md:w-56 lg:w-72 rounded-xl border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-600 outline-none focus:border-blue-500 focus:shadow-md"
            >
              <option value="">Pilih Bulan</option>
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {getMonthName(index + 1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Memuat data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="overflow-x-auto lg:overflow-x-hidden">
              <table className="min-w-full text-sm font-light text-left">
                <thead className="font-medium border-b">
                  <tr>
                    <th className="px-6 py-4 text-center">Nama Siswa</th>
                    <th className="px-6 py-4 text-center">Kelas</th>
                    <th className="px-6 py-4 text-center">Jurusan</th>
                    <th className="px-6 py-4 text-center">Total Kehadiran</th>
                    <th className="px-6 py-4 text-center">Aksi</th>{" "}
                    {/* Kolom baru untuk tombol action */}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr className="border-b" key={item.id_siswa}>
                        <td className="px-6 py-4 text-center">
                          {item.nama_lengkap}
                        </td>
                        <td className="px-6 py-4 text-center">{item.kelas}</td>
                        <td className="px-6 py-4 text-center">
                          {item.jurusan}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {selectedMonth
                            ? item.kehadiranPerBulan[selectedMonth] !==
                              undefined
                              ? item.kehadiranPerBulan[selectedMonth]
                              : "0"
                            : item.totalKehadiran}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/pembimbing/detail_jurnal?id_siswa=${item.id_siswa}`}
                          >
                            <button className="px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-500">
                              Lihat Detail
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        {searchTerm || selectedMonth
                          ? "Tidak ada data yang sesuai dengan filter"
                          : "Data tidak tersedia"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  return { props: { isLoggedIn: !!cookies.token } };
}
