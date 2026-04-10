const Badge = ({ children, color = "violet", className = "" }) => {
    const colors = {
        violet: "bg-violet-100 text-violet-700 border border-violet-200",
        indigo: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        emerald: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        amber: "bg-amber-100 text-amber-700 border border-amber-200",
        rose: "bg-rose-100 text-rose-700 border border-rose-200",
        cyan: "bg-cyan-100 text-cyan-700 border border-cyan-200",
        gray: "bg-slate-100 text-slate-600 border border-slate-200",
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
