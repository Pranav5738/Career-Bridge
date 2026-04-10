import { motion, AnimatePresence } from "framer-motion";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";

const NotificationDropdown = ({ open, notifications, onAction }) => {
    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40"
                >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-slate-200 mb-1">
                        <span className="text-sm font-semibold text-slate-900">Notifications</span>
                        <Badge color="violet">
                            {notifications.filter((n) => n.unread).length} unread
                        </Badge>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="px-3 py-7 text-sm text-slate-500">No new notifications</div>
                    ) : (
                        <div className="max-h-96 overflow-auto">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`rounded-xl px-3 py-3 border mb-2 ${
                                        n.unread ? "bg-violet-50 border-violet-100" : "bg-white border-slate-200"
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className="pt-0.5 text-violet-500">
                                            <Icon name={n.icon || "bell"} size={14} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                                            <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[11px] text-slate-500">{n.time}</span>
                                                {n.actionLabel ? (
                                                    <Button size="sm" variant="ghost" onClick={() => onAction?.(n)}>
                                                        {n.actionLabel}
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
