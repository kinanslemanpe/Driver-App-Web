import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "../store";
import Navbar from "../components/admin/Navbar.tsx";
import Sidebar from "../components/admin/Sidebar.tsx";

const AuthLayout = () => {
    const { token } = useSelector((store: RootState) => store.auth);

    if (!token) {
        return <Navigate to='/login' />;
    }

    return (
        <div className="bg-gray-200 dark:bg-gray-700">
            <Navbar/>
            <div style={{minHeight: 'calc(100vh - 72px)'}} className="flex">
                <Sidebar/>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 p-6 overflow-y-auto">
                    <Outlet/>
                </div>
            </div>
        </div>

    );
};

export default AuthLayout;
