import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nis, setNis] = useState("");
  const [foto, setFoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!username || !namaLengkap || !email || !password || !nis) {
      toast.error("Semua kolom harus diisi termasuk foto!");
      setSubmitted(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("nama_lengkap", namaLengkap);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("nis", nis);
      // formData.append("siswa_foto", foto);

      const response = await axios.post(`${BASE_URL}/api/siswa/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registrasi berhasil!");
      setTimeout(() => {
        router.push("/auth_user/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Terjadi kesalahan saat registrasi!");
      setSubmitted(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="h-screen w-screen overflow-hidden items-center flex justify-center">
        <div className="w-full h-full bg-white flex justify-center">
          <div
            className="flex-1 bg-cyan-100 text-center hidden md:flex"
            data-aos="fade-right"
          >
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/images/logo_regis.png')`,
              }}
            ></div>
          </div>
          <div
            className="w-full lg:w-1/2 xl:w-5/12 p-6 sm:p-12"
            data-aos="fade-left"
          >
            <div className="flex flex-col items-center">
              <div className="text-center">
                <h1 className="text-2xl xl:text-4xl font-extrabold text-black">
                  Pusat Daftar Akun
                </h1>
                <p className="text-[12px] text-gray-500">
                  Silakan masukkan detail Anda untuk membuat akun
                </p>
              </div>
              <div className="w-full flex-1 mt-8">
                <form
                  className="mx-auto max-w-xs flex flex-col gap-4"
                  onSubmit={handleSubmit}
                >
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Masukkan Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Masukkan Nama Lengkap"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="password"
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Masukkan NIS"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    required
                  />
                  {/* <div className="w-full">
                    <input
                      className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFoto(e.target.files[0])}
                      required
                    />
                  </div> */}
                  <button
                    type="submit"
                    className={`mt-5 tracking-wide font-semibold bg-cyan-400 text-black w-full py-4 rounded-lg hover:bg-cyan-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                      submitted ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={submitted}
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">
                      {submitted ? "Mendaftar..." : "Daftar"}
                    </span>
                  </button>
                  <p className=" text-sm text-gray-600 text-center">
                    Sudah Punya Akun?{" "}
                    <Link href="/auth_user/login">
                      <span className="text-cyan-500 hover:text-cyan-700 font-semibold">
                        Masuk
                      </span>
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
