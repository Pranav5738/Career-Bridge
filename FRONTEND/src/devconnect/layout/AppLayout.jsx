import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const left = collapsed ? "ml-16" : "ml-60";

    return (
        <div className="dc-light min-h-screen bg-slate-50 text-slate-900">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Topbar sidebarCollapsed={collapsed} />
            <main className={`${left} pt-16 transition-all duration-300`}>
                <motion.div
                    className="p-6"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default AppLayout;
