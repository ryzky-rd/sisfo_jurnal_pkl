import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Head from "next/head";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false); // State untuk melacak apakah formulir sudah dikirimkan
  const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol visibilitas password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Menandai bahwa formulir sudah dikirimkan

    if (!email || email.includes('%') || email.includes('$')) {
        setError("Email tidak boleh mengandung karakter % atau $.");
        toast.error("Email tidak boleh mengandung karakter % atau $.", {
            position: "top-right",
        });
        return;
    }
    if (!password) {
        toast.error("Password wajib diisi!", {
            position: "top-right",
        });
        return;
    }
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      
      // Tambahkan logging untuk debugging
      console.log('Response:', response.data);
      
      setCookie("token", response.data.token, { path: "/" });
      router.push("/admin/setting");
    } catch (error) {
      // Perbaikan error handling
      console.error("Login error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Email atau password salah!", {
          position: "top-right",
        });
      } else {
        toast.error("Terjadi kesalahan pada server", {
          position: "top-right",
        });
      }
    }
  };
  const showToastMessage = () => {
    toast.error("Email atau password salah !", {
      position: "top-right",
    });
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="h-screen w-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="w-full h-full bg-white flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="flex justify-center">
              <img src="/images/logo_hitam.png" className="h-36 -mt-4" />
            </div>
            <div className="-mt-6 flex flex-col items-center">
              <div className="w-full flex-1">
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Login Ke Admin Panel
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
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
                        <i className="fas fa-eye-slash text-gray-500"></i>
                      ) : (
                        <i className="fas fa-eye text-gray-500"></i>
                      )}
                    </button>
                  </div>
                  <button
                    className="mt-5 tracking-wide font-semibold bg-green-400 text-black w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    type="submit"
                  >
                    <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-2">Sign In</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-emerald-200 text-center hidden lg:flex">
            <div 
              className="m-12 xl:m-0 w-full h-full bg-contain bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('/images/hiasan_login.png')" }}
            >
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
