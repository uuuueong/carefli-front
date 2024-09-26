const Login = () => {
    const REST_API_KEY = '8e41c6f7664902fee5938e4f1a2ad810';
    const REDIRECT_URI = 'https://localhost:8080/api/oauth2/kakao';
    const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  
    const loginHandler = () => {
      window.location.href = KAKAO_AUTH_URI;
    };
  
    return (
      <button type='button' onClick={loginHandler}>
        로그인 하기
      </button>
    );
  };