import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import TextEditor from "../editor/TextEditor";

interface WhatsappTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { key: string; message: string; active: boolean }) => void;
    initialData?: { key: string; message: string; active: boolean };
    isEditing?: boolean;
}

export default function WhatsappTemplateModal({
                                                  isOpen,
                                                  onClose,
                                                  onSubmit,
                                                  initialData,
                                                  isEditing = false,
                                              }: WhatsappTemplateModalProps) {
    const [key, setKey] = useState("");
    const [message, setMessage] = useState("");
    const [active, setActive] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [invalidVariables, setInvalidVariables] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setKey(initialData.key);
            setMessage(initialData.message);
            setActive(true);
        } else {
            setKey("");
            setMessage("");
            setActive(false);
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!key.trim()) newErrors.key = "Template key is required";
        if (!message.trim()) newErrors.message = "Message body is required";
        if (invalidVariables.length > 0)
            newErrors.message = "Message contains invalid variables.";
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSubmit({ key, message, active });
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                {isEditing ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <Grid container spacing={2} direction="column" sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Template Key"
                            fullWidth
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            error={!!errors.key}
                            helperText={errors.key}
                            disabled={isEditing}
                            className="bg-white dark:bg-gray-700"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                            Message Body
                        </label>
                        <TextEditor
                            value={message}
                            onChange={setMessage}
                            onInvalidVariablesChange={setInvalidVariables}
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                        )}
                    </Grid>

                    {/*<Grid item xs={12}>*/}
                    {/*    <FormControlLabel*/}
                    {/*        control={*/}
                    {/*            <Checkbox*/}
                    {/*                checked={active}*/}
                    {/*                onChange={(e) => setActive(e.target.checked)}*/}
                    {/*            />*/}
                    {/*        }*/}
                    {/*        label="Active"*/}
                    {/*        className="text-gray-800 dark:text-gray-300"*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                </Grid>
            </DialogContent>

            <DialogActions className="bg-white dark:bg-gray-800">
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                >
                    {isEditing ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
