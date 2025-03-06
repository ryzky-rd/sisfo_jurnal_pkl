import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function Hero() {
  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="flex flex-col w-full px-auto lg:px-28 md:px-28 lg:flex-row lg:gap-12 py-24 bg-gray-100  lg:py-36 lg:min-h-screen">
        <div className="relative text-black flex flex-col max-w-3xl px-auto lg:text-left lg:items-start lg:max-w-none lg:mx-0 lg:flex-1 lg:w-1/">
          <h1 className="text-3xl text-center sm:mx-auto md:mx-28 font-bold leading-tight lg:text-5xl">
            PENDATAAN JURNAL PKL SMKN 1 KOTA CIREBON
          </h1>
          <h1 className="text-center md:mx-24 sm:mx-auto px-auto mt-8 mb-4 text-lg leading-tight">
            SISTEM PENDATAAN JURNAL YANG EFISIEN, AMAN, DAN TERINTEGRASI UNTUK MEMUDAHKAN SISWA DAN PEMBIMBING DALAM PROSES PKL
          </h1>
          <div className="flex justify-center mt-4 lg:mx-auto">
            <Link
              type="button"
              href={'/paket'}
              class="flex justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Daftar Guru Pembimbing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
