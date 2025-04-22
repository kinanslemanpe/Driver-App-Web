import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Stack,
    Box,
} from "@mui/material";
import { useState, useEffect } from "react";

interface AddDriverModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (driver: {
        name: string;
        email: string;
        phone: string;
        password: string;
    }) => void;
}

const initialDriver = {
    name: "",
    email: "",
    phone: "",
    password: "",
};

export default function AddDriverModal({
                                           open,
                                           onClose,
                                           onSave,
                                       }: AddDriverModalProps) {
    const [driver, setDriver] = useState(initialDriver);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (open) {
            setDriver(initialDriver);
            setErrors({});
            setShowPassword(false);
        }
    }, [open]);

    const handleChange = (field: keyof typeof driver, value: string) => {
        setDriver((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!driver.name.trim()) newErrors.name = "Name is required";
        if (!driver.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(driver.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!driver.phone.trim()) newErrors.phone = "Phone is required";
        if (!driver.password.trim()) newErrors.password = "Password is required";
        else if (driver.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSave(driver);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    color: "text.primary",
                    bgcolor: "background.paper",
                }}
            >
                Add New Driver
            </DialogTitle>
            <DialogContent
                sx={{
                    bgcolor: "background.paper",
                    color: "text.primary",
                }}
            >
                <Box mt={2}>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={driver.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={driver.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            value={driver.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            value={driver.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={{
                                "& .MuiOutlinedInput-input:focus": {
                                    "--tw-ring-color": "transparent",
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: "text.secondary" }}
                                        >
                                            {showPassword ? (
                                                <i className="fa-solid fa-eye cursor-pointer" />
                                            ) : (
                                                <i className="fa-solid fa-eye-slash cursor-pointer" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    bgcolor: "background.paper",
                }}
            >
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        bgcolor: "primary.main",
                        "&:hover": {
                            bgcolor: "primary.dark",
                        },
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
