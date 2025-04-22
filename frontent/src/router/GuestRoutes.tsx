import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";

const guestRoutes = [
    {
        name: 'login',
        path: '/login',
        element: <Login />
    },
]

export default guestRoutes