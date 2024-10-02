import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css'; 

const Navigation = () => {
  return (
    <div className="navigation">
      <NavLink to="/" exact activeClassName="active">
        홈
      </NavLink>
      <NavLink to="/present" activeClassName="active">
        선물 추천
      </NavLink>
      <NavLink to="/writing" activeClassName="active">
        문구 생성
      </NavLink>
      <NavLink to="/mypage" activeClassName="active">
        마이 페이지
      </NavLink>
    </div>
  );
};

export default Navigation;
