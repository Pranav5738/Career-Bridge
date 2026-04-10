const Card = ({ children, className = "", glow = false, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border bg-white border-slate-200 transition-all duration-300 ${
                glow
                    ? "hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100"
                    : "hover:border-slate-300"
            } ${onClick ? "cursor-pointer" : ""} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
