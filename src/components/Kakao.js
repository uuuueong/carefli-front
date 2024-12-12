import loginImage from "../image/kakao_login_medium_narrow.png";

const Kakao = () => {
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  // const REDIRECT_URI = "https://tiny-truffle-084b78.netlify.app/api/oauth2/kakao"; //Redirect URI
  const REDIRECT_URI = "https://carefli-front.vercel.app/api/oauth2/kakao"; //Redirect URI
  // const REDIRECT_URI = "http://localhost:3000/api/oauth2/kakao"; //Redirect URI

  // oauth 요청 URL
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URI;
  };
  return (
    <div className="login">
      <img src={loginImage} alt="Kakao Login" onClick={handleLogin} />
    </div>
  );
};

export default Kakao;
