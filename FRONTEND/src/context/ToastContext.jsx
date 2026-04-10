/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Toast from "../devconnect/ui/Toast";

const ToastCtx = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    const addToast = useCallback((message, type = "success") => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setToasts((t) => [...t, { id, message, type }]);
    }, []);

    const value = useMemo(() => ({ addToast }), [addToast]);

    return (
        <ToastCtx.Provider value={value}>
            {children}
            <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
                {toasts.map((t) => (
                    <Toast
                        key={t.id}
                        message={t.message}
                        type={t.type}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>
        </ToastCtx.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastCtx);
    if (!ctx) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return ctx;
};
