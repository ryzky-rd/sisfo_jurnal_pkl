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

export default function Jurusan() {
  const [allJurusan, setAllJurusan] = useState([]);
  const router = useRouter();
  const [jurusan, setJurusan] = useState([]);
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
    nama_jurusan: "",
    deskripsi_jurusan: "",
  });

  // update data
  const [updateData, setUpdateData] = useState({
    id: "",
    nama_jurusan: "",
    deskripsi_jurusan: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/jurusan`);
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setAllJurusan(data);

      const filteredData = data.filter((item) =>
        item.nama_jurusan.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      setJurusan(paginatedData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / pageSize));
    } catch (error) {
      console.error("Error fetching data jurusan:", error);
      setError(error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = {
        nama_jurusan: formData.nama_jurusan,
        deskripsi_jurusan: formData.deskripsi_jurusan,
      };

      const response = await axios.post(`${BASE_URL}/api/jurusan`, formDataToSend);

      if (response.status === 200 || response.status === 201) {
        toast.success("Data berhasil ditambahkan!");
        setShowModal(false);
        setFormData({
          nama_jurusan: "",
          deskripsi_jurusan: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Gagal mengirim data");
    }
  };

  const handleEdit = (item) => {
    setUpdateData({
      id: item.id,
      nama_jurusan: item.nama_jurusan,
      deskripsi_jurusan: item.deskripsi_jurusan,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nama_jurusan: updateData.nama_jurusan,
        deskripsi_jurusan: updateData.deskripsi_jurusan,
      };

      const response = await axios.patch(
        `${BASE_URL}/api/jurusan/${updateData.id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Data berhasil diupdate!");
        setShowUpdateModal(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error(
        error.response?.data?.message || 
        "Gagal mengupdate data. Silakan coba lagi."
      );
    }
  };

  const handleDelete = async () => {
    const id = itemIdToDelete;
    try {
      const response = await fetch(`${BASE_URL}/api/jurusan/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setJurusan(jurusan.filter((item) => item.id !== id));
      toast.success("Data berhasil dihapus!");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const firstPage = Math.max(1, currentPage - 4);

  return (
    <>
      <Head>
        <title>Data Jurusan</title>
      </Head>
      <AdminLayout>
        <ToastContainer />

        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <input
            type="text"
            placeholder="Cari Jurusan..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="w-48 rounded-xl border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-amber-400 hover:bg-amber-500"
          >
            <i className="fa-solid fa-plus"></i>
            Jurusan
          </button>
        </div>

        <div className="flex flex-col bg-white rounded-xl">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto lg:overflow-x-hidden">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">Nama Jurusan</th>
                      <th scope="col" className="px-6 py-4">Deskripsi</th>
                      <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jurusan && jurusan.length > 0 ? (
                      jurusan.map((item) => (
                        <tr className="border-b dark:border-neutral-500" key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.nama_jurusan || "Nama tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.deskripsi_jurusan || "Deskripsi tidak tersedia"}
                          </td>
                          <td className="flex items-center gap-1 px-6 py-4 whitespace-nowrap">
                            <button onClick={() => handleEdit(item)}>
                              <div
                                className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-amber-400 hover:bg-amber-500"
                                aria-label="edit"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteModal(true);
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
                        <td colSpan={3} className="text-center py-4">
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

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="relative w-full max-w-md transition transform bg-white rounded-lg shadow-xl">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Delete Jurusan
                </h3>
                <p className="max-w-2xl mt-1 text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus data ini?
                </p>
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

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <div
              role="alert"
              className="container w-11/12 max-w-lg mx-auto md:w-2/3"
            >
              <div className="relative px-5 py-8 bg-white border border-gray-400 rounded shadow-md md:px-10">
                <h1 className="mb-4 font-bold leading-tight tracking-normal text-gray-800 font-lg">
                  Add Jurusan
                </h1>
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="nama_jurusan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Jurusan
                  </label>
                  <input
                    type="text"
                    id="nama_jurusan"
                    name="nama_jurusan"
                    value={formData.nama_jurusan}
                    onChange={(e) => setFormData({ ...formData, nama_jurusan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama Jurusan"
                    required
                  />

                  <div>
                    <label
                      htmlFor="deskripsi_jurusan"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Deskripsi Jurusan
                    </label>
                    <input
                      type="text"
                      id="deskripsi_jurusan"
                      name="deskripsi_jurusan"
                      value={formData.deskripsi_jurusan}
                      onChange={(e) => setFormData({ ...formData, deskripsi_jurusan: e.target.value })}
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      placeholder="Deskripsi Jurusan"
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
              </div>
            </div>
          </div>
        )}

        {showUpdateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <div
              role="alert"
              className="container w-11/12 max-w-lg mx-auto mt-5 mb-5 md:w-2/3"
            >
              <div className="relative px-5 py-8 bg-white border border-gray-400 rounded shadow-md md:px-10">
                <h1 className="mb-4 font-bold leading-tight tracking-normal text-gray-800 font-lg">
                  Update Jurusan
                </h1>
                <form onSubmit={handleUpdate}>
                  <label
                    htmlFor="nama_jurusan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Jurusan
                  </label>
                  <input
                    type="text"
                    id="nama_jurusan"
                    name="nama_jurusan"
                    value={updateData.nama_jurusan}
                    onChange={(e) => setUpdateData({ ...updateData, nama_jurusan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama Jurusan"
                  />

                  <div>
                    <label
                      htmlFor="deskripsi_jurusan"
                      className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                    >
                      Deskripsi Jurusan
                    </label>
                    <input
                      type="text"
                      id="deskripsi_jurusan"
                      name="deskripsi_jurusan"
                      value={updateData.deskripsi_jurusan}
                      onChange={(e) => setUpdateData({ ...updateData, deskripsi_jurusan: e.target.value })}
                      className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                      placeholder="Deskripsi Jurusan"
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
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};
