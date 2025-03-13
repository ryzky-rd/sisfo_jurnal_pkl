import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";
import { jwtDecode } from "jwt-decode";
import Head from "next/head";

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
  const [siswaData, setSiswaData] = useState([]);
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

      // Fetch data jurnal
      const jurnalResponse = await axios.get(`${BASE_URL}/api/jurnal`, {
        params: { id_pembimbing },
        headers: { Authorization: `Bearer ${token}` },
      });

      let jurnalData = Array.isArray(jurnalResponse.data)
        ? jurnalResponse.data
        : jurnalResponse.data.data;

      // Fetch data siswa
      const siswaResponse = await axios.get(`${BASE_URL}/api/siswa`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let siswaData = Array.isArray(siswaResponse.data)
        ? siswaResponse.data
        : siswaResponse.data.data;

      // Gabungkan data siswa dengan total kehadiran per bulan
      const combinedData = siswaData.map((siswa) => {
        const jurnalSiswa = jurnalData.filter(
          (jurnal) => jurnal.id_siswa === siswa.id
        );

        // Hitung total kehadiran per bulan
        const kehadiranPerBulan = {};
        jurnalSiswa.forEach((jurnal) => {
          const bulan = new Date(jurnal.tanggal_pengisian).getMonth() + 1;
          if (!kehadiranPerBulan[bulan]) {
            kehadiranPerBulan[bulan] = 0;
          }
          kehadiranPerBulan[bulan]++;
        });

        return {
          ...siswa,
          kehadiranPerBulan,
        };
      });

      setSiswaData(combinedData);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSiswa = siswaData.filter((item) => {
    const matchesSearch = searchTerm
      ? item.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSiswa.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSiswa.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                  {new Date(0, index).toLocaleString("id-ID", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="overflow-x-auto lg:overflow-x-hidden">
            <table className="min-w-full text-sm font-light text-left">
              <thead className="font-medium border-b">
                <tr>
                  <th className="px-6 py-4 text-center">Nama Siswa</th>
                  <th className="px-6 py-4 text-center">Kelas</th>
                  <th className="px-6 py-4 text-center">Jurusan</th>
                  <th className="px-6 py-4 text-center">Total Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {filteredSiswa.length > 0 ? (
                  filteredSiswa.map((item) => (
                    <tr className="border-b" key={item.id}>
                      <td className="px-6 py-4 text-center">
                        {item.nama_lengkap || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.kelasInfo ? item.kelasInfo.nama_kelas : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.jurusanInfo ? item.jurusanInfo.nama_jurusan : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {selectedMonth
                          ? item.kehadiranPerBulan[selectedMonth] !== undefined
                            ? item.kehadiranPerBulan[selectedMonth]
                            : "Tidak ada kehadiran"
                          : "Pilih bulan untuk melihat kehadiran"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Data tidak tersedia
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
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  return { props: { isLoggedIn: !!cookies.token } };
}