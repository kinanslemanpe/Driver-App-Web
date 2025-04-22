import { createContext, useContext, useState, ReactNode } from "react";
import {User} from "../types/auth";
interface AuthContextType {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
}
const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});
interface ContextProviderProps {
    children: ReactNode;
}
export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, _setToken] = useState<string | null>(localStorage.getItem("ACCESS_TOKEN"));
    const setToken = (token: string | null) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
