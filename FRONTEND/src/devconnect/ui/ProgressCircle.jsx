import { motion } from "framer-motion";

const ProgressCircle = ({
    value = 0,
    max = 100,
    label = "Career Readiness",
    size = 54,
    strokeWidth = 6,
}) => {
    const safeValue = Math.max(0, Math.min(max, Number(value) || 0));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (safeValue / max) * circumference;

    return (
        <div className="flex items-center gap-2">
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgb(203 213 225)"
                    strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#career-gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="career-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                </defs>
            </svg>
            <div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-sm font-bold text-slate-900">{Math.round(safeValue)}%</div>
            </div>
        </div>
    );
};

export default ProgressCircle;
