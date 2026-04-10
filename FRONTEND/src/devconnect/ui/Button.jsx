import Icon from "./Icon";

const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    onClick,
    disabled,
    icon,
    type = "button",
}) => {
    const base =
        "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none";

    const variants = {
        primary:
            "bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-500 hover:to-cyan-500 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 hover:-translate-y-0.5",
        secondary:
            "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5",
        ghost: "text-slate-700 hover:bg-slate-100 hover:-translate-y-0.5",
        danger: "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/25",
        outline:
            "border-2 border-sky-600 text-sky-700 hover:bg-sky-600 hover:text-white",
        success:
            "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base",
    };

    return (
        <button
            type={type}
            className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <Icon name={icon} size={16} />}
            {children}
        </button>
    );
};

export default Button;
