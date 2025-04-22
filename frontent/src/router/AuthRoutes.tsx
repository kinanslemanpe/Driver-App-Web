import Orders from "../pages/Orders.tsx";
import {Navigate} from "react-router-dom";
import Drivers from "../pages/Drivers.tsx";
import WhatsappTemplates from "../pages/WhatsappTemplates.tsx";

const authRoutes = [
    {
        index: true,
        element: <Navigate to="/orders" replace />,
    },
    {
        name: 'orders',
        path: '/orders',
        element: <Orders />
    },
    {
        name: 'drivers',
        path: '/drivers',
        element: <Drivers />
    },
    {
        name: 'whatsapp-templates',
        path: '/whatsapp-templates',
        element: <WhatsappTemplates />
    },
]

export default authRoutes