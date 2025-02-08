import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/home';
import Search from './pages/search';
import ErrorPage from './pages/error';
import './index.css';

// Routing setup
const router = createBrowserRouter([
    {
        index: true,
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />
    },
    {
        path: '/search',
        element: <Search />
    }
]);

// Render app
createRoot(document.getElementById('root') as HTMLElement).render(<RouterProvider router={router} />);
