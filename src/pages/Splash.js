import React from 'react';
import './SplashScreen.css'; // 스타일을 위한 별도의 CSS 파일
import haemstar from '../image/haemstar.jpg'

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <h1>스플래시 페이지</h1> 
            <img src={haemstar} alt="" />

        </div>
    );
};

export default SplashScreen;
