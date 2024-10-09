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
          const { isNewUser } = response.data;

          if (isNewUser) {
            console.log("first login", response.data);
            navigate('/mypage');  // 신규 사용자면 회원정보 등록 페이지로 이동
          } else {
            console.log("second login", response.data);
            navigate('/main');    // 기존 사용자면 인물 목록 페이지로 이동
            
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        }
        );
    };
    getToken();
  }, []);

  return <Spinner />;
}

export default OAuth2RedirectHandler;
