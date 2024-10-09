// SignUp.js
import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 import
import loginImage from "../image/kakao_login_medium_narrow.png";

function SignUp() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const handleButtonClick = () => {
    // 카카오 로그인 버튼 클릭 시 외부 사이트로 이동

    const REST_API_KEY = '8e41c6f7664902fee5938e4f1a2ad810';
    const REDIRECT_URI = 'http://localhost:3000/api/oauth2/kakao';
    
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };

  // 메인 페이지 이동 버튼 클릭 시 메인 페이지로 리디렉션
  const handleMainPageClick = () => {
    navigate("/main"); // /main 경로로 이동
  };

  return (
    <div style={styles.container}>
      <h1>CarefLi</h1>
      <p>카카오로 로그인하러 가볼까요?</p>
      <button onClick={handleButtonClick} style={styles.submitButton}>
        <img src={loginImage} alt="Kakao Login" style={styles.image} />
      </button>
      <button onClick={handleMainPageClick} style={styles.mainButton}>
        메인 페이지 이동
      </button>
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
    backgroundColor: "#f9f9f9",
  },
  mainButton: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#5469c1",
    color: "#fff",
    cursor: "pointer",
  },
  image: {
    display: "block",
    width: "200px",
    height: "auto",
  },
};

export default SignUp;
