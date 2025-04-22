import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton } from '@mui/material';
import WhatsappTemplateModal from '../components/modal/WhatsappTemplateModal';
import { AppDispatch, RootState } from '../store';
import {
    createWhatsAppTemplate,
    updateWhatsAppTemplate,
    fetchWhatsAppTemplates
} from '../store/slices/whatsappTemplateSlice.ts';
import {userIsAdmin} from "../utils/functions.ts";

const WhatsappTemplates: React.FC = () => {
    const { templates, loading } = useSelector((state: RootState) => state.whatsappTemplate);
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [modalOpen, setModalOpen] = useState(false);
    const [editTemplate, setEditTemplate] = useState<{
        key: string;
        message: string;
        active: boolean;
    } | null>(null);

    const handleCreate = () => {
        setEditTemplate(null);
        setModalOpen(true);
    };

    const handleEdit = (template: { key: string; message: string; active: boolean }) => {
        if(!userIsAdmin(user)) {
            return;
        }
        setEditTemplate({
            key: template.key,
            message: template.message,
            active: template.active
        });
        setModalOpen(true);
    };

    const handleSubmit = (data: { key: string; message: string; active: boolean }) => {
        if (editTemplate) {
            dispatch(updateWhatsAppTemplate(data));
        } else {
            dispatch(createWhatsAppTemplate(data));
        }
        setModalOpen(false);
    };

    useEffect(() => {
        dispatch(fetchWhatsAppTemplates());
    }, [dispatch]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Whatsapp Templates</h1>
                {/*<button*/}
                {/*    onClick={handleCreate}*/}
                {/*    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"*/}
                {/*>*/}
                {/*    Create Template*/}
                {/*</button>*/}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {Array.from({ length: 1 }).map((_, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md"
                        >
                            <Skeleton variant="rectangular" height={40} className="mb-2" />
                            <Skeleton variant="text" width="60%" className="mb-2" />
                            <Skeleton variant="text" width="40%" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template.key}
                            onClick={() => handleEdit(template)}
                            className="cursor-pointer p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:shadow-md"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-800 dark:text-white">
                                    {template.key}
                                </span>
                                <span
                                    className={`text-sm px-2 py-1 rounded ${
                                        template.active
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-red-200 text-red-800'
                                    }`}
                                >
                                    {template.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 truncate">{template.message}</p>
                        </div>
                    ))}
                </div>
            )}

            <WhatsappTemplateModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editTemplate}
                isEditing={!!editTemplate}
            />
        </div>
    );
};

export default WhatsappTemplates;
