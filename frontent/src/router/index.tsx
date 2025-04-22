// src/router/index.tsx
import {
    createBrowserRouter,
} from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import AuthLayout from '../layouts/AuthLayout';
import AuthRoutes from "./AuthRoutes.tsx";
import GuestRoutes from "./GuestRoutes.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthLayout />,
        children: AuthRoutes
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: GuestRoutes
    },
]);
