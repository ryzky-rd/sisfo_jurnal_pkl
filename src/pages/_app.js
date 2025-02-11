import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import "@/styles/tailwind.css";
import Head from "next/head";
import ButtonWa from "@/components/elements/ButtonWa";
export default function App({ Component, pageProps, router }) {
    const isInsideAdmin = router.pathname.startsWith("/admin");
    const isInsidePelanggan = router.pathname.startsWith("/pelanggan");
    const isLoginPage = router.pathname === "/auth/login"; // Tambahkan kondisi untuk halaman login
    const isLoginUser = router.pathname === "/auth_user/login"; // Tambahkan kondisi untuk halaman login
    const isRegisUser = router.pathname === "/auth_user/register"; // Tambahkan kondisi untuk halaman login
    const isLoginPembimbing = router.pathname === "/auth_pembimbing/login"; // Tambahkan kondisi untuk halaman login

    if (isInsideAdmin || isInsidePelanggan || isLoginPage || isLoginUser || isRegisUser || isLoginPembimbing) {
        // Perbarui kondisi untuk mengembalikan hanya komponen
        return <Component {...pageProps }
        />;
    }

    // Jika tidak berada di dalam folder admin atau halaman login, tampilkan Navbar dan Footer
    return ( <
        div className = "overflow-x-hidden" >
        <
        Head >
        <
        title > SISFO Jurnal PKL < /title>{" "} <
        meta name = "description"
        content = "Sistem Informasi Jurnal PKL SMKN 1 KOTA CIREBON" /
        >
        <
        /Head>{" "} <
        NextTopLoader color = "#A8CF45" / >
        <
        Navbar / >
        <
        Component {...pageProps }
        /> <ButtonWa / >
        <
        Footer / >
        <
        /div>
    );
}