import { useTheme } from "../../context/ThemeContext";

const Card = ({ children, className = "", glow = false, onClick }) => {
    const { isDark } = useTheme();

    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border transition-all duration-300 ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            } ${
                glow
                    ? isDark
                        ? "hover:border-sky-700/70 hover:shadow-lg hover:shadow-sky-950/40"
                        : "hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100"
                    : isDark
                        ? "hover:border-slate-700"
                        : "hover:border-slate-300"
            } ${onClick ? "cursor-pointer" : ""} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
