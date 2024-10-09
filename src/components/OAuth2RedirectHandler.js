import React, { useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const code = new URL(window.location.href).searchParams.get("code");

function OAuth2RedirectHandler(props) {
  useEffect(() => {
    axios
      .get(`https://api.carefli.p-e.kr/kakao?code=${code}`)
      .then((response) => {
        console.log("API Response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return <Spinner />;
}

export default OAuth2RedirectHandler;
