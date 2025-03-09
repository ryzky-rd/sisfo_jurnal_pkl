import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { BASE_URL } from "./layoutsAdmin/apiConfig";

const CekRole = () => {
  const [cookies] = useCookies(["token"]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDataRole = async () => {
      const token = cookies.token;

      if (!token) {
        Swal.fire({
          title: "Session Expired",
          text: "Silakan login kembali.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f59e0b", // Warna kuning (opsional)
        }).then(() => {
          router.push("/auth/login");
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };

      // Tentukan endpoint berdasarkan URL saat ini
      const endpoint = router.pathname ===  `${BASE_URL}/api/auth/cekToken/`;

      try {
        const response = await axios.get(endpoint, config);

        if (response.status === 200) {
          setRole(response.data.id);
        } else {
          console.error("Unexpected response status:", response.status);
          Swal.fire({
            title: "Session Invalid",
            text: "Silakan login kembali.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            router.push("/auth/login");
          });
        }
      } catch (error) {
        console.error("Error checking token:", error);
        Swal.fire({
          title: "Session Expired",
          text: "Silakan login kembali.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/auth/login");
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDataRole();
  }, [cookies.token, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return role;
};

export default CekRole;
