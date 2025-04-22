import { toast } from 'react-toastify';
import {User} from "../types/auth";

interface ErrorResponse {
    message?: string;
    errors?: {
        [key: string]: string[];
    };
}

export const showApiError = (error: unknown) => {
    console.log(typeof error === "string", typeof error, error, 'error')
    if(typeof error === "string") {
        toast.error(error);
        return;
    }
    const err = error as { response?: { data?: ErrorResponse } };
    const responseData = err?.response?.data;
    if (responseData?.errors) {
        Object.values(responseData.errors).forEach((errorMessages) => {
            errorMessages.forEach((msg) => toast.error(msg));
        });
    } else if (responseData?.message) {
        toast.error(responseData.message);
    } else {
        toast.error('An unexpected error occurred.');
    }
};

export const userIsAdmin = (user: User | null): boolean => {
    return user?.roles?.some(role => role.name === 'admin') ?? false;
}

export const successMessage = (message: string = "Operation completed successfully!") => {
    toast.success(message);
};
