import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

function Kontak_Kami() {
  const [isOpenWcu, setIsOpenWcu] = useState(false);
  const [isOpenProfil, setIsOpenProfil] = useState(false);
  const wcuContentRef = useRef(null);
  const profilContentRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const isLaptop = window.innerWidth >= 1024;
    if (isLaptop) {
      setIsOpenWcu(true);
      setIsOpenProfil(true);
    }
  }, []);

  const toggleWcu = () => {
    setIsOpenWcu(!isOpenWcu);
  };

  const toggleProfil = () => {
    setIsOpenProfil(!isOpenProfil);
  };

  const getDropdownStyle = (isOpen, contentRef) => ({
    maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : "0px",
    overflow: "hidden",
    transition: "max-height 0.6s ease-in-out",
  });

  return (
    <div className="grid text-start px-auto mt-12">
      <div
        className="grid px-5 py-8 text-start lg:px-10"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <h3
          className="text-lg font-semibold flex items-center"
          onClick={toggleProfil}
          style={{ justifyContent: "space-between" }}
        >
          PROFIL KAMI
          <span>{isOpenProfil ? <FaChevronUp /> : <FaChevronDown />}</span>
        </h3>
        <div
          ref={profilContentRef}
          style={getDropdownStyle(isOpenProfil, profilContentRef)}
        >
          <p className="my-6">
            SMKN 1 KOTA CIREBON adalah sekolah menengah kejuruan yang
            berkomitmen untuk mencetak lulusan berkualitas, siap kerja, dan
            berdaya saing tinggi di dunia industri maupun wirausaha. Dengan
            pengalaman bertahun-tahun dalam dunia pendidikan, kami terus
            berinovasi dalam memberikan pembelajaran berbasis kompetensi yang
            sesuai dengan kebutuhan industri. Sebagai salah satu SMK unggulan di
            Kota Cirebon, kami memiliki berbagai jurusan yang relevan dengan
            perkembangan zaman, didukung oleh tenaga pendidik profesional, serta
            fasilitas yang lengkap untuk menunjang proses belajar mengajar. Kami
            berkomitmen untuk terus meningkatkan kualitas pendidikan dan
            mencetak lulusan yang siap menghadapi tantangan global dengan
            keterampilan, etika kerja, dan kreativitas yang tinggi. SMKN 1 Kota
            Cirebon, Tempat Membangun Masa Depan! 🚀🎓
          </p>
        </div>
      </div>
    </div>
  );
}

export default Kontak_Kami;
