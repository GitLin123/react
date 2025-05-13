// src/layouts/MainLayout.tsx
import { Layout, Avatar } from 'antd';
import React, { useState } from 'react';
import TopBar from './TopBar';
import Foot from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { Drawer } from "antd";
import { BarsOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import ROUTE_PATH_TO_NAME from '../router/routerConfig';
import { useNavigate } from 'react-router-dom';
import { useSelector, useStore } from 'react-redux';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loadingBarRef = useRef(null);
  const location = useLocation();
  const store = useStore();
  const avatar = useSelector(state => state.user?.data?.avatar);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // 路由变化时触发进度条
  useEffect(() => {
    loadingBarRef.current.continuousStart(40);
    const timer = setTimeout(() => {
      loadingBarRef.current.complete();
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 滚动条容器样式
  const contentStyle = {
    marginTop: location.pathname === '/my' ? 0 : 48, // 如果是 /my 页面，移除顶部间距
    height: 'calc(100vh - 64px - 70px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollBehavior: 'smooth'
  };

  let layOutCss = {
    minHeight: '100vh',
    backgroundImage: 'url(/src/assets/backgroundImage.png)',
    backgroundSize: 'cover',
    width: '100vw', // 添加视口宽度
    overflowX: 'hidden', // 防止横向滚动
    overflowY: 'hidden'
  };

  let headStyle = {
    position: 'fixed',
    zIndex: 1000,
    width: '100%',
    height: '3.4rem',
    padding: '0 2.2rem',
    backgroundColor: "#1e2022",
    display: 'flex',
    alignItems: 'center',
    margin: 'auto',
    justifyContent: 'space-between',
    top: 0,
    left: 0,
    color: 'white'
  };

  return (
    <Layout style={layOutCss}>
      <LoadingBar
        ref={loadingBarRef}
        color="#C84B31"
        height={3}
        shadow={false}
      />
      {/* 条件渲染 Header */}
      {location.pathname !== '/my' && (
        <Header style={headStyle}>
          <BarsOutlined style={{ fontSize: 28 }} onClick={showDrawer}></BarsOutlined>
          <h3>{ROUTE_PATH_TO_NAME[location.pathname]}</h3>
          <Avatar
            src={avatar}
            shape='square'
            size='large' icon={<UserOutlined />}
            onClick={store.getState().user.isLogin ? () => navigate('/my') : () => navigate('login')}
            style={{ cursor: "pointer" }}
          />
          <Drawer width={210} onClose={() => onClose()} open={open} placement='left'>
            <TopBar onClose={() => onClose()} ></TopBar>
          </Drawer>
        </Header>
      )}
      <Content style={contentStyle}>
        <Outlet />
      </Content>
      {location.pathname === '/' && (<Footer><Foot /></Footer>)}
    </Layout>
  );
};

export default MainLayout;