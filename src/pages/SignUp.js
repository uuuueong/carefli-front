// SignUp.js
import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 import
import Kakao from "../components/\bKakao";
import logo from "../image/carefLi_logo_black.png";


function SignUp() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const handleButtonClick = () => {
    // 카카오 로그인 버튼 클릭 시 외부 사이트로 이동

    const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
    const REDIRECT_URI = "http://localhost:3000/api/oauth2/kakao";

    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };

  // 메인 페이지 이동 버튼 클릭 시 메인 페이지로 리디렉션
  const handleMainPageClick = () => {
    navigate("/main"); // /main 경로로 이동
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="carefLi logo"style={{ width: '100px', height: 'auto', marginRight: '8px', color: 'white' }}/>

      <h1>CarefLi</h1>
      <br />

      <p >
        서비스를 위해 로그인해볼까요?</p>

      <div style={styles.dividerStyle} />
      <br />
      <br />

      <p style={{ color: '#cccccc' }}>
      ▼ 간편로그인 ▼
      </p>
      

      

      <Kakao />
      
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#ffff",
  },
  image: {
    display: "block",
    width: "200px",
    height: "auto",
  },
  dividerStyle: {
    height: '0.75px',
    backgroundColor: '#cccccc',
    margin: '10px 0',
    width: '70%'
  },
  
};

export default SignUp;
