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
const Pembimbing = ({ isLoggedIn }) => {
  const [allPembimbing, setAllPembimbing] = useState([]); // State untuk menyimpan semua data pembimbing
  const router = useRouter();
  const [pembimbing, setPembimbing] = useState([]);
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
  // add data
  const [formData, setFormData] = useState({
    nama_pembimbing: "",
    nip: "",
    email: "",
    password: "",
    foto_pembimbing: null,
  });

  // update data
  const [updateData, setUpdateData] = useState({
    id: "",
    nama_pembimbing: "",
    nip: "",
    email: "",
    password: "",
  });


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/pembimbing`);
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setAllPembimbing(data);

      const filteredData = data.filter((item) =>
        item.nama_pembimbing.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      setPembimbing(paginatedData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / pageSize));
    } catch (error) {
      console.error("Error fetching data pembimbing:", error);
      setError(error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
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
  const showToastMessage = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
    });
  };

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const firstPage = Math.max(1, currentPage - 4); // Menghitung halaman pertama yang akan ditampilkan

  //   delete
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/pembimbing/${itemIdToDelete}`);
      if (response.status === 200) {
        showToastMessage("Data berhasil dihapus!");
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      showToastMessage("Gagal menghapus data", "error");
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
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("nama_pembimbing", formData.nama_pembimbing);
    formDataToSend.append("nip", formData.nip);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    
    // Pastikan foto_pembimbing ditambahkan jika ada
    if (formData.foto_pembimbing) {
        formDataToSend.append("foto_pembimbing", formData.foto_pembimbing);
    }

    try {
        const response = await axios.post(`${BASE_URL}/api/pembimbing`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data', // Pastikan header ini ada
            },
        });

        if (response.status === 200 || response.status === 201) {
            showToastMessage("Data pembimbing berhasil ditambahkan!");
            setShowModal(false);
            setFormData({
                nama_pembimbing: "",
                nip: "",
                email: "",
                password: "",
                foto_pembimbing: null,
            });
            fetchData();
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        showToastMessage(error.response?.data?.message || "Gagal mengirim data", "error");
    }
};

  // update data
  const handleEdit = (item) => {
    setUpdateData({
      id: item.id,
      nama_pembimbing: item.nama_pembimbing,
      nip: item.nip,
      email: item.email,
      password: item.password,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dataToSend = {
      nip: updateData.nip,
      nama_pembimbing: updateData.nama_pembimbing,
      email: updateData.email,
    };

    // Jika ada password baru, tambahkan ke data yang akan dikirim
    if (updateData.password) {
      dataToSend.password = updateData.password;
    }

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/pembimbing/${updateData.id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        showToastMessage("Data pembimbing berhasil diupdate!");
        setShowUpdateModal(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating data:", error);
      showToastMessage("Gagal mengupdate data", "error");
    }
  };

  // Jika pengguna belum login, arahkan kembali ke halaman login
  if (!isLoggedIn) {
    if (typeof window !== "undefined") {
      // Cek apakah kode sedang berjalan di sisi klien
      router.push("/auth/login"); // Mengarahkan pengguna kembali ke halaman login
    }
    return <p>Loading...</p>; // or display loading indicator
  }
  return (
    <>
      <Head>
        <title>Data Guru Pembimbing</title>
      </Head>
      <AdminLayout>
        <ToastContainer />

        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <input
            type="text"
            placeholder="Cari Guru Pembimbing..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="w-48 md:w-56 lg:w-72 rounded-xl border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <button
            onClick={toggleModal}
            className="flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-amber-400 hover:bg-amber-500"
          >
            <i className="fa-solid fa-plus"></i>
            Guru Pembimbing
          </button>
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
                        <th scope="col" className="px-6 py-4 lg:w-[10%]">NIP</th>
                        <th scope="col" className="px-6 py-4 lg:w-[30%]">Nama Guru Pembimbing</th>
                        <th scope="col" className="px-6 py-4 lg:w-[15%]">Email</th>
                        <th scope="col" className="px-6 py-4 lg:w-[20%]">Foto</th>
                        <th scope="col" className="px-6 py-4 lg:w-[15%]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pembimbing && pembimbing.length > 0 ? (
                        pembimbing.map((item) => (
                          <tr className="border-b dark:border-neutral-500" key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.nip || "NIP tidak tersedia"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.nama_pembimbing || "Nama tidak tersedia"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.email || "Email tidak tersedia"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.foto_pembimbing || "Foto tidak tersedia"}
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
                  {pembimbing && pembimbing.length > 0 ? (
                    pembimbing.map((item) => (
                      <div key={item.id} className="p-4 bg-white rounded-lg shadow">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-bold">Nama:</span>
                            <span>{item.nama_pembimbing || "Nama tidak tersedia"}</span>
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
                    <div className="p-4 text-center">
                      Data tidak tersedia
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 my-4">
                  <button
                    onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    Prev
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => (
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
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
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
                    Delete Guru Pembimbing
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
                  Add Guru Pembimbing
                </h1>
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="nama"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Guru Pembimbing
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama_pembimbing"
                    value={formData.nama_pembimbing}
                    onChange={handleChange}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama"
                    required
                  />

                  <label
                    htmlFor="nip"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    NIP
                  </label>
                  <input
                    type="text"
                    id="nip"
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="NIP"
                    required
                  />

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

                  <div>
                    <label
                      htmlFor="foto"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Foto
                    </label>
                    <input
                      type="file"
                      id="foto_pembimbing"
                      name="foto_pembimbing"
                      onChange={handleChange}
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
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
                  Update Guru Pembimbing
                </h1>
                <form onSubmit={handleUpdate}>
                  <label
                    for="name"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Guru Pembimbing
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama_pembimbing"
                    value={updateData.nama_pembimbing}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, nama_pembimbing: e.target.value })
                    }
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama"
                  />

                  <label
                    for="nip"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    NIP
                  </label>
                  <input
                    type="text"
                    id="nip"
                    name="nip"
                    value={updateData.nip}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, nip: e.target.value })
                    }
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="NIP"
                  />

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
                      Password (Kosongkan jika tidak ingin mengubah)
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
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
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
};

// middleware
export async function getServerSideProps(context) {
  // Mendapatkan cookies dari konteks
  const cookies = parseCookies(context);

  // Mengecek apakah token JWT ada di cookies
  const isLoggedIn = !!cookies.token;

  // Mengembalikan props untuk komponen Dashboard
  return {
    props: { isLoggedIn },
  };
}

export default Pembimbing;
