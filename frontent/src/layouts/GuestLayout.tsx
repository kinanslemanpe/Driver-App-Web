import {Navigate, Outlet} from 'react-router-dom';
import {useSelector} from "react-redux";
import {RootState} from "../store";

const GuestLayout = () => {
    const {token} = useSelector((store:RootState) => store.auth);
    if (token) {
        return <Navigate to='/' />
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Outlet />
        </div>
    );
};

export default GuestLayout;