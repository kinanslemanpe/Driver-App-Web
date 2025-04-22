import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { RootState } from "../../store";
import { UserLookup } from "../../types/user";
import {errorMessage, readFile} from "../../utils/functions.ts";
import {Order} from "../../types/order";

interface UploadOrdersModalProps {
    open: boolean;
    onClose: () => void;
    onUpload: (file: Order[], driverId: number) => void;
}

export default function UploadOrdersModal({ open, onClose, onUpload }: UploadOrdersModalProps) {
    const { users } = useSelector((state: RootState) => state.user);
    const { loading } = useSelector((state: RootState) => state.order);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [driverId, setDriverId] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const userOptions = users?.map((u: UserLookup) => ({
        id: u.id,
        label: u.name,
    }));

    useEffect(() => {
        if (open) {
            setSelectedFile(null);
            setDriverId(null);
            setErrors({});
        }
    }, [open]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (loading) return;
        setSelectedFile(acceptedFiles[0]);
        setErrors(prev => ({ ...prev, file: "" }));
    }, [loading]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
        multiple: false,
        disabled: loading,
    });

    const handleSubmit = async () => {
        const newErrors: { [key: string]: string } = {};
        if (!selectedFile) {
            newErrors.file = "Please upload a file";
            errorMessage("Please upload a file");
        } else {
            try {
                const rawOrders = await readFile(selectedFile);
                const orders: Order[] = [];
                rawOrders.forEach((row, index) => {
                    const tracking_number = row["tracking_number"];
                    const receiver_name = row["receiver_name"];
                    const cod = row["cod"];
                    const custom_fees = row["custom_fees"];
                    const client_name = row["client_name"];
                    const driver_id = row["driver_id"];
                    if (!tracking_number) {
                        newErrors[`tracking_number_${index}`] = "Tracking number is required";
                        errorMessage(`Row ${index + 1}: Tracking number is required`);
                    }
                    if (!receiver_name || typeof receiver_name !== "string") {
                        newErrors[`receiver_name_${index}`] = "Receiver name is required and must be a string";
                        errorMessage(`Row ${index + 1}: Receiver name is required and must be a string`);
                    }
                    if (cod === undefined || cod === null || isNaN(parseFloat(cod))) {
                        newErrors[`cod_${index}`] = "COD must be a valid number";
                        errorMessage(`Row ${index + 1}: COD must be a valid number`);
                    }
                    if (custom_fees === undefined || custom_fees === null || isNaN(parseFloat(custom_fees))) {
                        newErrors[`custom_fees_${index}`] = "Custom fees must be a valid number";
                        errorMessage(`Row ${index + 1}: Custom fees must be a valid number`);
                    }
                    if (!client_name || typeof client_name !== "string") {
                        newErrors[`client_name_${index}`] = "Client name is required and must be a string";
                        errorMessage(`Row ${index + 1}: Client name is required and must be a string`);
                    }
                    if (!newErrors[`tracking_number_${index}`] &&
                        !newErrors[`receiver_name_${index}`] &&
                        !newErrors[`cod_${index}`] &&
                        !newErrors[`custom_fees_${index}`] &&
                        !newErrors[`client_name_${index}`]) {
                        orders.push({
                            tracking_number: tracking_number.trim(),
                            receiver_name: receiver_name.trim(),
                            cod: parseFloat(cod),
                            custom_fees: parseFloat(custom_fees),
                            client_name: client_name.trim(),
                            driver_id: parseInt(driver_id),
                        });
                    }
                });

                if (!orders.length) {
                    newErrors.file = "No valid rows found in file.";
                    errorMessage("No valid rows found in file.");
                }

            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                newErrors.file = msg;
                errorMessage(msg);
            }
        }

        if (!driverId) {
            newErrors.driverId = "Please select a driver";
            errorMessage("Please select a driver");
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Upload the parsed valid orders
        const finalOrders = await readFile(selectedFile!); // you might want to reuse `orders` instead
        const formattedOrders = finalOrders.map((order: Order) => ({
            tracking_number: order.tracking_number,
            receiver_name: order.receiver_name,
            cod: order.cod ?? undefined,
            custom_fees: order.custom_fees ?? undefined,
            client_name: order.client_name ?? undefined,
            driverId: driverId,
        }));

        onUpload(formattedOrders, Number(driverId));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                Upload Orders
            </DialogTitle>
            <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white space-y-5">
                <div>
                    <Autocomplete
                        options={userOptions}
                        getOptionLabel={(option) => option.label}
                        value={userOptions.find((u: UserLookup) => u.id === driverId) || null}
                        onChange={(_, newValue) => setDriverId(newValue?.id || null)}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Assign Orders to Driver"
                                error={!!errors.driverId}
                                helperText={errors.driverId}
                                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        )}
                    />
                </div>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                        ${isDragActive ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"}
                    `}
                >
                    <input {...getInputProps()} />
                    {selectedFile ? (
                        <p className="text-green-600 dark:text-green-400 font-medium">
                            Selected File: {selectedFile.name}
                        </p>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-300">
                            Drag & drop a file here, or click to select a file (CSV, XLSX)
                        </p>
                    )}
                    {errors.file && <p className="text-red-500 text-sm mt-2">{errors.file}</p>}
                </div>
            </DialogContent>
            <DialogActions className="bg-white dark:bg-gray-800">
                <Button onClick={onClose} color="secondary" className="text-gray-800 dark:text-gray-300">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    className="bg-blue-500 dark:bg-blue-700"
                >
                    {loading ? "Uploading..." : "Upload"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
