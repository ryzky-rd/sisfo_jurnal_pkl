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

export default function Jurusan() {
  const [allJurusan, setAllJurusan] = useState([]);
  const router = useRouter();
  const [jurusan, setJurusan] = useState([]);
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

      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      setTotalPages(totalPages);
      setTotalCount(filteredData.length);

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

      setJurusan(currentItems);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

        <div className="flex flex-col overflow-x-auto lg:overflow-x-hidden bg-white rounded-xl">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr className="text-center">
                      <th scope="col" className="px-6 py-4">Nama Jurusan</th>
                      <th scope="col" className="px-6 py-4">Deskripsi</th>
                      <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jurusan && jurusan.length > 0 ? (
                      jurusan.map((item) => (
                        <tr className="border-b dark:border-neutral-500 text-center" key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.nama_jurusan || "Nama tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.deskripsi_jurusan || "Deskripsi tidak tersedia"}
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
                        <td colSpan={3} className="text-center py-4">
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

        {/* Modal untuk delete, add, dan update */}
        {/* ... (kode modal tetap sama) ... */}
      </AdminLayout>
    </>
  );
}