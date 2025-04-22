export interface UserLookup {
    id: number;
    name: string;
}

export interface UserState {
    users: Array<>;
    loading: boolean;
    error: string | null;
}