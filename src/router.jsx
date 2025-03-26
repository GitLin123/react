// src/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import BackRemove from './pages/BackRemove'

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
      }
    ]
  }
]);

export default router;