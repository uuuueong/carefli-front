import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Oauth = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    // 인증 코드가 있으면 추가 처리 없이 메인 페이지로 리디렉트
    if (code) {
      axios.post('https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=8e41c6f7664902fee5938e4f1a2ad810&redirect_uri=http://localhost:3000/api/oauth2/kakao', { code })
      .then(response => {
        const { accessToken } = response.data;
        console.log('Access Token', accessToken);
      })
      .catch(error => {
        console.error('Error in getting access token:', error);
      })
      navigate('/main');
    }
   }, [navigate]);

  // 인증 코드가 없으면 사용자를 카카오 로그인 페이지로 보내는 링크를 제공
  if (!code) {
      const REST_API_KEY = '8e41c6f7664902fee5938e4f1a2ad810';
      const REDIRECT_URI = encodeURIComponent('http://localhost:3000/api/oauth2/kakao');
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

    return (
      <div>
        <h1>로그인이 필요합니다</h1>
        <a href={KAKAO_AUTH_URL}>카카오 계정으로 로그인</a>
      </div>
    );
  }

  return <div>로그인 중입니다...</div>;
};

export default Oauth;
