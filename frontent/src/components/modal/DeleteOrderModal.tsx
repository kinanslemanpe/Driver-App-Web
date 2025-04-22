import { FC } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface DeleteOrderModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
}

const DeleteOrderModal: FC<DeleteOrderModalProps> = ({
                                                         open,
                                                         onClose,
                                                         onConfirm,
                                                         message = "Are you sure you want to delete this order?",
                                                     }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 3,
                    boxShadow: 24,
                    width: 400,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {message}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteOrderModal;
