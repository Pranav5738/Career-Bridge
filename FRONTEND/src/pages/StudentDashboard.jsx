import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { ProgressBar } from "../devconnect/ui/Progress";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const name = useMemo(() => {
        const email = user?.email ?? "";
        const base = email.split("@")[0] || "Student";
        return base
            .split(/[._-]+/)
            .filter(Boolean)
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
    }, [user?.email]);

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            try {
                const response = await apiRequest("/api/dashboard/student");
                if (active) {
                    setDashboard(response?.dashboard ?? null);
                }
            } catch {
                if (active) {
                    setDashboard(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const resumeScore = dashboard?.resumeScore ?? 0;
    const sessions = dashboard?.sessions ?? 0;
    const interviews = dashboard?.interviews ?? 0;
    const hasActivity = resumeScore > 0 || sessions > 0 || interviews > 0;

    const stats = [
        { label: "Resume Score", value: `${resumeScore}%`, icon: "file" },
        { label: "Mentor Sessions", value: String(sessions), icon: "users" },
        { label: "Mock Interviews", value: String(interviews), icon: "mic" },
        {
            label: "Skill Plan",
            value: hasActivity ? "Ready" : "Not started",
            icon: "target",
        },
    ];

    const focusRows = hasActivity
        ? [
              { label: "Resume Review", value: Math.min(resumeScore || 0, 100) },
              { label: "Interview Practice", value: Math.min(40 + interviews * 12, 100) },
              { label: "Mentor Check-ins", value: Math.min(sessions * 12, 100) },
          ]
        : [];

    const quickLinks = [
        { label: "Resume AI", icon: "file", path: "/resume" },
        { label: "Skill Gap", icon: "target", path: "/skills" },
        { label: "Webinars", icon: "calendar", path: "/webinars" },
        { label: "Forum", icon: "message", path: "/forum" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">
                        Welcome back{user?.email ? "," : ""} {user?.email ? name : ""}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Track progress and jump into your next practice.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate("/marketplace")}>
                        Find Mentors
                    </Button>
                    <Button onClick={() => navigate("/interview")}>
                        Start Mock <Icon name="arrowRight" size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <Card key={s.label} className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">{s.label}</div>
                            <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
                                <Icon name={s.icon} size={18} />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white mt-3">
                            {s.value}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <Card className="p-5 xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-white">Today’s Focus</div>
                        <Badge color="violet">AI Plan</Badge>
                    </div>
                    {loading ? (
                        <div className="mt-4 space-y-4">
                            {[0, 1, 2].map((index) => (
                                <div
                                    key={index}
                                    className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4 animate-pulse"
                                >
                                    <div className="h-4 w-32 rounded bg-gray-800/80 mb-4" />
                                    <div className="h-2.5 w-full rounded-full bg-gray-800/80" />
                                </div>
                            ))}
                        </div>
                    ) : hasActivity ? (
                        <div className="mt-4 space-y-4">
                            {focusRows.map((row) => (
                                <div key={row.label} className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-semibold text-white">
                                            {row.label}
                                        </div>
                                        <Badge
                                            color={row.value >= 70 ? "emerald" : row.value >= 50 ? "violet" : "rose"}
                                        >
                                            {row.value}%
                                        </Badge>
                                    </div>
                                    <ProgressBar value={row.value} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 rounded-2xl border border-dashed border-gray-800/80 bg-gray-900/20 p-6 text-sm text-gray-400">
                            No focus plan yet. Complete your first resume analysis, mock interview, or mentor session to generate personalized progress here.
                        </div>
                    )}
                </Card>

                <Card className="p-5">
                    <div className="font-bold text-white">Quick Links</div>
                    <div className="mt-4 space-y-2">
                        {quickLinks.map((l) => (
                            <button
                                key={l.path}
                                type="button"
                                onClick={() => navigate(l.path)}
                                className="w-full flex items-center justify-between gap-3 bg-gray-900/30 border border-gray-800/70 rounded-2xl px-4 py-3 text-sm text-gray-200 hover:border-violet-500/40 hover:bg-gray-900/50 transition"
                            >
                                <span className="flex items-center gap-2">
                                    <Icon name={l.icon} size={16} className="text-violet-400" />
                                    {l.label}
                                </span>
                                <Icon name="chevronRight" size={16} className="text-gray-500" />
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;