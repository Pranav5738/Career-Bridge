/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";

const readStoredSession = () => {
    try {
        const userRaw = localStorage.getItem(USER_STORAGE_KEY);
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);

        return {
            user: userRaw ? JSON.parse(userRaw) : null,
            token: token || null,
        };
    } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        return {
            user: null,
            token: null,
        };
    }
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(() => readStoredSession());

    const persistSession = (nextUser, nextToken) => {
        if (nextUser) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }

        if (nextToken) {
            localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }

        setSession({
            user: nextUser,
            token: nextToken || null,
        });
    };

    const login = (userData, authToken) => {
        const nextUser = userData?.user ?? userData ?? null;
        const nextToken = authToken ?? userData?.token ?? null;
        persistSession(nextUser, nextToken);
    };

    const updateUser = (nextUser) => {
        persistSession(nextUser, session.token);
    };

    const logout = () => {
        persistSession(null, null);
    };

    return <AuthContext.Provider value={{ user: session.user, token: session.token, login, updateUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);