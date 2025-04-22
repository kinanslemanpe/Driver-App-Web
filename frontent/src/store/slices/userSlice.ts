import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from "../../axios.ts";
import {AxiosError} from "axios";
import {showApiError} from "../../utils/functions.ts";

export const fetchUsersLookup = createAsyncThunk(
    'users/fetchUsersLookup',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosClient.get('/users/lookup');
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                showApiError(error);
                return rejectWithValue(error.response?.data.message || 'Failed to fetch users');
            }
            return rejectWithValue('Unexpected error occurred');
        }
    }
);

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersLookup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersLookup.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
            })
            .addCase(fetchUsersLookup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});
export default userSlice.reducer;
