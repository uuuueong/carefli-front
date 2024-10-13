import React from 'react';
import './SplashScreen.css'; // 스타일을 위한 별도의 CSS 파일
import logo from "../image/carefLi_logo.svg";

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <img src={logo} alt="carefLi logo" />
            
            <h1 className='logo-title'>
                CarefLi

            </h1>

        </div>
    );
};

export default SplashScreen;
