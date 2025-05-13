import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/'); // 返回主页
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '72px', color: '#ff4d4f', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '24px', color: '#595959', marginBottom: '24px' }}>
        抱歉，您访问的页面不存在。
      </p>
      <Button type="primary" size="large" onClick={handleBackHome}>
        返回主页
      </Button>
    </div>
  );
};

export default NotFound;