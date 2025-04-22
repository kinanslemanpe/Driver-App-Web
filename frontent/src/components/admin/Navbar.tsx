import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {Link, useNavigate} from 'react-router-dom'
import DarkMode from "../DarkMode.tsx";
import {logout} from "../../store/slices/authSlice.ts";
import {initDropdowns} from "flowbite";
import {useEffect} from "react";

export default function Navbar() {
    const {user} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useEffect(() => {
        initDropdowns();
    }, []);
    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login', { replace: true });
    };
    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"/>
                        <span
                            className="self-center inline-block text-2xl font-semibold whitespace-nowrap dark:text-white">{import.meta.env.VITE_APP_TITLE}</span>
                    </Link>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4">
                        <DarkMode/>
                        <button type="button"
                                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
                                data-dropdown-placement="bottom">
                            <span className="sr-only">Open user menu</span>
                            <div
                                className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </div>
                        </button>
                        <div
                            className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                            id="user-dropdown">
                            <div className="px-4 py-3">
                                <span className="block text-sm text-gray-900 dark:text-white">{user?.name}</span>
                                <span
                                    className="block text-sm  text-gray-500 truncate dark:text-gray-400">{user?.email}</span>
                            </div>
                            <ul className="py-2" aria-labelledby="user-menu-button">
                                <li>
                                    <Link to="/whatsapp-templates"
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Whatsapp
                                        Templates</Link>
                                </li>
                                <li>
                                    <Link to="/orders"
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Orders</Link>
                                </li>
                                <li>
                                    <Link to="/drivers"
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Drivers</Link>
                                </li>
                                <li>
                                    <div
                                        onClick={handleLogout}
                                        className="block px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign
                                        out
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}