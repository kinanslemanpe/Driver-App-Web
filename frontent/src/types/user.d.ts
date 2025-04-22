interface UserLookup {
    id: number;
    name: string;
}

interface UserState {
    users: Array<>;
    loading: boolean;
    error: string | null;
}