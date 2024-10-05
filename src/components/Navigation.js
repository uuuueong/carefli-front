import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navigation.css'; 

import homeIcon from '../image/icon_home.png';
import presentIcon from '../image/icon_present.png';
import writingIcon from '../image/icon_writing.png';
import mypageIcon from '../image/icon_mypage.png';

const Navigation = () => {

  const location = useLocation(); // 현재 경로를 확인하는 훅

  // 스플래시와 로그인 페이지에서는 네비게이션 바를 렌더링하지 않음
  if (location.pathname === '/signup' || location.pathname === '/') {
    return null;
  }

  return (
    <div className="navigation">
      <NavLink to="/main" exact activeClassName="active">
        <img src={homeIcon} alt="홈 아이콘" /> 
        홈
      </NavLink>
      <NavLink to="/present" activeClassName="active">
        <img src={presentIcon} alt="선물 추천 아이콘" />
        선물 추천
      </NavLink>
      <NavLink to="/writing" activeClassName="active">
      <img src={writingIcon} alt="문구 생성 아이콘" />
        문구 생성
      </NavLink>
      <NavLink to="/mypage" activeClassName="active">
      <img src={mypageIcon} alt="마이 페이지 아이콘" />
        마이 페이지
      </NavLink>
    </div>
  );
};

export default Navigation;
