import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const { pathname } = location;

    const getLinkClasses = (path: string) =>
        `flex items-center p-2 rounded-lg group transition ${
            pathname === path
                ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        }`;

    const getIconClasses = (path: string) =>
        `w-5 h-5 mr-3 transition ${
            pathname === path
                ? "text-gray-700 dark:text-white"
                : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200"
        }`;

    return (
        <div className="hidden md:block w-64 bg-white text-gray-800 dark:bg-gray-900 dark:text-white flex-shrink-0 p-6 space-y-4">
            <div className="text-center mb-6">
                <img src="https://flowbite.com/docs/images/logo.svg" alt="Logo" className="h-8 mx-auto" />
            </div>
            <ul className="space-y-2">
                <li>
                    <Link to="/orders" className={getLinkClasses("/orders")}>
                        <svg className={getIconClasses("/orders")} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zM3 9a1 1 0 000 2h14a1 1 0 100-2H3zM3 14a1 1 0 000 2h14a1 1 0 100-2H3z" />
                        </svg>
                        <span>Orders</span>
                    </Link>
                </li>
                <li>
                    <Link to="/drivers" className={getLinkClasses("/drivers")}>
                        <svg className={getIconClasses("/drivers")} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 3a2 2 0 00-2 2v3h2V5h14v3h2V5a2 2 0 00-2-2H5zM3 10v9a2 2 0 002 2h14a2 2 0 002-2v-9H3zm5 2h8v2H8v-2z" />
                        </svg>
                        <span>Drivers</span>
                    </Link>
                </li>
                <li>
                    <Link to="/whatsapp-templates" className={getLinkClasses("/whatsapp-templates")}>
                        <svg className={getIconClasses("/whatsapp-templates")} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 4.925 0 11c0 2.068.63 3.983 1.719 5.593L0 24l7.703-2.06C9.205 22.615 10.574 23 12 23c6.627 0 12-4.925 12-11S18.627 0 12 0z" />
                        </svg>
                        <span>Whatsapp Templates</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
