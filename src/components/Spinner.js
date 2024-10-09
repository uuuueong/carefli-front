import React from "react";
import { SyncLoader } from "react-spinners";

function Spinner() {
  return (
    <div className="div-container">
      <h3 style={{ paddingBottom: "20px" }}>카카오 로그인 중입니다.</h3>
      <SyncLoader />
    </div>
  );
}

export default Spinner;
