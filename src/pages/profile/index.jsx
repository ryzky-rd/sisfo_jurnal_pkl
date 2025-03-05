// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Head from "next/head";
// import { BASE_URL } from "@/components/layoutsAdmin/apiConfig";
// import { parseCookies } from "nookies";
// import { useCookies } from "react-cookie";
// import axios from "axios";

// export default function UserProfile() {
//   const [cookies] = useCookies(["token"]); // Ambil token dari cookie
//   const [formData, setFormData] = useState({
//     nama_lengkap: "",
//     email: "",
//     nis: "",
//     nisn: "",
//     kelas: "",
//     jurusan: "",
//     detailAlamatSiswa: {
//       alamat_lengkap: "",
//       desa: "",
//       dusun: "",
//       kelurahan: "",
//       kota_kabupaten: "",
//       nama_jalan: "",
//       provinsi: "",
//       rt: "",
//       rw: "",
//     },
//     jurusanInfo: {
//       nama_jurusan: "",
//     },
//     kelasInfo: {
//       nama_kelas: "",
//     },
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageError, setImageError] = useState(false);
//   const fallbackImageUrl = "/default-avatar.png";

//   // Ambil data siswa dari backend menggunakan token
//   useEffect(() => {
//     const fetchUserData = async () => {
//       console.log("cek token :", cookies.token);

//       try {
//         const response = await axios.get(`${BASE_URL}/api/authsiswa/me`, {
//           headers: { Authorization: `Bearer ${cookies.token}` }, // Kirim token di header
//         });

//         console.log("cek data siswa", response.data);
//         const {
//           nama_lengkap,
//           email,
//           nis,
//           nisn,
//           kelasInfo,
//           jurusanInfo,
//           detailAlamatSiswa,
//         } = response.data.data;

