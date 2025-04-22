
export interface WhatsAppTemplate {
    key: string;
    message: string;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface WhatsAppTemplateState {
    templates: WhatsAppTemplate[];
    loading: boolean;
    error: string | null;
}