import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";
import { jwtDecode } from "jwt-decode";
import Head from "next/head";

const Rekap_pengisian_jurnal = ({ isLoggedIn }) => {
  const router = useRouter();
  const [jurnal, setJurnal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

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

      const response = await axios.get(`${BASE_URL}/api/jurnal`, {
        params: { id_pembimbing },
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      data = data.filter((item) => item.id_pembimbing === id_pembimbing);
      setJurnal(data);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJurnal = jurnal.filter((item) => {
    const matchesSearch = searchTerm
      ? item.siswa?.nama_lengkap
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    const matchesMonth = selectedMonth
      ? new Date(item.tanggal_pengisian).getMonth() + 1 ===
        parseInt(selectedMonth)
      : true;
    return matchesSearch && matchesMonth;
  });

  return (
    <>
      <Head>
        <title>Rekap Pengisian Jurnal Siswa</title>
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
                  <th className="px-6 py-4 text-center">Tanggal Pengisian</th>
                  <th className="px-6 py-4 text-center">Nama Pekerjaan</th>
                  <th className="px-6 py-4 text-center">Deskripsi Pekerjaan</th>
                  <th className="px-6 py-4 text-center">Nama Siswa</th>
                  <th className="px-6 py-4 text-center">Kelas</th>
                  <th className="px-6 py-4 text-center">Jurusan</th>
                </tr>
              </thead>
              <tbody>
                {filteredJurnal.length > 0 ? (
                  filteredJurnal.map((item) => (
                    <tr className="border-b" key={item.id}>
                      <td className="px-6 py-4 text-center">
                        {item.tanggal_pengisian
                          ? new Date(item.tanggal_pengisian)
                              .toISOString()
                              .split("T")[0]
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.nama_pekerjaan || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.deskripsi_pekerjaan || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.siswa ? item.siswa.nama_lengkap : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.siswa?.kelasInfo
                          ? item.siswa.kelasInfo.nama_kelas
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.siswa?.jurusanInfo
                          ? item.siswa.jurusanInfo.nama_jurusan
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Data tidak tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  return { props: { isLoggedIn: !!cookies.token } };
}

export default Rekap_pengisian_jurnal;
