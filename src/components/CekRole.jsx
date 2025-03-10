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
          confirmButtonColor: "#dc2626", // Warna merah
        }).then(() => {
          router.push("/auth/login");
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const endpoint = `${BASE_URL}/api/auth/cekToken`;

      try {
        const response = await axios.get(endpoint, config);

        if (response.status === 200 && response.data.data) {
          setRole(response.data.data.id);
        } else {
          throw new Error("Invalid session");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        Swal.fire({
          title: "Session Expired",
          text: "Silakan login kembali sebagai pembimbing.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc2626", // Warna merah
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
