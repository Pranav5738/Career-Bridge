import { useTheme } from "../../context/ThemeContext";

const Badge = ({ children, color = "violet", className = "" }) => {
    const { isDark } = useTheme();

    const colors = {
        violet: isDark
            ? "bg-violet-500/15 text-violet-300 border border-violet-500/35"
            : "bg-violet-100 text-violet-700 border border-violet-200",
        indigo: isDark
            ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/35"
            : "bg-indigo-100 text-indigo-700 border border-indigo-200",
        emerald: isDark
            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/35"
            : "bg-emerald-100 text-emerald-700 border border-emerald-200",
        amber: isDark
            ? "bg-amber-500/15 text-amber-300 border border-amber-500/35"
            : "bg-amber-100 text-amber-700 border border-amber-200",
        rose: isDark
            ? "bg-rose-500/15 text-rose-300 border border-rose-500/35"
            : "bg-rose-100 text-rose-700 border border-rose-200",
        cyan: isDark
            ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/35"
            : "bg-cyan-100 text-cyan-700 border border-cyan-200",
        gray: isDark
            ? "bg-slate-700/40 text-slate-200 border border-slate-600"
            : "bg-slate-100 text-slate-600 border border-slate-200",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;
