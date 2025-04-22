

export interface Driver {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface CreateDriverData {
    name: string;
    email: string;
    phone?: string;
    password: string;
}

interface DriverState {
    drivers: Driver[];
    loading: boolean;
    error: string | null;
}