import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteAllOrders, createOrdersFromFile,
} from "../store/slices/orderSlice";
import { fetchUsersLookup } from "../store/slices/userSlice";
import { RootState, AppDispatch } from "../store";
import AddIcon from "@mui/icons-material/Add";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { Skeleton } from "@mui/material";
import AddOrderModal from "../components/modal/AddOrderModal";
import DeleteOrderModal from "../components/modal/DeleteOrderModal";
import OrderCard from "../components/card/OrderCard";
import { userIsAdmin } from "../utils/functions";
import {Order} from "../types/order";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import UploadOrderModal from "../components/modal/UploadOrderModal.tsx";

export default function Orders() {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector((state: RootState) => state.order);
    const { user } = useSelector((state: RootState) => state.auth);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    useEffect(() => {
        dispatch(fetchOrders(Number(user?.id)));
        if (userIsAdmin(user)) {
            dispatch(fetchUsersLookup());
        }
    }, [dispatch, user]);

    const handleAddClick = () => {
        setEditingOrderId(null);
        setModalOpen(true);
    };

    const handleEditClick = (order: Order) => {
        setEditingOrderId(Number(order?.id));
        setModalOpen(true);
    };

    const handleDeleteClick = (orderId: number) => {
        setOrderToDelete(orderId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (orderToDelete !== null) {
            dispatch(deleteOrder({ orderId: orderToDelete, driverId: user?.id }));
            setOrderToDelete(null);
        }
        setDeleteModalOpen(false);
    };

    const handleClearOrders = () => setClearModalOpen(true);
    const handleUploadOrders = () => setUploadModalOpen(true);
    const handleUploadOrdersFile = (ordersFromFile: Order[], driverId: number) => {
        if (!ordersFromFile.length || !driverId) {
            return;
        }
        const formattedOrders = ordersFromFile.map((order) => ({
            tracking_number: order.tracking_number,
            receiver_name: order.receiver_name,
            cod: order.cod ?? undefined,
            custom_fees: order.custom_fees ?? undefined,
            client_name: order.client_name ?? undefined,
            driverId: driverId,
        }));
        dispatch(createOrdersFromFile({formattedOrders, userId: Number(user?.id)}));
        setUploadModalOpen(false);
    };


    const handleConfirmClear = () => {
        dispatch(deleteAllOrders(Number(user?.id)));
        setClearModalOpen(false);
    };

    const handleSave = (formData: Order) => {
        if (editingOrderId) {
            dispatch(updateOrder({ userId: user?.id, orderId: editingOrderId, driverId: Number(formData.driver_id), ...formData }));
        } else {
            dispatch(createOrder({ userId: user?.id, driverId: Number(formData.driver_id), ...formData }));
        }
        setModalOpen(false);
        setEditingOrderId(null);
    };

    return (
        <section className="px-4 py-6 w-full rounded bg-gray-200 dark:bg-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Orders</h1>
                {!loading && userIsAdmin(user) && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
                            onClick={handleClearOrders}
                        >
                            <ClearAllIcon fontSize="small" className="mr-1"/> Clear Orders
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            onClick={handleUploadOrders}
                        >
                            <FileUploadOutlinedIcon />
                            Upload Orders
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                            onClick={handleAddClick}
                        >
                            <AddIcon fontSize="small" className="mr-1"/> Add Order
                        </button>
                    </div>

                )}
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {orders.length === 0 && !loading && (
                <div
                    className="w-full flex flex-col justify-center items-center bg-gray-100 p-8 rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="text-lg text-gray-700 dark:text-gray-200 font-semibold">No Orders Found</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">It seems like there are no orders at the
                        moment.</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading
                    ? Array.from({length: 4}).map((_, index) => (
                        <div key={index}
                             className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <Skeleton variant="rectangular" height={150} className="mb-4"/>
                            <Skeleton variant="text" width="60%"/>
                            <Skeleton variant="text" width="80%"/>
                            <Skeleton variant="text" width="40%" />
                        </div>
                    ))
                    : orders?.map((order) => (
                        <OrderCard
                            key={order?.id}
                            order={order}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
            </div>

            <UploadOrderModal
                open={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onUpload={handleUploadOrdersFile}
            />

            <AddOrderModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editingOrderId={editingOrderId}
                onSave={handleSave}
            />

            <DeleteOrderModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            <DeleteOrderModal
                open={clearModalOpen}
                onClose={() => setClearModalOpen(false)}
                onConfirm={handleConfirmClear}
                message="Are you sure you want to delete all orders?"
            />
        </section>
    );
}