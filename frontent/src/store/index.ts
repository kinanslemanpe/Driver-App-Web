import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import driverReducer from './slices/driverSlice';
import whatsappTemplateReducer from './slices/whatsappTemplateSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        order: orderReducer,
        user: userReducer,
        driver: driverReducer,
        whatsappTemplate: whatsappTemplateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;