import React, { useState, useEffect } from "react";
import Head from "next/head";
import { BASE_URL } from "@/components/layoutsAdmin/apiConfig";
import Swal from 'sweetalert2';
import { useCookies } from "react-cookie";
import axios from "axios";

export default function UserProfile() {
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
    const fetchData = async () => {
      try {
        const pembimbingResponse = await fetch(`${BASE_URL}/api/pembimbing`);
        const pembimbingData = await pembimbingResponse.json();
        setPembimbings(pembimbingData.data);

        const perusahaanResponse = await fetch(`${BASE_URL}/api/perusahaan`);
        const perusahaanData = await perusahaanResponse.json();
        setPerusahaans(perusahaanData);

        const token = cookies.token;
        console.log("Token from cookies:", token);

        if (token) {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          console.log("Decoded Payload:", decodedPayload);
          setFormData((prevData) => ({
            ...prevData,
            id_siswa: decodedPayload.id,
          }));

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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cookies.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data before submission:", formData);
  
    try {
      const response = await fetch(`${BASE_URL}/api/jurnal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        throw new Error(errorResult.message || "Failed to create journal entry");
      }
  
      const result = await response.json();
      console.log("Journal entry created:", result);
  
      setFormData({
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

      await Swal.fire({
        title: 'Success!',
        text: 'Pengisian jurnal harian telah berhasil.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        showCloseButton: false,
      });

      window.location.reload();

    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
              <input
                type="date"
                name="tanggal_pengisian"
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Nama Pekerjaan</label>
              <input
                type="text"
                name="nama_pekerjaan"
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Deskripsi Pekerjaan</label>
              <input
                type="text"
                name="deskripsi_pekerjaan"
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>
            <input
              type="hidden"
              name="id_siswa"
              value={formData.id_siswa}
            />
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Pilih Pembimbing</label>
              <select
                name="id_pembimbing"
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select Pembimbing</option>
                {pembimbings.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama_pembimbing}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Pilih Perusahaan</label>
              <select
                name="id_perusahaan"
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select Perusahaan</option>
                {perusahaans.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama_perusahaan}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .input {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          border-radius: 0.5rem;
          outline: none;
          transition: border 0.2s;
        }
        .input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </>
  );
}
