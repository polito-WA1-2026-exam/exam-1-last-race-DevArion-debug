import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import App from './App.jsx'
import LoginPage from './pages/Login.jsx';
import { loader as appLoader } from './components/Navbar.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/app",
    Component: App,
    loader: appLoader
  },
  {
    path: "/",
    Component: LoginPage
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);