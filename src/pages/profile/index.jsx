import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { BASE_URL } from "@/components/layoutsAdmin/apiConfig";
import { parseCookies } from "nookies";
import { useCookies } from "react-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function UserProfile() {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    nis: "",
    nisn: "",
    id_kelas: "",
    id_jurusan: "",
    detailAlamatSiswa: {
      alamat_lengkap: "",
      desa: "",
      dusun: "",
      kelurahan: "",
      kota_kabupaten: "",
      nama_jalan: "",
      provinsi: "JAWA BARAT",
      rt: "",
      rw: "",
      kecamatan: "",
    },
    jurusanInfo: {
      nama_jurusan: "",
    },
    kelasInfo: {
      nama_kelas: "",
    },
  });

  // State for Jawa Barat districts and subdistricts
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id_user, setID] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fallbackImageUrl = "/default-avatar.png";
  const [kelasOptions, setKelasOptions] = useState([]);
  const [jurusanOptions, setJurusanOptions] = useState([]);

  // Fetch Jawa Barat districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          "https://ibnux.github.io/data-indonesia/kabupaten/32.json"
        );
        setDistricts(response.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  // Fetch subdistricts when a district is selected
  useEffect(() => {
    const fetchSubdistricts = async () => {
      if (formData.detailAlamatSiswa.kota_kabupaten) {
        try {
          // Find the selected district's ID
          const selectedDist = districts.find(
            (dist) => dist.nama === formData.detailAlamatSiswa.kota_kabupaten
          );

          if (selectedDist) {
            const response = await axios.get(
              `https://ibnux.github.io/data-indonesia/kecamatan/${selectedDist.id}.json`
            );
            setSubdistricts(response.data);
          }
        } catch (error) {
          console.error("Error fetching subdistricts:", error);
        }
      }
    };

    fetchSubdistricts();
  }, [formData.detailAlamatSiswa.kota_kabupaten, districts]);

  // Add token validation helper
  const handleTokenError = () => {
    // Clear the expired token
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    router.push("/auth_user/login");
  };

  // Modify the fetchUserData function in useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/authsiswa/me`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });

        // Check if response indicates token is invalid/expired
        if (
          response.data?.message?.toLowerCase().includes("expired") ||
          response.data?.message?.toLowerCase().includes("invalid token")
        ) {
          handleTokenError();
          return;
        }

        const { id } = response.data.data;
        setID(id);

        const {
          nama_lengkap,
          email,
          nis,
          nisn,
          kelasInfo,
          jurusanInfo,
          detailAlamatSiswa,
        } = response.data.data;

        setFormData({
          nama_lengkap,
          email,
          nis,
          nisn,
          kelas: kelasInfo?.nama_kelas || "",
          jurusan: jurusanInfo?.nama_jurusan || "",
          detailAlamatSiswa: {
            ...detailAlamatSiswa,
            provinsi: "JAWA BARAT",
          },
          jurusanInfo: jurusanInfo || {},
          kelasInfo: kelasInfo || {},
        });
      } catch (error) {
        console.error("Error fetching user data:", error);

        // Check if error is due to unauthorized/expired token
        if (
          error.response?.status === 401 ||
          error.response?.status === 403 ||
          error.response?.data?.message?.toLowerCase().includes("expired") ||
          error.response?.data?.message?.toLowerCase().includes("invalid token")
        ) {
          handleTokenError();
          return;
        }

        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (cookies.token) {
      fetchUserData();
    } else {
      handleTokenError();
    }
  }, [cookies.token, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kelasRes = await axios.get(`${BASE_URL}/api/kelas`);
        const jurusanRes = await axios.get(`${BASE_URL}/api/jurusan`);

        console.log("Data Kelas:", kelasRes.data); // Cek data kelas dari API
        console.log("Data Jurusan:", jurusanRes.data); // Cek data jurusan dari API

        // Pastikan struktur data sesuai sebelum diset
        setKelasOptions(kelasRes.data || []);
        setJurusanOptions(jurusanRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "kelas" || name === "jurusan") {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    }

    if (name === "kelas" || name === "jurusan") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name.startsWith("detailAlamatSiswa.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        detailAlamatSiswa: {
          ...prevData.detailAlamatSiswa,
          [field]: value,
          ...(field === "kota_kabupaten" && { kecamatan: "" }), // Reset kecamatan jika kabupaten berubah
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ...formData.detailAlamatSiswa,
      };
      delete payload.detailAlamatSiswa;

      const response = await axios.patch(
        `${BASE_URL}/api/siswa/${id_user}`,
        payload,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );

      // Check response for token expiration
      if (
        response.data?.message?.toLowerCase().includes("expired") ||
        response.data?.message?.toLowerCase().includes("invalid token")
      ) {
        handleTokenError();
        return;
      }

      Swal.fire({
        title: "Berhasil!",
        text: "Data telah disimpan.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white px-4 py-2 rounded",
        },
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      // Check if error is due to unauthorized/expired token
      if (
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.data?.message?.toLowerCase().includes("expired") ||
        error.response?.data?.message?.toLowerCase().includes("invalid token")
      ) {
        handleTokenError();
        return;
      }

      Swal.fire({
        title: "Gagal!",
        text: "Gagal memperbarui profil.",
        icon: "error",
        confirmButtonText: "OK",
      });
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
        <title>My Profile</title>
      </Head>
      <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
            <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
            <a
              href="#"
              className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full"
            >
              Public Profile
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
            >
              Account Settings
            </a>
            <a
              href="/"
              className="flex items-center px-3 py-3 my-10 font-semibold hover:text-indigo-900 hover:border rounded-full bg-slate-200"
            >
              Back Home
            </a>
          </div>
        </aside>
        <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div className="p-2 md:p-4">
            <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
              <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                Public Profile
              </h2>
              <div className="grid max-w-2xl mx-auto mt-8">
                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                  <Image
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
                    src={imageError ? fallbackImageUrl : "/images/profile.jpg"}
                    alt="Profile Picture"
                    width={160}
                    height={160}
                    onError={() => setImageError(true)}
                    priority
                  />
                  <div className="flex flex-col space-y-5 sm:ml-8">
                    <button className="py-3.5 px-7 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900">
                      Change picture
                    </button>
                    <button className="py-3.5 px-7 text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100">
                      Delete picture
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 sm:mt-14 text-[#202142]"
                >
                  {/* Data Pribadi */}
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">
                      NIS
                    </label>
                    <input
                      type="text"
                      name="nis"
                      value={formData.nis}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">
                      NISN
                    </label>
                    <input
                      type="text"
                      name="nisn"
                      value={formData.nisn}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">
                      Kelas
                    </label>
                    <select
                      name="kelas"
                      value={formData.kelas}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Pilih Kelas</option>
                      {kelasOptions.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.nama_kelas}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dropdown Jurusan */}
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">
                      Jurusan
                    </label>
                    <select
                      name="jurusan"
                      value={formData.jurusan}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Pilih Jurusan</option>
                      {jurusanOptions.map((jurusan) => (
                        <option key={jurusan.id} value={jurusan.id}>
                          {jurusan.nama_jurusan}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Data Alamat */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                      Alamat
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Alamat Lengkap
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.alamat_lengkap"
                          value={formData.detailAlamatSiswa.alamat_lengkap}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Provinsi (Hardcoded to Jawa Barat) */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Provinsi
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.provinsi"
                          value="JAWA BARAT"
                          readOnly
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Kabupaten/Kota Dropdown */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Kabupaten/Kota
                        </label>
                        <select
                          name="detailAlamatSiswa.kota_kabupaten"
                          value={formData.detailAlamatSiswa.kota_kabupaten}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Pilih Kabupaten/Kota</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.nama}>
                              {district.nama}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Kecamatan Dropdown */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Kecamatan
                        </label>
                        <select
                          name="detailAlamatSiswa.kecamatan"
                          value={formData.detailAlamatSiswa.kecamatan || ""}
                          onChange={handleChange}
                          disabled={!formData.detailAlamatSiswa.kota_kabupaten}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">
                            {formData.detailAlamatSiswa.kota_kabupaten
                              ? "Pilih Kecamatan"
                              : "Pilih Kabupaten/Kota Terlebih Dahulu"}
                          </option>
                          {subdistricts.map((subdistrict) => (
                            <option
                              key={subdistrict.id}
                              value={subdistrict.nama}
                            >
                              {subdistrict.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          RT
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.rt"
                          value={formData.detailAlamatSiswa.rt}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          RW
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.rw"
                          value={formData.detailAlamatSiswa.rw}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Desa
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.desa"
                          value={formData.detailAlamatSiswa.desa}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Dusun
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.dusun"
                          value={formData.detailAlamatSiswa.dusun}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Kelurahan
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.kelurahan"
                          value={formData.detailAlamatSiswa.kelurahan}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-indigo-900">
                          Nama Jalan
                        </label>
                        <input
                          type="text"
                          name="detailAlamatSiswa.nama_jalan"
                          value={formData.detailAlamatSiswa.nama_jalan}
                          onChange={handleChange}
                          className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  // If no token exists, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: "/auth_user/login",
        permanent: false,
      },
    };
  }

  // Optional: Verify token on server side
  try {
    // You can add an API call here to verify the token if needed
    return {
      props: { isLoggedIn: true },
    };
  } catch (error) {
    // If token verification fails, redirect to login
    return {
      redirect: {
        destination: "/auth_user/login",
        permanent: false,
      },
    };
  }
}
