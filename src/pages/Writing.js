// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./Writing.css";

// const profiles = [
//   { id: 1, name: "손윤지", age: 23, relation: "선배" },
//   { id: 2, name: "정이진", age: 25, relation: "친구" },
//   { id: 3, name: "정지은", age: 30, relation: "친구" },
//   { id: 4, name: "김이화", age: 40, relation: "직장 상사" },
// ];

// function Writing() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedProfile, setSelectedProfile] = useState(location.state?.selectedProfile || {});

//   const handleSelectChange = (event) => {
//     const selectedName = event.target.value; // 선택된 이름이 들어옴
//     const selectedProfile = profiles.find((profile) => profile.name === selectedName); // 이름으로 프로필 찾기
//     setSelectedProfile(selectedProfile); // 해당 프로필을 저장
//   };

//   const handleButtonClick = () => {
//     navigate("/writing/select-details", { state: { selectedProfile } });
//   };

//   return (
//     <div className="writing div-container">
//       <h1 className="text">누구를 위한 문구를 작성할까?</h1>
//       <select className="select" value={selectedProfile?.name || ""} onChange={handleSelectChange}>
//         <option value="">인물을 선택하세요</option>
//         {profiles.map((profile) => (
//           <option key={profile.id} value={profile.name}>
//             {profile.name}
//           </option>
//         ))}
//       </select>
//       <button className={`button ${selectedProfile?.name ? "visible" : "hidden"}`} onClick={handleButtonClick}>
//         다음
//       </button>
//     </div>
//   );
// }

// export default Writing;
