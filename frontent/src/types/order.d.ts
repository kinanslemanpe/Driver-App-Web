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

export interface Order {
    "driver_id": string,
    "driver_name": string,
    "tracking_number": string,
    "receiver_name": string,
    "cod": number,
    "custom_fees": number,
    "client_name": string,
    "updated_at": string,
    "created_at": string,
    "id": number
}