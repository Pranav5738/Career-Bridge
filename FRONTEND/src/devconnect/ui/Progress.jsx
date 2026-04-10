import { motion } from "framer-motion";

export const ProgressBar = ({
    value,
    max = 100,
    color = "violet",
    label,
    showValue = true,
}) => {
    const colors = {
        violet: "from-violet-600 to-indigo-500",
        emerald: "from-emerald-500 to-teal-500",
        amber: "from-amber-500 to-orange-500",
        rose: "from-rose-500 to-pink-500",
        cyan: "from-cyan-500 to-blue-500",
        indigo: "from-indigo-500 to-violet-500",
        gray: "from-gray-500 to-gray-400",
    };

    const pct = Math.min(100, (value / max) * 100);

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-slate-500">{label}</span>
                    {showValue && (
                        <span className="text-xs font-semibold text-slate-700">
                            {value}%
                        </span>
                    )}
                </div>
            )}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colors[color] || colors.violet} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

export const CircularScore = ({
    score,
    value,
    max = 100,
    label,
    size = 120,
    color = "#7c3aed",
}) => {
    const rawScore = Number.isFinite(score) ? score : Number.isFinite(value) ? value : 0;
    const safeScore = Math.max(0, Math.min(max, rawScore));
    const r = (size - 20) / 2;
    const circ = 2 * Math.PI * r;
    const pct = safeScore / max;
    const dash = circ * pct;

    return (
        <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="#1f2937"
                        strokeWidth={8}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={8}
                        strokeDasharray={`${dash} ${circ}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 1s ease" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">{Math.round(safeScore)}</span>
                    <span className="text-xs text-slate-500">/{max}</span>
                </div>
            </div>
            {label && (
                <span className="text-xs text-slate-500 font-medium text-center">
                    {label}
                </span>
            )}
        </motion.div>
    );
};
