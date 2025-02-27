import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Head from "next/head";
import { BASE_URL } from "@/components/layoutsAdmin/apiConfig";
import { useCookies } from "react-cookie";

export default function UserProfile() {
  const [formData, setFormData] = useState({
    firstName: 'Jane',
    lastName: 'Ferguson',
    email: '',
    profession: '',
    bio: '',
  });

  const [imageError, setImageError] = useState(false);

  const fallbackImageUrl = "/default-avatar.png";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <>
    <Head>
        <title>My Profile</title>
      </Head>
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
          <a href="#" className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full">
            Public Profile
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
            Account Settings
          </a>
          <a href="/" className="flex items-center px-3 py-3 my-10 font-semibold hover:text-indigo-900 hover:border rounded-full bg-slate-200">
            Back Home
          </a>
        </div>
      </aside>
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
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
              <form onSubmit={handleSubmit} className="mt-8 sm:mt-14 text-[#202142]">
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama-lengkap"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">NIS</label>
                  <input
                    type="text"
                    name="nis"
                    value={formData.nis}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">NISN</label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">Kelas</label>
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">Jurusan</label>
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">
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
