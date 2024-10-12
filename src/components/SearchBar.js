import React, { useState } from 'react';
import search_bar from '../image/search_bar.png'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState(''); // 검색어를 저장하는 상태

  // 입력값이 변경될 때 상태 업데이트
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query); // 검색어를 부모 컴포넌트에 전달
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="누구를 찾아볼까요?"
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        <img src={search_bar} alt="search_icon" style={{ width: '14px', height: '14px'}}/>
      </button>
    </div>
  );
}

// 간단한 스타일을 추가
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px',
  },
  input: {
    width: '380px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginRight: '15px',
  },
  button: {
    padding: '10px 13px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '25px',
    backgroundColor: 'black',
    color: 'white',
    cursor: 'pointer',
  },
};

export default SearchBar;
