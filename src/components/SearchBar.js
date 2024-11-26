import React, { useState } from 'react';
import search_bar from '../image/search_bar.png';
import axios from 'axios';

function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`https://api.carefli.p-e.kr/search`, {
        params: { connectionName: query },
      });

      if (onSearchResults && typeof onSearchResults === 'function') {
        onSearchResults(response.data); // 검색 결과를 부모 컴포넌트로 전달
      } else {
        console.error('onSearchResults prop이 함수가 아닙니다.');
      }
    } catch (err) {
      console.error('검색 요청 실패:', err);
    } finally {
      setLoading(false);
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
        <img src={search_bar} alt="search_icon" style={{ width: '14px', height: '14px' }} />
      </button>
      {loading && <p style={styles.message}>검색 중...</p>}
    </div>
  );
}

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
  message: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
  },
  error: {
    marginTop: '10px',
    fontSize: '14px',
    color: 'red',
  },
};

export default SearchBar;