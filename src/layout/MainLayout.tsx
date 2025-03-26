// src/layouts/MainLayout.tsx
import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { label: '在线图片编辑', key: '/' },
  { label: '图片背景去除', key: '/back' },
  { label: '图片品质升级', key: '/upscale' },
  { label: 'AI 辅助生图', key: '/ai' }
];
const { Header, Content, Sider } = Layout;

const MainLayout = () => {

    const navigate = useNavigate();
    const location = useLocation();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        // 侧边栏内容
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
        {/* 导航菜单 */}
      </Sider>
      
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          {/* 头部内容 */}
        </Header>
        
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {/* 页面内容区域 */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;