import Icon from "./Icon";

const Modal = ({ isOpen, open, onClose, title, children, size = "md" }) => {
    const visible = typeof isOpen === "boolean" ? isOpen : Boolean(open);

    if (!visible) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/25 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`relative w-full ${sizes[size]} bg-white border border-slate-200 rounded-2xl shadow-xl animate-in`}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <Icon name="x" size={18} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
