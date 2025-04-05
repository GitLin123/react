// src/layouts/MainLayout.tsx
import { Layout, Avatar } from 'antd';
import React,{useState} from 'react';
import TopBar from './TopBar';
import Foot from './Footer';
import {Outlet, useLocation} from 'react-router-dom';
import { Drawer } from "antd";
import { BarsOutlined, UserOutlined} from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import ROUTE_PATH_TO_NAME from '../router/routerConfig';
import store from '../store/index.js';
const { Header, Content, Footer } = Layout;
const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const loadingBarRef = useRef(null);
  const location = useLocation();
  const [avatar, setAvatar] = useState(store.getState().avatar);
  const showDrawer = () => {
    setOpen(true);
  };
  //对于seeion的open

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



  // 手动订阅 Store 更新
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      // 当 Store 更新时，获取最新头像
      const newAvatar = store.getState().avatar;
      if (newAvatar !== avatar) {
        setAvatar(newAvatar);
      }
    });
    
    // 组件卸载时取消订阅
    return () => unsubscribe();
  }, [avatar]);

  // 滚动条容器样式
  const contentStyle = {
    marginTop: 64,
    padding: 24,
    height: 'calc(100vh - 64px - 70px)',
    overflowY: 'auto',
    overflowX:'hidden',
    scrollBehavior: 'smooth'
  };

  let layOutCss = {
      minHeight: '100vh',
      backgroundImage: 'url(/src/assets/backgroundImage.png)',
      backgroundSize: 'cover',
      width: '100vw',  // 添加视口宽度
      overflowX: 'hidden', // 防止横向滚动
      overflowY:'hidden'
  }

  let headStyle = {
    position: 'fixed',
    zIndex: 1000,
    width: '100%',
    height: 64,
    padding: '0 24px',
    backgroundColor: "#1e2022",
    display: 'flex',
    alignItems: 'center',
    margin: 'auto',
    justifyContent:'space-between',
    top: 0,
    left: 0,
    color:'white'
  }
  return (
    <Layout style={layOutCss}>
       <LoadingBar
        ref={loadingBarRef}
        color="#C84B31"
        height={3}
        shadow={false}
      />
      <Header style={headStyle}>
      <BarsOutlined style={{fontSize :28}} onClick={showDrawer}></BarsOutlined>
        <h3>{ROUTE_PATH_TO_NAME[location.pathname]}</h3>
        <Avatar
        src={avatar||null}
        shape='square'
        size={48} icon={<UserOutlined />}
        ></Avatar>
        <Drawer onClose={() => onClose()} open={open} placement='left'>
          <TopBar onClose={() => onClose()} ></TopBar>
        </Drawer>
      </Header>
      <Content style={contentStyle}>
        <Outlet />
      </Content>
      {location.pathname === '/' && (<Footer><Foot /></Footer>)}
    </Layout>
  );
};

export default MainLayout;