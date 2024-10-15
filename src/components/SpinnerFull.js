import React from "react";
import { SyncLoader } from "react-spinners";

function SpinnerFull() {
  return (
    <div>
      <style>
        {`
          .spinner-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100vh - 58px);
            background: rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .spinner-container {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .spinner-container h3 {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 20px;
          }
        `}
      </style>
      <div className="spinner-overlay">
        <SyncLoader color="#ffffff" />
      </div>
    </div>
  );
}

export default SpinnerFull;
