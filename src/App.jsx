// App.jsx
import router from "./router/router";
import { RouterProvider } from 'react-router-dom';
import './App.css'
import { Provider } from 'react-redux';
import store from './store/index';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;