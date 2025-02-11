import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../layouts";
import axios from "axios";
import Head from "next/head";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Edit() {
  const router = useRouter();
  const id = 1;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    setting_warna: "",
    wa: "",
    telp: "",
    email: "",
    profil_perusahaan: "",
    bidang_perusahaan: "",
    url_gmaps: "",
    alamat: "",
    gambar: null,
    gambar_cap: null,
    gambar_ttd: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/setting/${id}`);
        // console.log("respons", response.data);

        const data = response.data;
        const {
          setting_warna,
          wa,
          telp,
          email,
          profil_perusahaan,
          bidang_perusahaan,
          alamat,
          url_gmaps,
          foto,
          foto_cap,
          foto_ttd,
        } = data;

        setFormData({
          setting_warna: setting_warna || "",
          wa: wa || "",
          telp: telp || "",
          email: email || "",
          profil_perusahaan: profil_perusahaan || "",
          bidang_perusahaan: bidang_perusahaan || "",
          alamat: alamat || "",
          url_gmaps: url_gmaps || "",
          gambar: foto || null,
          gambar_cap: foto_cap || null,
          gambar_ttd: foto_ttd || null,
        });
      } catch (error) {
        console.error("Error fetching data setting:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("setting_warna", formData.setting_warna);
      formDataToSend.append("wa", formData.wa);
      formDataToSend.append("telp", formData.telp);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("profil_perusahaan", formData.profil_perusahaan);
      formDataToSend.append("bidang_perusahaan", formData.bidang_perusahaan);
      formDataToSend.append("alamat", formData.alamat);
      formDataToSend.append("url_gmaps", formData.url_gmaps);

      // Hanya tambahkan gambar baru jika ada
      if (formData.gambar) {
        formDataToSend.append("foto", formData.gambar);
      }
      if (formData.gambar_cap) {
        formDataToSend.append("foto_cap", formData.gambar_cap);
      }
      if (formData.gambar_ttd) {
        formDataToSend.append("foto_ttd", formData.gambar_ttd);
      }

      const response = await axios.patch(
        `${BASE_URL}/api/setting/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        router.push("/admin/setting");
      } else {
        console.error("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Setting</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="relative py-3">
            {/* <Link href={"/admin/setting"} className="absolute right-4 top-10">
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer text-end bg-orange-400">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link> */}
          </div>
          <form className="py-6 bg-white px-9" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="mb-5 block text-base font-semibold text-[#07074D]">
                Foto
              </label>
              <input
                type="file"
                name="gambar"
                id="gambar"
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                accept="image/*"
              />
            </div>

            <div className="mb-6">
              <label className="mb-5 block text-base font-semibold text-[#07074D]">
                Foto Cap
              </label>
              <input
                type="file"
                name="gambar_cap"
                id="gambar_cap"
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                accept="image/*"
              />
            </div>

            <div className="mb-6">
              <label className="mb-5 block text-base font-semibold text-[#07074D]">
                Foto TTD
              </label>
              <input
                type="file"
                name="gambar_ttd"
                id="gambar_ttd"
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                accept="image/*"
              />
            </div>

            {[
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
