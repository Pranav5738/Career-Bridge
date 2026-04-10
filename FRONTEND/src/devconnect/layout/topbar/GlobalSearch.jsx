import { AnimatePresence, motion } from "framer-motion";
import Icon from "../../ui/Icon";

const GlobalSearch = ({
    query,
    onChange,
    open,
    groups,
    onSelect,
}) => {
    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="search" size={15} />
                </span>
                <input
                    value={query}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search mentors, webinars, skills..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500"
                />
            </div>

            <AnimatePresence>
                {open ? (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 max-h-[380px] overflow-auto"
                    >
                        {groups.every((group) => group.items.length === 0) ? (
                            <div className="px-3 py-6 text-sm text-slate-500">No results found.</div>
                        ) : (
                            groups.map((group) => (
                                group.items.length ? (
                                    <div key={group.key} className="mb-2 last:mb-0">
                                        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            {group.label}
                                        </div>
                                        <div className="space-y-1">
                                            {group.items.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => onSelect(item)}
                                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                                                >
                                                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                                                    {item.subtitle ? (
                                                        <div className="text-xs text-slate-500 mt-0.5">{item.subtitle}</div>
                                                    ) : null}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            ))
                        )}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};

export default GlobalSearch;
