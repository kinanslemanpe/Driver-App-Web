import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {AddOrderModalProps, Order} from "../../types/order";
import {UserLookup} from "../../types/user";

const initialOrder: Order = {
    client_name: "",
    receiver_name: "",
    tracking_number: "",
    cod: 0,
    custom_fees: 0,
    driver_id: 0,
};

export default function AddOrderModal({ open, onClose, onSave, editingOrderId, lockedDriverId = null }: AddOrderModalProps) {
    const { orders } = useSelector((state: RootState) => state.order);
    const { users } = useSelector((state: RootState) => state.user);

    const [order, setOrder] = useState<Order>(initialOrder);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const userOptions = users?.map((u: UserLookup) => ({
        id: u.id,
        label: u.name,
    }));

    useEffect(() => {
        if (open) {
            const foundOrder = editingOrderId ? orders?.find(o => o?.id === editingOrderId) : null;
            const newOrder = foundOrder || initialOrder;

            if (lockedDriverId) {
                newOrder.driver_id = lockedDriverId;
            }

            setOrder(newOrder);
            setErrors({});
        }
    }, [open, editingOrderId, orders, lockedDriverId]);

    const handleChange = (field: string, value: string | number) => {
        setOrder(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!order) {
            newErrors.general = "Order data is missing";
            return newErrors;
        }
        if (!order.client_name?.trim()) newErrors.client_name = "Client name is required";
        if (!order.receiver_name?.trim()) newErrors.receiver_name = "Receiver name is required";
        if (!order.tracking_number?.trim()) newErrors.tracking_number = "Tracking number is required";
        if (order.cod === null || order.cod === undefined || isNaN(order.cod)) {
            newErrors.cod = "COD is required and must be a number";
        } else if (order.cod < 0) {
            newErrors.cod = "COD must be a positive number";
        }
        if (order.custom_fees === null || order.custom_fees === undefined || isNaN(order.custom_fees)) {
            newErrors.custom_fees = "Custom fees are required and must be a number";
        } else if (order.custom_fees < 0) {
            newErrors.custom_fees = "Custom fees must be a positive number";
        }
        if (!lockedDriverId && Number(order.driver_id) === 0) {
            newErrors.driver_id = "Driver is required";
        }
        return newErrors;
    };


    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(order);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="text-gray-900 dark:!text-white bg-white dark:bg-gray-800">
                {editingOrderId ? "Edit Order" : "Add New Order"}
            </DialogTitle>
            <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:!text-white">
                <div className="space-y-4 mt-1">
                    <div>
                        <TextField
                            label="Client Name"
                            fullWidth
                            value={order?.client_name}
                            onChange={(e) => handleChange("client_name", e.target.value)}
                            error={!!errors.client_name}
                            helperText={errors.client_name}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:!text-white"
                        />
                    </div>
                    <div>
                        <TextField
                            label="Receiver Name"
                            fullWidth
                            value={order?.receiver_name}
                            onChange={(e) => handleChange("receiver_name", e.target.value)}
                            error={!!errors.receiver_name}
                            helperText={errors.receiver_name}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:!text-white"
                        />
                    </div>
                    <div>
                        <TextField
                            label="Tracking Number"
                            fullWidth
                            value={order?.tracking_number}
                            onChange={(e) => handleChange("tracking_number", e.target.value)}
                            error={!!errors.tracking_number}
                            helperText={errors.tracking_number}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:!text-white"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <TextField
                                label="COD"
                                type="number"
                                fullWidth
                                value={order?.cod}
                                onChange={(e) => handleChange("cod", Number(e.target.value))}
                                error={!!errors.cod}
                                helperText={errors.cod}
                                className="bg-white dark:bg-gray-700 text-gray-900 dark:!text-white"
                            />
                        </div>
                        <div className="flex-1">
                            <TextField
                                label="Custom Fees"
                                type="number"
                                fullWidth
                                value={order?.custom_fees}
                                onChange={(e) => handleChange("custom_fees", Number(e.target.value))}
                                error={!!errors.custom_fees}
                                helperText={errors.custom_fees}
                                className="bg-white dark:bg-gray-700 text-gray-900 dark:!text-white"
                            />
                        </div>
                    </div>

                    {!lockedDriverId && (
                        <div>
                            <Autocomplete
                                options={userOptions}
                                getOptionLabel={(option) => option.label}
                                value={userOptions?.find((u: UserLookup) => u.id === Number(order?.driver_id)) || null}
                                onChange={(_e, newValue) => handleChange("driver_id", newValue?.id || 0)}
                                fullWidth
                                sx={{ maxWidth: 552 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Assign to User"
                                        variant="outlined"
                                        fullWidth
                                        sx={{ width: '100%' }}
                                        className="bg-white dark:bg-gray-700 text-gray-900 dark:!text-white"
                                        error={!!errors.driver_id}
                                        helperText={errors.driver_id}
                                    />
                                )}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions className="bg-white dark:bg-gray-800">
                <Button onClick={onClose} color="secondary" className="text-gray-800 dark:text-gray-300">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" className="bg-blue-500 dark:bg-blue-700">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
