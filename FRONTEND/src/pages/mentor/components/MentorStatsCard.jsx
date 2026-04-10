import { motion } from "framer-motion";
import Card from "../../../devconnect/ui/Card";
import Icon from "../../../devconnect/ui/Icon";

const MentorStatsCard = ({ label, value, icon, accent = "violet" }) => {
    const accentClass =
        accent === "emerald"
            ? "bg-emerald-500/15 text-emerald-500"
            : accent === "amber"
                ? "bg-amber-500/15 text-amber-500"
                : "bg-violet-500/15 text-violet-500";

    return (
        <motion.div whileHover={{ y: -4 }}>
            <Card className="p-5 bg-white/70 border-white/60 backdrop-blur-md shadow-lg shadow-slate-200/70">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentClass}`}>
                        <Icon name={icon} size={18} />
                    </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">{value}</div>
            </Card>
        </motion.div>
    );
};

export default MentorStatsCard;
