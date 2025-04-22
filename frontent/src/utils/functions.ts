import { toast } from 'react-toastify';
import {User} from "../types/auth";
import {ErrorResponse} from "../types/error";
import { read, utils } from "xlsx";
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

export const errorMessage = (message: string = "Operation Not Completed!") => {
    toast.error(message);
};

export type RawOrder = Record<string, any>;
export const readFile = (file: File): Promise<RawOrder[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

            if (!jsonData || jsonData.length === 0) {
                reject("File is empty or not in a valid format.");
                return;
            }

            const header = (jsonData[0] as string[]).map((col) => (col ?? "").toString().trim());

            const requiredColumns = [
                "tracking_number",
                "receiver_name",
                "cod",
                "custom_fees",
                "client_name",
            ];

            const missingColumns = requiredColumns.filter(
                (required) => !header.includes(required)
            );

            if (missingColumns.length > 0) {
                reject(`Missing required columns: ${missingColumns.join(", ")}`);
                return;
            }

            const dataRows = jsonData.slice(1) as unknown[][];
            const rawOrders: RawOrder[] = dataRows.map((row) => {
                const obj: Record<string, any> = {};
                header.forEach((key, index) => {
                    obj[key] = row[index]; // no transformation!
                });
                return obj;
            });

            resolve(rawOrders);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};
