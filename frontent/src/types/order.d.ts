export interface OrderData {
    "driverId"?: number,
    "userId"?: number,
    "orderId"?: number,
    "tracking_number"?: string,
    "receiver_name"?: string,
    "cod"?: number,
    "custom_fees"?: number,
    "client_name"?: string
}

export interface OrderCardProps {
    order: Order;
    onEdit: (order: Order) => void;
    onDelete: (orderId: number) => void;
}

export interface Order {
    "driver_id"?: number,
    "driver_name"?: string,
    "tracking_number"?: string,
    "receiver_name"?: string,
    "cod"?: number,
    "custom_fees"?: number,
    "client_name"?: string,
    "updated_at"?: string,
    "created_at"?: string,
    "id"?: number
}

export interface AddOrderModalProps {
    open: boolean;
    editingOrderId: number | null;
    lockedDriverId?: number | null;
    onClose: () => void;
    onSave: (order: Order) => void;
}