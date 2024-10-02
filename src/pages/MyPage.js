import React from 'react';

const MyPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.text}>마이페이지</h1>
    </div>
  );
};

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0', 
    },
    text: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    },
  };
  
  export default MyPage;