//         setFormData({
//           nama_lengkap,
//           email,
//           nis,
//           nisn,
//           kelas: kelasInfo.nama_kelas,
//           jurusan: jurusanInfo.nama_jurusan,
//           detailAlamatSiswa,
//           jurusanInfo,
//           kelasInfo,
//         });
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (cookies.token) {
//       fetchUserData();
//     } else {
//       setError(new Error("No token found. Please login first."));
//       setLoading(false);
//     }
//   }, [cookies.token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Jika field yang diubah adalah bagian dari detailAlamatSiswa
//     if (name.startsWith("detailAlamatSiswa.")) {
//       const field = name.split(".")[1];
//       setFormData((prevData) => ({
//         ...prevData,
//         detailAlamatSiswa: {
//           ...prevData.detailAlamatSiswa,
//           [field]: value,
//         },
//       }));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Kirim data yang diubah ke backend
//       const response = await axios.patch(
//         `${BASE_URL}/api/siswa/profile`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${cookies.token}` },
//         }
//       );
//       console.log("Profile updated:", response.data);
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile.");
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <>
//       <Head>
//         <title>My Profile</title>
//       </Head>
//       <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
//         <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
//           <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
//             <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
//             <a
//               href="#"
//               className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full"
//             >
//               Public Profile
//             </a>
//             <a
//               href="#"
//               className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
//             >
//               Account Settings
//             </a>
//             <a
//               href="/"
//               className="flex items-center px-3 py-3 my-10 font-semibold hover:text-indigo-900 hover:border rounded-full bg-slate-200"
//             >
//               Back Home
//             </a>
//           </div>
//         </aside>
//         <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
//           <div className="p-2 md:p-4">
//             <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
//               <h2 className="pl-6 text-2xl font-bold sm:text-xl">
//                 Public Profile
//               </h2>
//               <div className="grid max-w-2xl mx-auto mt-8">
//                 <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
//                   <Image
//                     className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
//                     src={imageError ? fallbackImageUrl : "/images/profile.jpg"}
//                     alt="Profile Picture"
//                     width={160}
//                     height={160}
//                     onError={() => setImageError(true)}
//                     priority
//                   />
//                   <div className="flex flex-col space-y-5 sm:ml-8">
//                     <button className="py-3.5 px-7 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900">
//                       Change picture
//                     </button>
//                     <button className="py-3.5 px-7 text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100">
//                       Delete picture
//                     </button>
//                   </div>
//                 </div>
//                 <form
//                   onSubmit={handleSubmit}
//                   className="mt-8 sm:mt-14 text-[#202142]"
//                 >
//                   {/* Data Pribadi */}
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-medium text-indigo-900">
//                       Nama Lengkap
//                     </label>
//                     <input
//                       type="text"
//                       name="nama_lengkap"
//                       value={formData.nama_lengkap}
//                       onChange={handleChange}
//                       className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-medium text-indigo-900">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-medium text-indigo-900">
//                       NIS
//                     </label>
//                     <input
//                       type="text"
//                       name="nis"
//                       value={formData.nis}
//                       onChange={handleChange}
//                       className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-medium text-indigo-900">
//                       NISN
//                     </label>
//                     <input
//                       type="text"
//                       name="nisn"
//                       value={formData.nisn}
//                       onChange={handleChange}
//                       className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-medium text-indigo-900">
//                       Kelas
//                     </label>
//                     <input
//                       type="text"
//                       name="kelas"
//                       value={formData.kelas}
//                       onChange={handleChange}
//                       className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-medium text-indigo-900">
//                       Jurusan
//                     </label>
//                     <input
//                       type="text"
//                       name="jurusan"
//                       value={formData.jurusan}
//                       onChange={handleChange}
//                       className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>

//                   {/* Data Alamat */}
//                   <div className="mt-6">
//                     <h3 className="text-lg font-semibold text-indigo-900 mb-4">
//                       Alamat
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           Alamat Lengkap
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.alamat_lengkap"
//                           value={formData.detailAlamatSiswa.alamat_lengkap}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           Desa
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.desa"
//                           value={formData.detailAlamatSiswa.desa}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           Dusun
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.dusun"
//                           value={formData.detailAlamatSiswa.dusun}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           Kelurahan
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.kelurahan"
//                           value={formData.detailAlamatSiswa.kelurahan}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           Kota/Kabupaten
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.kota_kabupaten"
//                           value={formData.detailAlamatSiswa.kota_kabupaten}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           Provinsi
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.provinsi"
//                           value={formData.detailAlamatSiswa.provinsi}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           RT
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.rt"
//                           value={formData.detailAlamatSiswa.rt}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-indigo-900">
//                           RW
//                         </label>
//                         <input
//                           type="text"
//                           name="detailAlamatSiswa.rw"
//                           value={formData.detailAlamatSiswa.rw}
//                           onChange={handleChange}
//                           className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-end mt-6">
//                     <button
//                       type="submit"
//                       className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// export async function getServerSideProps(context) {
//   // Mendapatkan cookies dari konteks
//   const cookies = parseCookies(context);

//   // Mengecek apakah token JWT ada di cookies
//   const isLoggedIn = !!cookies.token;

//   // Mengembalikan props untuk komponen Dashboard
//   return {
//     props: { isLoggedIn },
//   };
// }

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { BASE_URL } from "@/components/layoutsAdmin/apiConfig";
import { parseCookies } from "nookies";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function UserProfile() {
  const [cookies] = useCookies(["token"]); // Ambil token dari cookie
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    nis: "",
    nisn: "",
    kelas: "",
    jurusan: "",
    detailAlamatSiswa: {
      alamat_lengkap: "",
      desa: "",
      dusun: "",
      kelurahan: "",
      kota_kabupaten: "",
      nama_jalan: "",
      provinsi: "",
      rt: "",
      rw: "",
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

  // State for selected district and subdistrict
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fallbackImageUrl = "/default-avatar.png";

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
      if (selectedDistrict) {
        try {
          const response = await axios.get(
            `https://ibnux.github.io/data-indonesia/kecamatan/${selectedDistrict}.json`
          );
          setSubdistricts(response.data);
          // Reset subdistrict when district changes
          setSelectedSubdistrict("");
        } catch (error) {
          console.error("Error fetching subdistricts:", error);
        }
      }
    };

    fetchSubdistricts();
  }, [selectedDistrict]);

  // Existing user data fetch effect
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("cek token :", cookies.token);

      try {
        const response = await axios.get(`${BASE_URL}/api/authsiswa/me`, {
          headers: { Authorization: `Bearer ${cookies.token}` }, // Kirim token di header
        });

        console.log("cek data siswa", response.data);
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
          kelas: kelasInfo.nama_kelas,
          jurusan: jurusanInfo.nama_jurusan,
          detailAlamatSiswa,
          jurusanInfo,
          kelasInfo,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (cookies.token) {
      fetchUserData();
    } else {
      setError(new Error("No token found. Please login first."));
      setLoading(false);
    }
  }, [cookies.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle region selections
    if (name === "detailAlamatSiswa.kota_kabupaten") {
      const selectedDist = districts.find(
        (dist) => dist.nama === value
      );
      setSelectedDistrict(selectedDist ? selectedDist.id : "");
    }

    // Jika field yang diubah adalah bagian dari detailAlamatSiswa
    if (name.startsWith("detailAlamatSiswa.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        detailAlamatSiswa: {
          ...prevData.detailAlamatSiswa,
          [field]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kirim data yang diubah ke backend
      const response = await axios.patch(
        `${BASE_URL}/api/siswa/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
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
                    <input
                      type="text"
                      name="kelas"
                      value={formData.kelas}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">
                      Jurusan
                    </label>
                    <input
                      type="text"
                      name="jurusan"
                      value={formData.jurusan}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
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
                        disabled={!selectedDistrict}
                        className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">
                          {selectedDistrict
                            ? "Pilih Kabupaten/Kota"
                            : "Pilih Provinsi Terlebih Dahulu"}
                        </option>
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
                        disabled={!selectedDistrict}
                        className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">
                          {selectedDistrict
                            ? "Pilih Kecamatan"
                            : "Pilih Kabupaten/Kota Terlebih Dahulu"}
                        </option>
                        {subdistricts.map((subdistrict) => (
                          <option key={subdistrict.id} value={subdistrict.nama}>
                            {subdistrict.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Existing submit button */}
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

{/* // Existing getServerSideProps remains the same */}
export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const isLoggedIn = !!cookies.token;

  return {
    props: { isLoggedIn },
  };
}