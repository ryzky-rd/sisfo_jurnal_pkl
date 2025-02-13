import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validasi email untuk tidak mengandung karakter $ dan %
    if (!email || !password) {
      setError("Email dan password harus diisi.");
      toast.error("Email dan password harus diisi!", {
        position: "top-right",
      });
      setSubmitted(false);
      return;
    }

    const invalidChars = /[$%]/;
    if (invalidChars.test(email)) {
      setError("Email tidak boleh mengandung karakter $ dan %.");
      toast.error("Email tidak boleh mengandung karakter $ dan %!", {
        position: "top-right",
      });
      setSubmitted(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/loginsiswa`, {
        email,
        password,
      });

      setCookie("token", response.data.token, { path: "/" }); // coba
      router.push("/");
    } catch (error) {
      // Perbaikan penanganan error
      if (error.response && error.response.status === 401) {
        setError("Email atau password salah!");
        toast.error("Email atau password salah!", {
          position: "top-right",
        });
      } else {
        setError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
        toast.error("Terjadi kesalahan pada server. Silakan coba lagi nanti.", {
          position: "top-right",
        });
      }
      setSubmitted(false);
    }
  };

  // Tambahkan useEffect untuk inisialisasi AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="h-screen w-full bg-gray-100 text-gray-900 flex justify-center overflow-hidden">
        <div className="w-full h-screen bg-white flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12" data-aos="fade-right">
            <div className="flex justify-center h-full">
              <div className="w-full max-w-md flex flex-col justify-center">
                <div className="flex justify-center">
                  <img src="/images/logo_hitam.png" className="h-36 -mt-8" />
                </div>
                <div className="-mt-6 flex flex-col items-center">
                  <div className="w-full flex-1">
                    <div className="my-12 border-b text-center">
                      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                        Login Ke SISFO Jurnal PKL
                      </div>
                    </div>

                    <div className="mx-auto max-w-xs">
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="relative">
                        <input
                          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-12 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                          ) : (
                            <AiOutlineEye className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <button
                        className="mt-5 tracking-wide font-semibold bg-green-400 text-white-500 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="8.5" cy="7" r="4" />
                          <path d="M20 8v6M23 11h-6" />
                        </svg>
                        <span className="ml-2">Sign In</span>
                      </button>
                      <p className="mt-4 text-sm text-center text-gray-600">
                        Belum punya akun?{" "}
                        <Link href="/auth_user/register" className="text-green-500 hover:text-green-700 font-semibold">
                          Daftar disini
                        </Link>
                      </p>
                      <p className="mt-6 text-xs text-gray-600 text-center">
                        I agree to abide by Cartesian Kinetics
                        <a href="#" className="border-b border-gray-500 border-dotted"> Terms of Service </a>
                        and its
                        <a href="#" className="border-b border-gray-500 border-dotted"> Privacy Policy </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-emerald-200 text-center hidden lg:flex" data-aos="fade-left">
            <div className="m-12 xl:m-0 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hiasan_login.png')" }}>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
