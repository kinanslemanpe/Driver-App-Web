// components/table/DriversTable.tsx
import {FC, useState} from "react";
import { Driver } from "../../types/driver";
import { userIsAdmin } from "../../utils/functions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import AddIcon from "@mui/icons-material/Add";
import AddOrderModal from "../modal/AddOrderModal.tsx";
import {createOrder, updateOrder} from "../../store/slices/orderSlice.ts";

interface DriverTableProps {
    drivers: Driver[];
}

const DriversTable: FC<DriverTableProps> = ({ drivers }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedUserId, setSelectedUserId] = useState<number|null>(null)
    const handleSave = (formData: any) => {
        dispatch(createOrder({ userId: user?.id, driverId: formData.driver_id, ...formData }));
        setModalOpen(false);
        setSelectedUserId(null)
    };
    const handleAddOrder = (userId) => {
        setModalOpen(true);
        setSelectedUserId(userId)
    }
    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Phone</th>
                    {userIsAdmin(user) && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                    )}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{driver.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{driver.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{driver.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{driver.phone ?? "-"}</td>
                        {userIsAdmin(user) && (
                            <td className="px-4 py-3 space-x-2 ">
                                <button onClick={() => handleAddOrder(driver.id)} className="text-sm text-blue-600 hover:underline dark:text-blue-400"><AddIcon fontSize="small" className="mr-1" /></button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            <AddOrderModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editingOrderId={null}
                onSave={handleSave}
                lockedDriverId={selectedUserId}
            />
        </div>
    );
};

export default DriversTable;
