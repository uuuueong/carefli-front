import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";

function OAuth2RedirectHandler(props) {
  const navigate = useNavigate();
  useEffect(() => {
    const getToken = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      axios
        .get(`https://api.carefli.p-e.kr/api/oauth2/kakao?code=${code}`)
        .then((response) => {
          console.log("API Response:", response.data);
          navigate("/main");
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    getToken();
  }, []);

  return <Spinner />;
}

export default OAuth2RedirectHandler;
