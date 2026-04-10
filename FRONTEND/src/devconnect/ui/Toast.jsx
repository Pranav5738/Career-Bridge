import { useEffect } from "react";
import Icon from "./Icon";

const Toast = ({ message, type = "success", onClose }) => {
    const icons = { success: "check", error: "x", info: "bell" };
    const colors = {
        success: "border-emerald-200 text-emerald-700",
        error: "border-rose-200 text-rose-700",
        info: "border-sky-200 text-sky-700",
    };

    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
            className={`flex items-center gap-3 bg-white border ${
                colors[type] || colors.info
            } rounded-xl px-4 py-3 shadow-lg min-w-[280px]`}
        >
            <Icon name={icons[type] || "bell"} size={16} />
            <span className="text-sm text-slate-800 flex-1">{message}</span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                <Icon name="x" size={14} />
            </button>
        </div>
    );
};

export default Toast;
