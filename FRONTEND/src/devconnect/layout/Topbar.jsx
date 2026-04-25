import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { apiRequest, resolveApiUrl } from "../../utils/api";
import Badge from "../ui/Badge";
import ProgressCircle from "../ui/ProgressCircle";
import Icon from "../ui/Icon";
import GlobalSearch from "./topbar/GlobalSearch";
import NotificationDropdown from "./topbar/NotificationDropdown";

const Topbar = ({ sidebarCollapsed }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [webinars, setWebinars] = useState([]);
    const [careerScore, setCareerScore] = useState(0);

    const left = sidebarCollapsed ? "ml-16" : "ml-60";

    const displayName = (() => {
        if (user?.name?.trim()) return user.name.trim();
        if (!user?.email) return "Jordan";
        const namePart = user.email.split("@")[0] || "Jordan";
        const words = namePart
            .split(/[._-]+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
        return words.join(" ") || "Jordan";
    })();

    const avatarSrc = user?.avatarUrl ? resolveApiUrl(user.avatarUrl) : "";

    const initials = (() => {
        const parts = displayName.split(" ").filter(Boolean);
        const first = parts[0]?.[0] ?? "J";
        const second = parts[1]?.[0] ?? "K";
        return (first + second).toUpperCase();
    })();

    const notifications = useMemo(() => {
        const firstWebinar = webinars[0];

        return [
            {
                id: "booking-confirmed",
                title: "Booking confirmed",
                message: "Your mentoring session is confirmed.",
                time: "2m ago",
                unread: true,
                icon: "check",
                actionLabel: "View",
                actionPath: "/marketplace",
            },
            {
                id: "feedback-ready",
                title: "Interview feedback ready",
                message: "Your latest mock interview report is available.",
                time: "18m ago",
                unread: true,
                icon: "mic",
                actionLabel: "View",
                actionPath: "/interview",
            },
            {
                id: "webinar-reminder",
                title: "Webinar reminder",
                message: firstWebinar
                    ? `${firstWebinar.title || "Webinar"} is coming up soon.`
                    : "Your next webinar starts soon.",
                time: "1h ago",
                unread: false,
                icon: "calendar",
                actionLabel: "Join",
                actionPath: "/webinars",
            },
        ];
    }, [webinars]);

    useEffect(() => {
        let mounted = true;

        const loadTopbarData = async () => {
            try {
                const [mentorResult, webinarResult] = await Promise.all([
                    apiRequest("/api/marketplace/mentors", { auth: false }).catch(() => ({ mentors: [] })),
                    apiRequest("/api/webinars", { auth: false }).catch(() => ({ webinars: [] })),
                ]);

                if (!mounted) return;

                setMentors(Array.isArray(mentorResult?.mentors) ? mentorResult.mentors : []);
                setWebinars(Array.isArray(webinarResult?.webinars) ? webinarResult.webinars : []);

                if (user?.role === "mentor") {
                    const mentorDash = await apiRequest("/api/dashboard/mentor").catch(() => null);
                    const sessions = Number(mentorDash?.dashboard?.sessions || 0);
                    const earnings = Number(mentorDash?.dashboard?.earnings || 0);
                    const score = Math.min(100, Math.round(sessions * 12 + earnings / 150));
                    setCareerScore(score);
                } else {
                    const studentDash = await apiRequest("/api/dashboard/student").catch(() => null);
                    const resumeScore = Number(studentDash?.dashboard?.resumeScore || 0);
                    const interviews = Number(studentDash?.dashboard?.interviews || 0);
                    const sessions = Number(studentDash?.dashboard?.sessions || 0);
                    const skillReadiness = 60;
                    const score = Math.round(
                        resumeScore * 0.45 + skillReadiness * 0.3 + Math.min(100, interviews * 20 + sessions * 8) * 0.25,
                    );
                    setCareerScore(Math.min(100, Math.max(0, score)));
                }
            } catch {
                if (mounted) {
                    setCareerScore(0);
                }
            }
        };

        loadTopbarData();

        return () => {
            mounted = false;
        };
    }, [user?.role]);

    const groupedResults = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) {
            return [
                { key: "mentors", label: "Mentors", items: [] },
                { key: "webinars", label: "Webinars", items: [] },
                { key: "skills", label: "Skills", items: [] },
            ];
        }

        const mentorItems = mentors
            .filter((m) => `${m.name || ""} ${m.title || ""}`.toLowerCase().includes(q))
            .slice(0, 5)
            .map((m, index) => ({
                id: `mentor-${m.id || index}`,
                title: m.name || "Mentor",
                subtitle: m.title || "Mentor",
                path: "/marketplace",
            }));

        const webinarItems = webinars
            .filter((w) => `${w.title || ""} ${w.tag || ""}`.toLowerCase().includes(q))
            .slice(0, 5)
            .map((w, index) => ({
                id: `webinar-${w._id || w.id || index}`,
                title: w.title || "Webinar",
                subtitle: w.tag || "Live session",
                path: "/webinars",
            }));

        const skillsCatalog = [
            "System Design",
            "Algorithms",
            "Data Structures",
            "Behavioral",
            "Backend",
            "Frontend",
            "Databases",
            "Negotiation",
        ];

        const skillItems = skillsCatalog
            .filter((skill) => skill.toLowerCase().includes(q))
            .slice(0, 5)
            .map((skill, index) => ({
                id: `skill-${index}`,
                title: skill,
                subtitle: "Skill roadmap",
                path: "/skills",
            }));

        return [
            { key: "mentors", label: "Mentors", items: mentorItems },
            { key: "webinars", label: "Webinars", items: webinarItems },
            { key: "skills", label: "Skills", items: skillItems },
        ];
    }, [mentors, search, webinars]);

    const onSelectSearchItem = (item) => {
        setSearchOpen(false);
        setSearch("");
        if (item?.path) {
            navigate(item.path);
        }
    };

    const handleNotificationAction = (notification) => {
        setNotifOpen(false);
        if (notification?.actionPath) {
            navigate(notification.actionPath);
        }
    };

    const handleSignOut = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <header
            className={`fixed top-0 right-0 ${left} h-16 z-20 flex items-center justify-between px-6 bg-white/90 backdrop-blur-xl border-b border-slate-200 transition-all duration-300`}
        >
            <div className="flex items-center gap-4 w-full max-w-3xl">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-slate-500 text-sm">Good morning,</span>
                    <span className="text-slate-900 text-sm font-semibold">{displayName}</span>
                </div>

                <GlobalSearch
                    query={search}
                    onChange={(value) => {
                        setSearch(value);
                        setSearchOpen(Boolean(value.trim()));
                    }}
                    open={searchOpen}
                    groups={groupedResults}
                    onSelect={onSelectSearchItem}
                />
            </div>
            <div className="flex items-center gap-2">
                <ProgressCircle value={careerScore} label="Career Readiness" />

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                    <Icon name={isDark ? "sun" : "moon"} size={17} />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setNotifOpen((o) => !o);
                            setProfileOpen(false);
                            setSearchOpen(false);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all relative"
                    >
                        <Icon name="bell" size={17} />
                        {notifications.some((n) => n.unread) ? (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full" />
                        ) : null}
                    </button>
                    <NotificationDropdown
                        open={notifOpen}
                        notifications={notifications}
                        onAction={handleNotificationAction}
                    />
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setProfileOpen((o) => !o);
                            setNotifOpen(false);
                            setSearchOpen(false);
                        }}
                        className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                    >
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                alt="Profile"
                                className="w-7 h-7 rounded-lg object-cover border border-slate-300/60"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                                {initials}
                            </div>
                        )}
                        <span className="text-sm font-medium text-slate-700">{displayName.split(" ")[0]}</span>
                        <Icon name="chevronDown" size={14} className="text-slate-500" />
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/profile");
                                    setProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            >
                                <Icon name="user" size={15} /> Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/profile");
                                    setProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            >
                                <Icon name="settings" size={15} /> Settings
                            </button>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            >
                                <Icon name="logout" size={15} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
