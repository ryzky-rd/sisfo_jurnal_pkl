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

export default function DetailJurnal() {
  const router = useRouter();
  const { id_siswa } = router.query; // Ambil id_siswa dari query parameter
  const [jurnal, setJurnal] = useState([]);
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

      // Fetch data jurnal berdasarkan id_siswa
      const response = await axios.get(`${BASE_URL}/api/jurnal`, {
        params: { id_siswa },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response dari API:", response.data);

      let data = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      // Pastikan `id_siswa` diformat sebagai angka
      const idSiswaInt = parseInt(id_siswa);

      // Perbaikan filter data
      data = data.filter((item) => parseInt(item.id_siswa) === idSiswaInt);

      console.log("Data jurnal setelah filter:", data);

      setJurnal(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_siswa) {
      fetchData();
    }
  }, [id_siswa]);

  const filteredJurnal = jurnal.filter((item) => {
    const matchesSearch = searchTerm
      ? item.nama_pekerjaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deskripsi_pekerjaan
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    const matchesMonth = selectedMonth
      ? new Date(item.tanggal_pengisian).getMonth() + 1 ===
        parseInt(selectedMonth)
      : true;
    return matchesSearch && matchesMonth;
  });

  const totalPages = Math.ceil(filteredJurnal.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJurnal.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Head>
        <title>Detail Jurnal Siswa</title>
      </Head>
      <AdminLayout>
        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <input
            type="text"
            placeholder="Cari Jurnal..."
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
          {loading ? (
            <div className="text-center py-8">
              <p>Memuat data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              <p>{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto lg:overflow-x-hidden">
              <table className="min-w-full text-sm font-light text-left">
                <thead className="font-medium border-b">
                  <tr>
                    <th className="px-6 py-4 text-center">Tanggal Pengisian</th>
                    <th className="px-6 py-4 text-center">Nama Siswa</th>
                    <th className="px-6 py-4 text-center">Nama Pekerjaan</th>
                    <th className="px-6 py-4 text-center">
                      Deskripsi Pekerjaan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr className="border-b" key={item.id}>
                        <td className="px-6 py-4 text-center">
                          {item.tanggal_pengisian
                            ? new Date(item.tanggal_pengisian)
                                .toISOString()
                                .split("T")[0]
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.siswa ? item.siswa.nama_lengkap : "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.nama_pekerjaan || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.deskripsi_pekerjaan || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        {loading ? "Memuat data..." : "Tidak ada data jurnal."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  return { props: { isLoggedIn: !!cookies.token } };
}
