import { createRoot } from 'react-dom/client';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './pages/home';
import ErrorPage from './pages/error';
import './index.css';

// Routing setup
const router = createBrowserRouter([
    {
        index: true,
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />
    }
]);

// Render app
createRoot(document.getElementById('root') as HTMLElement).render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" theme="colored" autoClose={2000} />
    </LocalizationProvider>
);
