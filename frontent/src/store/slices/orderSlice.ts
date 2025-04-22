import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {showApiError, successMessage} from "../../utils/functions.ts";
import {Order, OrderData} from "../../types/order";
import axiosClient from "../../axios.ts";

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (driverId: number, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/drivers/${driverId}/orders`);
            return response.data.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                showApiError(error);
                return rejectWithValue(error.response?.data.message || 'Failed to fetch orders');
            }
            return rejectWithValue('Unexpected error occurred');
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData: OrderData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(`/drivers/${orderData.driverId}/orders`, orderData);
            return response.data.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                showApiError(error);
                return rejectWithValue(error.response?.data.message || 'Failed to create order');
            }
            return rejectWithValue('Unexpected error occurred');
        }
    }
);

export const updateOrder = createAsyncThunk(
    'orders/updateOrder',
    async (orderData: OrderData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put(
                `/drivers/${orderData.driverId}/orders/${orderData.orderId}`,
                orderData
            );
            return response.data.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                showApiError(error);
                return rejectWithValue(error.response?.data.message || 'Failed to update order');
            }
            return rejectWithValue('Unexpected error occurred');
        }
    }
);

export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (orderData: OrderData, { rejectWithValue }) => {
        try {
            await axiosClient.delete(
                `/drivers/${orderData.driverId}/orders/${orderData.orderId}`
            );
            return orderData.orderId;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                showApiError(error);
                return rejectWithValue(error.response?.data.message || 'Failed to delete order');
            }
            return rejectWithValue('Unexpected error occurred');
        }
    }
);

export const deleteAllOrders = createAsyncThunk(
    'orders/deleteAllOrders',
    async (driverId: number, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/drivers/${driverId}/orders`);
            return driverId;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                showApiError(error);
                return rejectWithValue(error.response?.data.message || 'Failed to delete all orders');
            }
            return rejectWithValue('Unexpected error occurred');
        }
    }
);

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch orders
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create order
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            const currentUserId = action.meta.arg.userId;
            const driverId = action.meta.arg.driverId;
            if (driverId === currentUserId) {
                state.orders.push(action.payload);
            }
            successMessage("Order Created Successfully");
        });
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update order
        builder.addCase(updateOrder.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateOrder.fulfilled, (state, action) => {
            state.loading = false;
            const currentUserId = action.meta.arg.userId;
            const driverId = action.meta.arg.driverId;
            if (driverId === currentUserId) {
                const index = state.orders.findIndex((order) => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            } else {
                state.orders = state.orders.filter((order) => order.id !== action.payload.id);
            }
            successMessage("Order Updated Successfully");
        });
        builder.addCase(updateOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete order
        builder.addCase(deleteOrder.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter((order) => order.id !== action.payload);
            successMessage("Order Deleted Successfully");
        });
        builder.addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete all orders
        builder.addCase(deleteAllOrders.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter((order) => Number(order.driver_id) !== action.payload);
            successMessage("All Orders Deleted Successfully");
        });
        builder.addCase(deleteAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default orderSlice.reducer;
