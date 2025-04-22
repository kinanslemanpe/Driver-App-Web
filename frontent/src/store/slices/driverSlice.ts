import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosClient from '../../axios.ts';
import {showApiError, successMessage} from '../../utils/functions.ts';
import {CreateDriverData, Driver, DriverState} from "../../types/driver";
const initialState: DriverState = {
    drivers: [],
    loading: false,
    error: null,
};

export const listDrivers = createAsyncThunk<Driver[], string | undefined, { rejectValue: string }>(
    'drivers/list',
    async (search, thunkAPI) => {
        try {
            const params = search ? { params: { search } } : {};
            const response = await axiosClient.get('/drivers', params);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetching drivers failed');
        }
    }
);
export const createDriver = createAsyncThunk(
    'drivers/create',
    async (data: CreateDriverData, thunkAPI) => {
        try {
            const response = await axiosClient.post('/drivers', data);
            return response.data.data as Driver;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Creating driver failed');
        }
    }
);

const driverSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listDrivers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listDrivers.fulfilled, (state, action: PayloadAction<Driver[]>) => {
                state.loading = false;
                state.drivers = action.payload;
            })
            .addCase(listDrivers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            })
            .addCase(createDriver.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDriver.fulfilled, (state, action: PayloadAction<Driver>) => {
                state.loading = false;
                state.drivers.push(action.payload);
                successMessage("Driver Created Successfully");
            })
            .addCase(createDriver.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            });
    },
});

export default driverSlice.reducer;
