import AdminLayout from "../layouts";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function Add() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    setting_warna: "",
    wa: "",
    telp: "",
    email: "",
    profil_perusahaan: "",
    bidang_perusahaan: "",
    alamat: "",
    url_gmaps: "",
    foto: null,
    foto_cap: null,
    foto_ttd: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "foto" || key === "foto_cap" || key === "foto_ttd") {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        `${BASE_URL}/api/setting`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        router.push("/admin/setting");
      } else {
        console.error("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Setting</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="relative py-4">
            <Link href={"/admin/setting"} className="absolute right-4 top-10">
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer m text-end bg-orange-400 text-md">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link>
          </div>
          <form className="py-6 bg-white px-9" onSubmit={handleSubmit}>
            {["foto", "foto_cap", "foto_ttd"].map((field) => (
              <div className="mb-6" key={field}>
                <label className="mb-5 block text-base font-semibold text-[#07074D]">
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace("_", " ")}
                </label>
                <input
                  type="file"
                  name={field}
                  id={field}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  accept="image/*"
                />
              </div>
            ))}

            {/* Other form fields */}
            {[
              "setting_warna",
              "wa",
              "telp",
              "email",
              "profil_perusahaan",
              "bidang_perusahaan",
              "alamat",
              "url_gmaps",
            ].map((field) => (
              <div className="mb-5" key={field}>
                <label
                  htmlFor={field}
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace("_", " ")}
                </label>
                <textarea
                  name={field}
                  id={field}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            ))}

            <div>
              <button className="w-full px-8 py-3 text-base font-semibold text-center text-white rounded-md outline-none hover:shadow-form bg-blue-400 hover:bg-indigo-600 focus:bg-indigo-400">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
