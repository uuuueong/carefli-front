// App.js
import React, { useState, useEffect, Component } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SplashScreen from "./pages/Splash";
import Main from "./pages/Main";
import PersonEnroll from "./pages/PersonEnroll";
import Present from "./pages/Present";
import Writing from "./pages/Writing";
import Navigation from "./components/Navigation";
import MyInfoEdit from "./pages/MyInfoEdit";
import MyPage from "./pages/MyPage";
import "./App.css";
import PersonProfile from "./pages/PersonProfile";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";

// 360 x 640 비율 고정 위한 함수
function FixRatio() {
  const root = document.querySelector("#root");
  const app = document.querySelector("#App");

  const targetWidth = 360;
  const targetHeight = 640;
  const aspectRatio = targetHeight / targetWidth;

  let width = root.clientWidth;
  let height = width * aspectRatio;

  // 화면에서 높이 초과 시 너비를 조정하도록 하는 코드
  if (height > root.clientHeight) {
    height = root.clientHeight;
    width = height / aspectRatio;
  }

  app.style.width = `${width}px`;
  // app.style.height = `${height}px`;
  app.style.height = "100vh";
  app.style.margin = "auto"; // 중앙에 자동으로 놓을 수 있도록
}

// 화면 크기 자동으로 조절 컴포넌트
class ResizeHandler extends Component {
  componentDidMount() {
    window.addEventListener("resize", FixRatio);
    FixRatio();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", FixRatio);
  }

  render() {
    return <div id="App">{this.props.children}</div>;
  }
}

// 스플래시 -> 로그인
function SplashToSignUp() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/signup");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return <SplashScreen />;
  }

  return null;
}

function MainApp() {
  useEffect(() => {
    // 모바일 뷰포트 높이 조정
    const setScreenSize = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setScreenSize();

    window.addEventListener("resize", setScreenSize);
    return () => window.removeEventListener("resize", setScreenSize);
  }, []);

  return (
    <Router>
      <ResizeHandler>
        <Routes>
          <Route path="/" element={<SplashToSignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main" element={<Main />} />
          <Route path="/present" element={<Present />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/person-enroll" element={<PersonEnroll />} />
          <Route path="/connections/:connectionId" element={<PersonProfile />} />
          <Route path="/api/oauth2/kakao" element={<OAuth2RedirectHandler />} />
          <Route path="/edit-myinfo" element={<MyInfoEdit />} />
        </Routes>
        <Navigation />
      </ResizeHandler>
    </Router>
  );
}

export default MainApp;
