import { FC } from "react";
import { OrderCardProps} from "../../types/order";
import { userIsAdmin } from "../../utils/functions.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const OrderCard: FC<OrderCardProps> = ({ order, onEdit, onDelete }) => {
    const {
        id,
        cod,
        custom_fees,
        created_at,
        updated_at,
        tracking_number,
        receiver_name,
        client_name,
        driver_name,
    } = order;

    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Order #{id}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tracking: {tracking_number}</p>
                </div>
                {userIsAdmin(user) && (
                    <div className="space-x-2">
                        <button
                            onClick={() => onEdit(order)}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(Number(id))}
                            className="text-sm text-red-600 hover:underline dark:text-red-400"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p><span className="font-medium">Client:</span> {client_name}</p>
                <p><span className="font-medium">Receiver:</span> {receiver_name}</p>
                {driver_name && <p><span className="font-medium">Driver:</span> {driver_name ?? ''}</p>}
                <p><span className="font-medium">COD:</span> ${Number(cod).toFixed(2)}</p>
                <p><span className="font-medium">Custom Fees:</span> ${Number(custom_fees).toFixed(2)}</p>
                <p><span className="font-medium">Created:</span> {formatDate(String(created_at))}</p>
                <p><span className="font-medium">Updated:</span> {formatDate(String(updated_at))}</p>
            </div>
        </div>
    );
};

export default OrderCard;
