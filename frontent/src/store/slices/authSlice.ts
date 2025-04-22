import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import axiosClient from "../../axios.ts";
import {showApiError, successMessage} from "../../utils/functions.ts";
import {AuthState, LoginData, RegisterData, User} from "../../types/auth";


const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('ACCESS_TOKEN'),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (data: LoginData, thunkAPI) => {
        try {
            const response = await axiosClient.post('/auth/login', data);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, thunkAPI) => {
        try {
            const response = await axiosClient.post('/auth/register', data);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await axiosClient.post('/auth/logout');
        return null;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('ACCESS_TOKEN', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                successMessage(`Welcome ${action.payload.user?.name}!`);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            })

            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('ACCESS_TOKEN', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            })

            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.loading = false;
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('user');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
