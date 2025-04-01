// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import HomePage from '../pages/home/Home';
import AboutPage from '../pages/our/About';
import BackRemove from '../pages/remove_back/BackRemove';
import Upscale from '../pages/upscale/Upscale';
import AIForPicture from '../pages/ai_picture/AiForPicture';
import PictureEditor from '../pages/edit/PitureEditor';
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
    ],
  }
]);

export default router;

