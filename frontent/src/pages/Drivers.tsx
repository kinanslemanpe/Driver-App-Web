import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    listDrivers,
    createDriver,
} from "../store/slices/driverSlice";
import { RootState, AppDispatch } from "../store";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Skeleton } from "@mui/material";
import AddDriverModal from "../components/modal/AddDriverModal";
import { userIsAdmin } from "../utils/functions";
import DriversTable from "../components/table/DriversTable.tsx";

export default function Drivers() {
    const dispatch = useDispatch<AppDispatch>();
    const { drivers, loading, error } = useSelector((state: RootState) => state.driver);
    const { user } = useSelector((state: RootState) => state.auth);

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(listDrivers());
    }, [dispatch]);

    const filteredDrivers = drivers.filter(
        (driver) =>
            driver.name.toLowerCase().includes(search.toLowerCase()) ||
            driver.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreateDriver = (formData: any) => {
        dispatch(createDriver(formData));
        setModalOpen(false);
    };

    return (
        <section className="px-4 py-6 w-full rounded bg-gray-200 dark:bg-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Drivers</h1>

                {userIsAdmin(user) && (
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <PersonAddIcon fontSize="small" className="mr-1" /> Create Driver
                    </button>
                )}
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {filteredDrivers.length === 0 && !loading ? (
                <div className="w-full flex flex-col justify-center items-center bg-gray-100 p-8 rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="text-lg text-gray-700 dark:text-gray-200 font-semibold">No Drivers Found</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or add a new driver.</p>
                </div>
            ) : (
                <div className="">
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                                    <Skeleton variant="text" width="40%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="50%" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <DriversTable drivers={filteredDrivers} />
                    )}
                </div>
            )}

            <AddDriverModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleCreateDriver} />
        </section>
    );
}
