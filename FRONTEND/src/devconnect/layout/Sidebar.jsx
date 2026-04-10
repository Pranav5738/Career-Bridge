import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon from "../ui/Icon";

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "home", to: "/dashboard" },
    { id: "marketplace", label: "Mentors", icon: "users", to: "/marketplace" },
    { id: "resume", label: "Resume Analyzer", icon: "file", to: "/resume" },
    { id: "skills", label: "Skill Gap", icon: "cpu", to: "/skills" },
    { id: "interview", label: "Mock Interview", icon: "mic", to: "/interview" },
    { id: "webinars", label: "Webinars", icon: "video", to: "/webinars" },
    { id: "forum", label: "Community", icon: "message", to: "/forum" },
    { id: "profile", label: "Profile", icon: "user", to: "/profile" },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const dashboardPath = user?.role === "mentor" ? "/mentor-dashboard" : "/dashboard";

    const items = navItems.map((i) =>
        i.id === "dashboard" ? { ...i, to: dashboardPath } : i
    );

    const handleSignOut = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur border-r border-slate-200 z-30 flex flex-col transition-all duration-300 ${
                collapsed ? "w-16" : "w-60"
            }`}
        >
            <div className="flex items-center gap-3 p-4 h-16 border-b border-slate-200">
                <img
                    src="/favicon.svg?v=2"
                    alt="Career Bridge"
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                />
                {!collapsed && (
                    <span className="font-black text-slate-900 text-lg tracking-tight">
                        Career <span className="text-sky-600">Bridge</span>
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto text-slate-500 hover:text-slate-900 transition-colors p-1"
                >
                    <Icon
                        name={collapsed ? "chevronRight" : "chevronLeft"}
                        size={16}
                    />
                </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
                {items.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.to}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? "bg-sky-50 text-sky-700 border border-sky-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    name={item.icon}
                                    size={17}
                                    className="flex-shrink-0"
                                />
                                {!collapsed && <span>{item.label}</span>}
                                {!collapsed && isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-3 border-t border-slate-200">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
                >
                    <Icon name="logout" size={17} className="flex-shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
