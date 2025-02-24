import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { BASE_URL } from "./layoutsAdmin/apiConfig";

const CekRole = () => {
  const [cookies] = useCookies(["token"]);
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDataRole = async () => {
      const token = cookies.token;

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };

      // Tentukan endpoint berdasarkan URL saat ini
      const currentUrl = window.location.href;
      const endpoint = router.pathname === "/pelanggan/invoice"
        ? `${BASE_URL}/api/authpelanggan/cekToken/`
        : `${BASE_URL}/api/auth/cekToken/`;


      try {
        const response = await axios.get(endpoint, config);

        if (response.status === 200) {
          setRole(response.data.id);
        } else {
          console.error("Unexpected response status:", response.status);
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
        router.push("/auth/login");
      }
    };

    fetchDataRole();
  }, [cookies.token, router]);

  return role;
};

export default CekRole;
