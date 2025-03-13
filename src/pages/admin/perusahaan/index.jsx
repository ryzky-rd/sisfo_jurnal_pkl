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

export default function Perusahaan() {
  const [allPerusahaan, setAllPerusahaan] = useState([]);
  const router = useRouter();
  const [perusahaan, setPerusahaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // add data
  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    bidang_perusahaan: "",
    alamat_perusahaan: "",
    pembimbing_perusahaan: "",
  });

  // update data
  const [updateData, setUpdateData] = useState({
    id: "",
    nama_perusahaan: "",
    bidang_perusahaan: "",
    alamat_perusahaan: "",
    pembimbing_perusahaan: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/perusahaan`);
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setAllPerusahaan(data);

      const filteredData = data.filter((item) =>
        item.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bidang_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alamat_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pembimbing_perusahaan.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      setTotalPages(totalPages);
      setTotalCount(filteredData.length);

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

      setPerusahaan(currentItems);
    } catch (error) {
      console.error("Error fetching data perusahaan:", error);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = {
        nama_perusahaan: formData.nama_perusahaan,
        bidang_perusahaan: formData.bidang_perusahaan,
        alamat_perusahaan: formData.alamat_perusahaan,
        pembimbing_perusahaan: formData.pembimbing_perusahaan,
      };

      const response = await axios.post(`${BASE_URL}/api/perusahaan`, formDataToSend);

      if (response.status === 200 || response.status === 201) {
        toast.success("Data berhasil ditambahkan!");
        setShowModal(false);
        setFormData({
          nama_perusahaan: "",
          bidang_perusahaan: "",
          alamat_perusahaan: "",
          pembimbing_perusahaan: "",
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
      nama_perusahaan: item.nama_perusahaan,
      bidang_perusahaan: item.bidang_perusahaan,
      alamat_perusahaan: item.alamat_perusahaan,
      pembimbing_perusahaan: item.pembimbing_perusahaan,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nama_perusahaan: updateData.nama_perusahaan,
        bidang_perusahaan: updateData.bidang_perusahaan,
        alamat_perusahaan: updateData.alamat_perusahaan,
        pembimbing_perusahaan: updateData.pembimbing_perusahaan,
      };

      const response = await axios.patch(
        `${BASE_URL}/api/perusahaan/${updateData.id}`,
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
      const response = await fetch(`${BASE_URL}/api/perusahaan/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setPerusahaan(perusahaan.filter((item) => item.id !== id));
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

  return (
    <>
      <Head>
        <title>Data Perusahaan</title>
      </Head>
      <AdminLayout>
        <ToastContainer />

        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <input
            type="text"
            placeholder="Cari Perusahaan..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="w-48 rounded-xl border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-amber-400 hover:bg-amber-500"
          >
            <i className="fa-solid fa-plus"></i>
            Perusahaan
          </button>
        </div>

        <div className="flex flex-col overflow-x-auto lg:overflow-x-hidden bg-white rounded-xl">
          <div className="sm:-mx-6 w-full">
            <div className="inline-block min-w-full py-2 sm:px-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr className="text-center">
                      <th scope="col" className="px-6 py-4">Nama Perusahaan</th>
                      <th scope="col" className="px-6 py-4">Bidang Perusahaan</th>
                      <th scope="col" className="px-6 py-4">Alamat Perusahaan</th>
                      <th scope="col" className="px-6 py-4">Pembimbing Perusahaan</th>
                      <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perusahaan && perusahaan.length > 0 ? (
                      perusahaan.map((item) => (
                        <tr className="border-b dark:border-neutral-500 text-center" key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.nama_perusahaan || "Nama tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.bidang_perusahaan || "Nama tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.alamat_perusahaan || "Nama tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.pembimbing_perusahaan || "Nama tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                        <td colSpan={5} className="text-center py-4">
                          Data tidak tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Tambahkan Pagination di sini */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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
                  Delete Perusahaan
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
                  Add Perusahaan
                </h1>
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="nama_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    id="nama_perusahaan"
                    name="nama_perusahaan"
                    value={formData.nama_perusahaan}
                    onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama Perusahaan"
                    required
                  />

                  <label
                    htmlFor="bidang_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Bidang Perusahaan
                  </label>
                  <input
                    type="text"
                    id="bidang_perusahaan"
                    name="bidang_perusahaan"
                    value={formData.bidang_perusahaan}
                    onChange={(e) => setFormData({ ...formData, bidang_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Bidang Perusahaan"
                    required
                  />

                  <label
                    htmlFor="alamat_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Alamat Perusahaan
                  </label>
                  <input
                    type="text"
                    id="alamat_perusahaan"
                    name="alamat_perusahaan"
                    value={formData.alamat_perusahaan}
                    onChange={(e) => setFormData({ ...formData, alamat_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Alamat Perusahaan"
                    required
                  />

                  <label
                    htmlFor="pembimbing_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Pembimbing Perusahaan
                  </label>
                  <input
                    type="text"
                    id="pembimbing_perusahaan"
                    name="pembimbing_perusahaan"
                    value={formData.pembimbing_perusahaan}
                    onChange={(e) => setFormData({ ...formData, pembimbing_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Pembimbing Perusahaan"
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
                  Update Perusahaan
                </h1>
                <form onSubmit={handleUpdate}>
                  <label
                    htmlFor="nama_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    id="nama_perusahaan"
                    name="nama_perusahaan"
                    value={updateData.nama_perusahaan}
                    onChange={(e) => setUpdateData({ ...updateData, nama_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Nama Perusahaan"
                  />

                  <label
                    htmlFor="bidang_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Bidang Perusahaan
                  </label>
                  <input
                    type="text"
                    id="bidang_perusahaan"
                    name="bidang_perusahaan"
                    value={updateData.bidang_perusahaan}
                    onChange={(e) => setUpdateData({ ...updateData, bidang_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Bidang Perusahaan"
                  />

                  <label
                    htmlFor="alamat_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Alamat Perusahaan
                  </label>
                  <input
                    type="text"
                    id="alamat_perusahaan"
                    name="alamat_perusahaan"
                    value={updateData.alamat_perusahaan}
                    onChange={(e) => setUpdateData({ ...updateData, alamat_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Alamat Perusahaan"
                  />

                  <label
                    htmlFor="pembimbing_perusahaan"
                    className="text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Pembimbing Perusahaan
                  </label>
                  <input
                    type="text"
                    id="pembimbing_perusahaan"
                    name="pembimbing_perusahaan"
                    value={updateData.pembimbing_perusahaan}
                    onChange={(e) => setUpdateData({ ...updateData, pembimbing_perusahaan: e.target.value })}
                    className="flex items-center w-full h-10 pl-3 mt-2 mb-3 text-sm font-normal text-gray-600 border border-gray-300 rounded focus:outline-none focus:border focus:border-indigo-700"
                    placeholder="Pembimbing Perusahaan"
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

