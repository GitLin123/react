import React, { useState, useEffect, useRef } from 'react';

const Foot = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutId = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 仅在实际滚动时触发
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
      }

      // 清除之前的定时器
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      // 设置新定时器
      timeoutId.current = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#fff',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform'
      }}
    >
      <h4 style={{ margin: 0 }}>邮箱: 3477632943@qq.com</h4>
      <h4 style={{ margin: 0 }}>电话: 18123456789</h4>
      <h4 style={{ margin: 0 }}>地址: 狗熊岭熊洞</h4>
      <h4 style={{ margin: 0 }}>欢迎联系我们！</h4>
    </div>
  );
};

export default Foot;