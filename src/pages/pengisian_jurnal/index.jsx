import React, { useState, useEffect } from "react";
import Head from "next/head";
import { BASE_URL } from "@/components/layoutsAdmin/apiConfig";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserProfile() {
  const router = useRouter();
  const [cookies] = useCookies(["token"]);
  const [formData, setFormData] = useState({
    tanggal_pengisian: "",
    nama_pekerjaan: "",
    deskripsi_pekerjaan: "",
    id_siswa: "",
    id_pembimbing: "",
    id_perusahaan: "",
    nama: "",
    email: "",
    nis: "",
    nisn: "",
    kelas: "",
    jurusan: "",
  });
  const [pembimbings, setPembimbings] = useState([]);
  const [perusahaans, setPerusahaans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = cookies.token;
    const now = new Date();
    const hour = now.getHours();

    if (!token) {
      Swal.fire({
        title: "Akses Ditolak!",
        text: "Silakan login terlebih dahulu.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      }).then(() => {
        router.push("/");
      });
      return;
    }

    if (hour < 8 || hour >= 15) {
      Swal.fire({
        title: "Waktu Tidak Diperbolehkan!",
        text: "Halaman ini hanya bisa diakses antara pukul 08:00 - 15:00.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#f44336",
      }).then(() => {
        router.push("/");
      });
      return;
    }

    const fetchData = async () => {
      try {
        // Dekode token untuk mendapatkan ID pengguna yang sedang login
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        
        // Set ID siswa ke state
        setFormData((prevData) => ({
          ...prevData,
          id_siswa: userId,
        }));

        // Ambil data pembimbing
        const pembimbingResponse = await fetch(`${BASE_URL}/api/pembimbing`);
        if (!pembimbingResponse.ok) {
          throw new Error("Gagal mengambil data pembimbing");
        }
        const pembimbingData = await pembimbingResponse.json();
        setPembimbings(pembimbingData.data);

        // Ambil data perusahaan
        const perusahaanResponse = await fetch(`${BASE_URL}/api/perusahaan`);
        if (!perusahaanResponse.ok) {
          throw new Error("Gagal mengambil data perusahaan");
        }
        const perusahaanData = await perusahaanResponse.json();
        setPerusahaans(perusahaanData);

        // Ambil data user
        const userResponse = await axios.get(`${BASE_URL}/api/authsiswa/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { nama, email, nis, nisn, kelas, jurusan } = userResponse.data;
        setFormData((prevData) => ({
          ...prevData,
          nama,
          email,
          nis,
          nisn,
          kelas,
          jurusan,
        }));

        // Cek apakah user sudah mengisi jurnal hari ini
        // Format tanggal hari ini YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        
        try {
          // Gunakan axios untuk penanganan error yang lebih baik
          const jurnalResponse = await axios.get(`${BASE_URL}/api/jurnal`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Filter jurnal berdasarkan ID siswa dan tanggal
          if (jurnalResponse.data && Array.isArray(jurnalResponse.data)) {
            const userJournals = jurnalResponse.data.filter(entry => 
              entry.id_siswa === userId
            );
            
            const hasSubmittedToday = userJournals.some(entry => {
              // Ambil tanggal saja dari timestamp
              const entryDate = new Date(entry.tanggal_pengisian).toISOString().split('T')[0];
              return entryDate === today;
            });

            if (hasSubmittedToday) {
              Swal.fire({
                title: "Pengisian Dibatasi!",
                text: "Anda sudah mengisi jurnal hari ini. Silakan kembali besok.",
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#3b82f6",
              }).then(() => {
                router.push("/");
              });
              return;
            }
          }
        } catch (jurnalError) {
          console.error("Error checking journal entries:", jurnalError);
          // Jangan blok pengguna jika tidak bisa memeriksa jurnal
          // Lanjutkan dengan normalisasi halaman
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cookies.token, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cek apakah user sudah mengisi jurnal hari ini sebelum submit
      const today = new Date().toISOString().split('T')[0];
      try {
        const jurnalCheckResponse = await axios.get(`${BASE_URL}/api/jurnal`, {
          headers: { Authorization: `Bearer ${cookies.token}` }
        });
        
        if (jurnalCheckResponse.data && Array.isArray(jurnalCheckResponse.data)) {
          const userJournals = jurnalCheckResponse.data.filter(entry => 
            entry.id_siswa === formData.id_siswa
          );
          
          const hasSubmittedToday = userJournals.some(entry => {
            const entryDate = new Date(entry.tanggal_pengisian).toISOString().split('T')[0];
            return entryDate === today;
          });

          if (hasSubmittedToday) {
            Swal.fire({
              title: "Pengisian Dibatasi!",
              text: "Anda sudah mengisi jurnal hari ini. Silakan kembali besok.",
              icon: "info",
              confirmButtonText: "OK",
              confirmButtonColor: "#3b82f6",
            });
            return;
          }
        }
      } catch (checkError) {
        console.error("Error checking journal before submit:", checkError);
        // Lanjutkan dengan submit, pengecekan gagal tidak menghentikan pengiriman
      }

      const response = await fetch(`${BASE_URL}/api/jurnal`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`
        },
        body: JSON.stringify({
          tanggal_pengisian: new Date(),
          nama_pekerjaan: formData.nama_pekerjaan,
          deskripsi_pekerjaan: formData.deskripsi_pekerjaan,
          id_siswa: formData.id_siswa,
          id_pembimbing: formData.id_pembimbing,
          id_perusahaan: formData.id_perusahaan,
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Gagal mengisi jurnal");
      }

      setFormData({
        ...formData,
        tanggal_pengisian: "",
        nama_pekerjaan: "",
        deskripsi_pekerjaan: "",
        id_pembimbing: "",
        id_perusahaan: "",
      });

      await Swal.fire({
        title: "Berhasil!",
        text: "Pengisian jurnal harian telah berhasil.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan saat mengisi jurnal.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#f44336",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Head>
        <title>Pengisian Jurnal PKL</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-6">Pengisian Jurnal PKL</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Tanggal Pengisian</label>
              <input type="date" name="tanggal_pengisian" onChange={handleChange} required className="input w-full" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Nama Pekerjaan</label>
              <input type="text" name="nama_pekerjaan" onChange={handleChange} required className="input w-full" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Deskripsi Pekerjaan</label>
              <input type="text" name="deskripsi_pekerjaan" onChange={handleChange} required className="input w-full" />
            </div>
            <input type="hidden" name="id_siswa" value={formData.id_siswa} />
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Pilih Pembimbing</label>
              <select name="id_pembimbing" onChange={handleChange} required className="input w-full">
                <option value="">Select Pembimbing</option>
                {pembimbings.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama_pembimbing}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Pilih Perusahaan</label>
              <select name="id_perusahaan" onChange={handleChange} required className="input w-full">
                <option value="">Select Perusahaan</option>
                {perusahaans.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama_perusahaan}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}