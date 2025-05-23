export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    roles: {
        "name": string,
        "guard_name": string
    }[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role: 'admin' | 'driver';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
