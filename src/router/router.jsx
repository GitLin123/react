// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import HomePage from '../pages/home/Home';
import AboutPage from '../pages/our/About';
import BackRemove from '../pages/remove_back/BackRemove';
import Upscale from '../pages/upscale/Upscale';
import AIForPicture from '../pages/ai_picture/AiForPicture';
import PictureEditor from '../pages/edit/PitureEditor';
import  Login  from '../pages/login/Login';
import MyInfo from '../pages/my/MyInfo';
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/about',
        element: <AboutPage />
      },
      {
        path: '/back',
        element: <BackRemove />
      },
      {
        path: '/upscale',
        element: <Upscale />
      },
      {
        path: '/ai',
        element: <AIForPicture />
      },
      {
        path: '/edit',
        element: <PictureEditor />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/my', //我的个人页面，没有登陆跳转到登陆界面
        element: <MyInfo />
      }
    ],
  }
]);

export default router;

