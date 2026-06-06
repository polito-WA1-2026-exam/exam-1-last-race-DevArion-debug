import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import App from './App.jsx'
import LoginPage from './pages/Login.jsx';
import GameHistory, { gameHistoryLoader } from './pages/GameHistory.jsx';
import { appDataLoader } from './App.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/app",
    Component: App,
    loader: appDataLoader
  },
  {
    path: "/history",
    Component: GameHistory,
    loader: gameHistoryLoader
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