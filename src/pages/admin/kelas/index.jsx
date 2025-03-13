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

export default function Kelas() {
  const [allKelas, setAllKelas] = useState([]);
  const router = useRouter();
  const [kelas, setKelas] = useState([]);
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
    nama_kelas: "",
  });

  // update data
  const [updateData, setUpdateData] = useState({
    id: "",
    nama_kelas: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/kelas`);
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setAllKelas(data);

      const filteredData = data.filter((item) =>
        item.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      setKelas(paginatedData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / pageSize));
    } catch (error) {
      console.error("Error fetching data kelas:", error);
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
        nama_kelas: formData.nama_kelas,
      };

      const response = await axios.post(`${BASE_URL}/api/kelas`, formDataToSend);

      if (response.status === 200 || response.status === 201) {
        toast.success("Data berhasil ditambahkan!");
        setShowModal(false);
        setFormData({
          nama_kelas: "",
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
      nama_kelas: item.nama_kelas,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nama_kelas: updateData.nama_kelas,
      };

      const response = await axios.patch(
        `${BASE_URL}/api/kelas/${updateData.id}`,
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
      const response = await fetch(`${BASE_URL}/api/kelas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setKelas(kelas.filter((item) => item.id !== id));
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
        <title>Data Kelas</title>
      </Head>
      <AdminLayout>
        <ToastContainer />

        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
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
        </div>

        <div className="flex flex-col overflow-x-auto lg:overflow-x-hidden bg-white rounded-xl">
          <div className="sm:-mx-6 lg:-mx-8 w-full">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">Nama Kelas</th>
                      <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kelas && kelas.length > 0 ? (
                      kelas.map((item) => (
                        <tr className="border-b dark:border-neutral-500" key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.nama_kelas || "Nama tidak tersedia"}
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
                        <td colSpan={2} className="text-center py-4">
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
                  Delete Kelas
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
                  Add Kelas
                </h1>
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="nama_kelas"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    id="nama_kelas"
                    name="nama_kelas"
                    value={formData.nama_kelas}
                    onChange={(e) => setFormData({ ...formData, nama_kelas: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama Kelas"
                    required
                  />

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
                  Update Kelas
                </h1>
                <form onSubmit={handleUpdate}>
                  <label
                    htmlFor="nama_kelas"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    id="nama_kelas"
                    name="nama_kelas"
                    value={updateData.nama_kelas}
                    onChange={(e) => setUpdateData({ ...updateData, nama_kelas: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama Kelas"
                  />

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
