import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // 修复1：引入正确的路由Hook
import { Menu } from 'antd';
import ROUTE_PATH_TO_NAME from '../router/routerConfig';

const items = [
  { label: ROUTE_PATH_TO_NAME['/'], key: '/' },
  { label: ROUTE_PATH_TO_NAME['/back'], key: '/back' },
  { label: ROUTE_PATH_TO_NAME['/edit'], key: '/edit' },
  { label: ROUTE_PATH_TO_NAME['/upscale'], key: '/upscale' },
  { label: ROUTE_PATH_TO_NAME['/ai'], key: '/ai' },
];

const TopBar = ({ onClose }) => {
  // 修复2：正确使用路由Hook
  const navigate = useNavigate();
  const location = useLocation();
  
  // 修复4：自动根据路径高亮菜单项
  const current = location.pathname;

  const handleClick = ({key}) => {
    navigate(key);
    onClose();
  }
  return (
    <div style={{ textAlign: 'center' }}>  {/* 修复5：添加容器用于布局 */}
      <Menu
        selectedKeys={[current]} 
        onClick={handleClick}
        items={items}
        style={{
          justifyContent:'center', 
          borderBottom: 'none',
        }}
      />
    </div>
  );
};

export default TopBar;