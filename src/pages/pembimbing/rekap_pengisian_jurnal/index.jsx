import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auto } from "@popperjs/core";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";
import { jwtDecode } from "jwt-decode";

const Rekap_pengisian_jurnal = ({ isLoggedIn }) => {
  const router = useRouter();
  const [jurnal, setJurnal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token;
  
      if (!token) {
        throw new Error("Token tidak tersedia, silakan login kembali.");
      }
  
      // Decode token untuk mendapatkan id_pembimbing
      const decodedToken = jwtDecode(token);
      const id_pembimbing = decodedToken.id;
  
      if (!id_pembimbing) {
        throw new Error("ID Pembimbing tidak ditemukan dalam token.");
      }
  
      console.log("ID Pembimbing (sedang login):", id_pembimbing); // Debugging
  
      // Fetch data jurnal dengan filter berdasarkan id_pembimbing
      const response = await axios.get(`${BASE_URL}/api/jurnal`, {
        params: { id_pembimbing },
        headers: { Authorization: `Bearer ${token}` } // Kirim token juga jika diperlukan
      });
      
  
      console.log("Response dari API Jurnal:", response.data); // Debugging API Response
  
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data;
  
      // Filter ulang di frontend (jika API belum mendukung filter backend)
      const filteredData = data.filter(item => item.id_pembimbing === id_pembimbing);
  
      setJurnal(filteredData);
    } catch (error) {
      console.error("Error fetching data jurnal:", error);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const firstPage = Math.max(1, currentPage - 4);

  return (
    <>
      <Head>
        <title>Data Rekap Pengisian Jurnal</title>
      </Head>
      <AdminLayout>
        <ToastContainer />

        {/* <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <input
            type="text"
            placeholder="Cari Kelas..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="w-48 rounded-xl border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-amber-400 hover:bg-amber-500"
          >
            <i className="fa-solid fa-plus"></i>
            Kelas
          </button>
        </div> */}

        <div className="flex flex-col bg-white rounded-xl items-center lg:-mt-36 md:-mt-36">
          <div className="sm:-mx-6 lg:-mx-8 w-full">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto lg:overflow-x-hidden">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Tanggal Pengisian
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Nama Pekerjaan
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Deskripsi Pekerjaan
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Nama Siswa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jurnal && jurnal.length > 0 ? (
                      jurnal.map((item) => (
                        <tr
                          className="border-b dark:border-neutral-500"
                          key={item.id}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.tanggal_pengisian ||
                              "Tanggal pengisian tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.nama_pekerjaan ||
                              "Nama pekerjaan tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.deskripsi_pekerjaan ||
                              "Deskripsi pekerjaan tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.siswa ? item.siswa.nama_lengkap : "Nama siswa tidak tersedia"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 pt-8">
                          Data tidak tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const isLoggedIn = !!cookies.token;

  return {
    props: { isLoggedIn },
  };
}

export default Rekap_pengisian_jurnal;
