// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import HomePage from '../pages/home/Home';
import AboutPage from '../pages/our/About';
import BackRemove from '../pages/remove_back/BackRemove';
import Upscale from '../pages/upscale/Upscale';
import PictureEditor from '../pages/edit/PitureEditor';
import  Login  from '../pages/login/Login';
import MyInfo from '../pages/my/MyInfo';
import NotFound from '../pages/404/NotFound';
import Independent from '../pages/ai_picture/AIForPicture';
import EditDemo from '../pages/edit/EditDemo';

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
        element: <Independent />
      },
      {
        path: '/edit',
        element: <PictureEditor />,
      },
      {
        path: '/edit1',
        element: <EditDemo />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/my', //我的个人页面，没有登陆跳转到登陆界面
        element: <MyInfo />,
        // children: [
        //   {
        //     path: '/my', //个人信息
        //     element: <MyInfo />
        //   },
        //   {
        //     path: '/setting',  //个人信息
        //     element: <Setting />
        //   }
        // ]
      },
      {
        path:'*',
        element:<NotFound />
      }
    ],
  }
]);

export default router;

