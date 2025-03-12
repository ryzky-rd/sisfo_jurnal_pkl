import AdminLayout from "../layouts";
import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auto } from "@popperjs/core";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";
export default function Siswa() {
  const [allSiswa, setAllSiswa] = useState([]); // State untuk menyimpan semua data
  const router = useRouter();
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  // add data
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nis: null,
    nisn: null,
    id_kelas: "",
    id_jurusan: "",
    email: "",
    password: "",
  });

  // update data
  const [updateData, setUpdateData] = useState({
    id: "",
    nama_lengkap: "",
    nis: null,
    nisn: null,
    id_kelas: "",
    id_jurusan: "",
    email: "",
    password: "",
  });

  const [kelasList, setKelasList] = useState([]); // Tambahkan state untuk daftar kelas
  const [jurusanList, setJurusanList] = useState([]); // Tambahkan state untuk daftar jurusan

  const [pembimbings, setPembimbings] = useState([]);
  const [perusahaans, setPerusahaans] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/siswa`);
      // Pastikan response.data adalah array
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      setAllSiswa(data);

      const filteredData = data.filter((item) =>
        item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      setSiswa(paginatedData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / pageSize));
    } catch (error) {
      console.error("Error fetching data siswa:", error);
      setError(error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile); // Langsung upload setelah pilih file
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file Excel terlebih dahulu!");
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(sheet);

      // Konversi data agar sesuai dengan format backend
      const formattedData = rawData.map((row) => ({
        nama_lengkap: row.nama || row.Nama || "",
        email: row.email || row.Email || "",
        password: row.password || row.Password || "",
      }));

      console.log("Data yang dikirim ke backend:", formattedData); // Debugging

      try {
        const response = await axios.post(
          "/api/siswa/excelsiswa",
          formattedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("tes: ", response.data)

        alert(response.data.message);
      } catch (error) {
        console.error("Error mengirim data:", error);
        alert("Gagal mengunggah data.");
      }
    };
  };

  // kondisi search
  useEffect(() => {
    fetchData(); // Pastikan fetchData dipanggil saat currentPage atau searchTerm berubah
  }, [currentPage, searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian dilakukan
  };

  //   toast
  const showToastMessage = (message) => {
    toast.success(message, {
      position: "top-right",
    });
  };

  // Tambahkan fungsi untuk mengambil data kelas
  const fetchKelas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/kelas`);
      setKelasList(response.data);
    } catch (error) {
      console.error("Error fetching kelas:", error);
    }
  };

  // Panggil fetchKelas saat komponen dimount
  useEffect(() => {
    fetchKelas();
  }, []);

  // Tambahkan fungsi untuk mengambil data jurusan
  const fetchJurusan = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/jurusan`);
      setJurusanList(response.data);
    } catch (error) {
      console.error("Error fetching jurusan:", error);
    }
  };

  // Panggil fetchJurusan saat komponen dimount
  useEffect(() => {
    fetchJurusan();
  }, []);

  const getKelasName = (id) => {
    const kelas = kelasList.find((k) => k.id === id);
    return kelas ? kelas.nama_kelas : "Kelas tidak tersedia";
  };

  const getJurusanName = (id) => {
    const jurusan = jurusanList.find((j) => j.id === id);
    return jurusan ? jurusan.nama_jurusan : "Jurusan tidak tersedia";
  };

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const firstPage = Math.max(1, currentPage - 4); // Menghitung halaman pertama yang akan ditampilkan

  //   delete
  const handleDelete = async () => {
    const id = itemIdToDelete;
    try {
      const response = await fetch(`${BASE_URL}/api/siswa/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setSiswa(siswa.filter((item) => item.id !== id));
      showToastMessage("Data berhasil dihapus!");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };
  const toggleModalDelete = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  //   add data
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = {
        nama_lengkap: formData.nama || formData.nama_lengkap,
        nis: null,
        nisn: null,
        id_kelas: parseInt(formData.id_kelas),
        id_jurusan: parseInt(formData.id_jurusan),
        email: formData.email,
        password: formData.password,
      };

      console.log("Data yang dikirim:", formDataToSend);

      const response = await axios.post(
        `${BASE_URL}/api/siswa`,
        formDataToSend
      );

      if (response.status === 200 || response.status === 201) {
        showToastMessage("Data berhasil ditambahkan!");
        setShowModal(false);
        setFormData({
          nama_lengkap: "",
          nis: null,
          nisn: null,
          id_kelas: "",
          id_jurusan: "",
          email: "",
          password: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Gagal mengirim data");
    }
  };

  // update data
  const handleEdit = (item) => {
    setUpdateData({
      id: item.id,
      nama_lengkap: item.nama_lengkap,
      nis: item.nis,
      nisn: item.nisn,
      id_kelas: item.id_kelas,
      id_jurusan: item.id_jurusan,
      email: item.email,
      password: item.password,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nama_lengkap: updateData.nama_lengkap,
        nis: updateData.nis,
        nisn: updateData.nisn,
        id_kelas: parseInt(updateData.id_kelas),
        id_jurusan: parseInt(updateData.id_jurusan),
        email: updateData.email,
        password: updateData.password,
      };

      // Ubah dari PUT ke PATCH
      const response = await axios.patch(
        `${BASE_URL}/api/siswa/${updateData.id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        showToastMessage("Data berhasil diupdate!");
        setShowUpdateModal(false);
        fetchData(); // Refresh data setelah update
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error(
        error.response?.data?.message ||
          "Gagal mengupdate data. Silakan coba lagi."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pembimbingResponse = await fetch(`${BASE_URL}/api/pembimbing`);
        const pembimbingData = await pembimbingResponse.json();
        setPembimbings(pembimbingData.data);

        const perusahaanResponse = await fetch(`${BASE_URL}/api/perusahaan`);
        const perusahaanData = await perusahaanResponse.json();
        setPerusahaans(perusahaanData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Data Siswa</title>
      </Head>
      <AdminLayout>
        <ToastContainer />

        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <div>
            <input
              type="text"
              placeholder="Cari Siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 md:w-56 lg:w-72 rounded-xl border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="flex ">
            <button
              onClick={toggleModal}
              className="flex items-center px-4 mx-4 py-2 text-white rounded-md shadow-sm bg-amber-400 hover:bg-amber-500"
            >
              <i className="fa-solid fa-plus"></i>
              Siswa
            </button>

            {/* Input file disembunyikan */}
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* Button untuk membuka input file */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()} // Klik otomatis input file
              className="flex items-center px-4 py-2 text-white rounded-md shadow-sm bg-amber-400 hover:bg-amber-500"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Tambah Lewat Excel
            </button>
          </div>
        </div>

        <div className="flex flex-col bg-white rounded-xl">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto lg:overflow-x-hidden">
                {/* Tampilan desktop */}
                <div className="hidden md:block">
                  <table className="min-w-full text-sm font-light text-left">
                    <thead className="font-medium border-b dark:border-neutral-500">
                      <tr>
                        <th scope="col" className="px-6 py-4 lg:w-[20%]">
                          Nama Lengkap
                        </th>
                        <th scope="col" className="px-6 py-4 lg:w-[10%]">
                          Kelas
                        </th>
                        <th scope="col" className="px-6 py-4 lg:w-[15%]">
                          Jurusan
                        </th>
                        <th scope="col" className="px-6 py-4 lg:w-[20%]">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-4 lg:w-[15%]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {siswa && siswa.length > 0 ? (
                        siswa.map((item) => (
                          <tr
                            className="border-b dark:border-neutral-500"
                            key={item.id}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.nama_lengkap || "Nama tidak tersedia"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getKelasName(item.id_kelas)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getJurusanName(item.id_jurusan)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.email || "Email tidak tersedia"}
                            </td>
                            <td className="flex items-center gap-1 px-6 py-4 whitespace-nowrap">
                              {/* Tombol update */}
                              <button onClick={() => handleEdit(item)}>
                                <div
                                  className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-amber-400 hover:bg-amber-500"
                                  aria-label="edit"
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </div>
                              </button>

                              {/* Tombol delete */}
                              <button
                                onClick={() => {
                                  toggleModalDelete();
                                  setItemIdToDelete(item.id);
                                }}
                                className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-amber-400 hover:bg-amber-500"
                                aria-label="delete"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            Data tidak tersedia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Tampilan mobile */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {siswa && siswa.length > 0 ? (
                    siswa.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white rounded-lg shadow"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-bold">Nama:</span>
                            <span>
                              {item.nama_lengkap || "Nama tidak tersedia"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold">Kelas:</span>
                            <span>{getKelasName(item.id_kelas)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold">Jurusan:</span>
                            <span>{getJurusanName(item.id_jurusan)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold">Email:</span>
                            <span>{item.email || "Email tidak tersedia"}</span>
                          </div>
                          <div className="flex justify-center gap-2 mt-4">
                            <button
                              onClick={() => handleEdit(item)}
                              className="px-4 py-2 text-white rounded-full bg-amber-400 hover:bg-amber-500"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              onClick={() => {
                                toggleModalDelete();
                                setItemIdToDelete(item.id);
                              }}
                              className="px-4 py-2 text-white rounded-full bg-amber-400 hover:bg-amber-500"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">Data tidak tersedia</div>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 my-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    Prev
                  </button>
                  <div className="flex gap-1">
                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(firstPage + index)}
                          className={`mx-1 px-3 py-1 text-sm rounded-md ${
                            currentPage === firstPage + index
                              ? "bg-amber-400 hover:bg-amber-500 text-white"
                              : "bg-gray-200 hover:bg-gray-400"
                          }`}
                        >
                          {firstPage + index}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        Math.min(prevPage + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal delete */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="relative w-full max-w-md transition transform bg-white rounded-lg shadow-xl">
              <div className="px-4 py-5 sm:px-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Delete Siswa
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    Apakah Anda yakin ingin menghapus data ini?
                  </p>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* modal add */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <div
              role="alert"
              className="container w-11/12 max-w-lg mx-auto md:w-2/3"
            >
              <div className="relative px-5 py-8 bg-white border border-gray-400 rounded shadow-md md:px-10">
                <h1 className="mb-4 font-bold leading-tight tracking-normal text-gray-800 font-lg">
                  Add Siswa
                </h1>
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="nama"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama"
                    required
                  />

                  <div>
                    <label
                      htmlFor="id_kelas"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Kelas
                    </label>
                    <select
                      id="id_kelas"
                      name="id_kelas"
                      value={formData.id_kelas}
                      onChange={handleChange}
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      {kelasList.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.nama_kelas}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="id_jurusan"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Jurusan
                    </label>
                    <select
                      id="id_jurusan"
                      name="id_jurusan"
                      value={formData.id_jurusan}
                      onChange={handleChange}
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      required
                    >
                      <option value="">Pilih Jurusan</option>
                      {jurusanList.map((jurusan) => (
                        <option key={jurusan.id} value={jurusan.id}>
                          {jurusan.nama_jurusan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-start w-full">
                    <button
                      type="submit"
                      className="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-indigo-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 hover:bg-indigo-600"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="px-8 py-2 ml-3 text-sm text-gray-600 transition duration-150 ease-in-out bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 hover:border-gray-400 hover:bg-gray-300"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                <button
                  type="button"
                  className="absolute top-0 right-0 mt-4 mr-5 text-gray-400 transition duration-150 ease-in-out rounded cursor-pointer hover:text-gray-600 focus:ring-2 focus:outline-none focus:ring-gray-600"
                  onClick={() => setShowModal(false)}
                  aria-label="close modal"
                  role="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-x"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* modal update */}
        {showUpdateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <div
              role="alert"
              className="container w-11/12 max-w-lg mx-auto mt-5 mb-5 md:w-2/3"
            >
              <div className="relative px-5 py-8 bg-white border border-gray-400 rounded shadow-md md:px-10">
                <h1 className="mb-4 font-bold leading-tight tracking-normal text-gray-800 font-lg">
                  Update Siswa
                </h1>
                <form onSubmit={handleUpdate}>
                  <label
                    for="name"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={updateData.nama_lengkap}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        nama_lengkap: e.target.value,
                      })
                    }
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama"
                  />

                  <div>
                    <label
                      for="name"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Kelas
                    </label>
                    <select
                      id="id_kelas"
                      name="id_kelas"
                      value={updateData.id_kelas}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          id_kelas: e.target.value,
                        })
                      }
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    >
                      <option value="">Pilih Kelas</option>
                      {kelasList.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.nama_kelas}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      for="name"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Jurusan
                    </label>
                    <select
                      id="id_jurusan"
                      name="id_jurusan"
                      value={updateData.id_jurusan}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          id_jurusan: e.target.value,
                        })
                      }
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    >
                      <option value="">Pilih Jurusan</option>
                      {jurusanList.map((jurusan) => (
                        <option key={jurusan.id} value={jurusan.id}>
                          {jurusan.nama_jurusan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      for="name"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={updateData.email}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, email: e.target.value })
                      }
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <label
                      for="name"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={updateData.password}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          password: e.target.value,
                        })
                      }
                      className="flex items-center w-full h-10 pl-3 mt-2 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      placeholder="Password"
                    />
                  </div>

                  <div className="flex items-center justify-start w-full">
                    <button
                      type="submit"
                      className="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-indigo-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 hover:bg-indigo-600"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="px-8 py-2 ml-3 text-sm text-gray-600 transition duration-150 ease-in-out bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 hover:border-gray-400 hover:bg-gray-300"
                      onClick={() => setShowUpdateModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                <button
                  type="button"
                  className="absolute top-0 right-0 mt-4 mr-5 text-gray-400 transition duration-150 ease-in-out rounded cursor-pointer hover:text-gray-600 focus:ring-2 focus:outline-none focus:ring-gray-600"
                  onClick={() => setShowUpdateModal(false)}
                  aria-label="close modal"
                  role="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-x"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
