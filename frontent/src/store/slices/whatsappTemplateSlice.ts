import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosClient from '../../axios.ts';
import {showApiError, successMessage} from '../../utils/functions.ts';
import {WhatsAppTemplate, WhatsAppTemplateState} from "../../types/whatsappTemplate";


export const initialState: WhatsAppTemplateState = {
    templates: [],
    loading: false,
    error: null,
};
export const fetchWhatsAppTemplates = createAsyncThunk(
    'whatsappTemplate/fetch',
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get('/WhatsApp-template');
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetching templates failed');
        }
    }
);

export const createWhatsAppTemplate = createAsyncThunk(
    'whatsappTemplate/create',
    async (data: WhatsAppTemplate, thunkAPI) => {
        try {
            const response = await axiosClient.post('/WhatsApp-template', data);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Creating template failed');
        }
    }
);

export const updateWhatsAppTemplate = createAsyncThunk(
    'whatsappTemplate/update',
    async (data: Partial<WhatsAppTemplate> & { key: string }, thunkAPI) => {
        try {
            const response = await axiosClient.put('/WhatsApp-template', data);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Updating template failed');
        }
    }
);

const whatsappTemplateSlice = createSlice({
    name: 'whatsappTemplate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchWhatsAppTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWhatsAppTemplates.fulfilled, (state, action: PayloadAction<WhatsAppTemplate[]>) => {
                state.loading = false;
                state.templates = action.payload;
            })
            .addCase(fetchWhatsAppTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            })

            // Create
            .addCase(createWhatsAppTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWhatsAppTemplate.fulfilled, (state, action: PayloadAction<WhatsAppTemplate>) => {
                state.loading = false;
                state.templates.push(action.payload);
            })
            .addCase(createWhatsAppTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            })

            // Update
            .addCase(updateWhatsAppTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWhatsAppTemplate.fulfilled, (state, action: PayloadAction<WhatsAppTemplate>) => {
                state.loading = false;
                const index = state.templates.findIndex(t => t.key === action.payload.key);
                if (index !== -1) {
                    state.templates[index] = action.payload;
                }
                successMessage("Template Updated Successfully");
            })
            .addCase(updateWhatsAppTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showApiError(action.payload);
            });
    },
});

export default whatsappTemplateSlice.reducer;
