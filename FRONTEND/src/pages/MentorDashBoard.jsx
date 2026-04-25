import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import { apiRequest } from "../utils/api";
import MentorStatsCard from "./mentor/components/MentorStatsCard";
import ActivityFeed from "./mentor/components/ActivityFeed";

const MentorDashboard = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartMode, setChartMode] = useState("weekly");
    const [webinars, setWebinars] = useState([]);

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            try {
                const [response, webinarResponse] = await Promise.all([
                    apiRequest("/api/dashboard/mentor"),
                    apiRequest("/api/webinars", { auth: false }).catch(() => ({ webinars: [] })),
                ]);

                if (active) {
                    setDashboard(response?.dashboard ?? null);
                    setWebinars(Array.isArray(webinarResponse?.webinars) ? webinarResponse.webinars : []);
                }
            } catch {
                if (active) {
                    setDashboard(null);
                    setWebinars([]);
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

    const sessions = dashboard?.sessions ?? 0;
    const earnings = dashboard?.earnings ?? 0;
    const hasActivity = sessions > 0 || earnings > 0;

    const chartData = chartMode === "weekly"
        ? [
              { label: "Mon", value: Math.max(20, Math.round(sessions * 6)) },
              { label: "Tue", value: Math.max(18, Math.round(sessions * 8)) },
              { label: "Wed", value: Math.max(15, Math.round(sessions * 10)) },
              { label: "Thu", value: Math.max(22, Math.round(sessions * 9)) },
              { label: "Fri", value: Math.max(26, Math.round(sessions * 11)) },
          ]
        : [
              { label: "W1", value: Math.max(30, Math.round(earnings / 180)) },
              { label: "W2", value: Math.max(24, Math.round(earnings / 200)) },
              { label: "W3", value: Math.max(28, Math.round(earnings / 170)) },
              { label: "W4", value: Math.max(35, Math.round(earnings / 160)) },
          ];

    const upcomingSessions = webinars
        .filter((item) => item?.dateTime && new Date(item.dateTime).getTime() > Date.now())
        .slice(0, 4)
        .map((item, index) => ({
            id: item._id || item.id || index,
            student: `Student ${index + 1}`,
            time: new Date(item.dateTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
            title: item.title || "Webinar session",
        }));

    const activityItems = [
        { id: "booking", icon: "users", title: "New booking received", time: "5m ago" },
        { id: "webinar", icon: "calendar", title: "Webinar starting soon", time: "24m ago" },
        { id: "earning", icon: "dollarSign", title: "Payout processed", time: "1h ago" },
    ];

    const stats = [
        { label: "Total Sessions", value: String(sessions), icon: "users" },
        { label: "Total Earnings", value: `$${earnings.toLocaleString()}`, icon: "dollarSign" },
        { label: "Avg Rating", value: hasActivity ? "0.0" : "--", icon: "star" },
        { label: "Completion Rate", value: hasActivity ? "0%" : "--", icon: "check" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">Mentor Hub</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage bookings, performance, and earnings.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => navigate("/webinars")}>
                        Go Live
                        <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 ml-2" aria-hidden="true" />
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/marketplace")}>
                        View Marketplace
                    </Button>
                    <Button onClick={() => navigate("/forum")}>Community</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((item) => (
                    <MentorStatsCard key={item.label} label={item.label} value={item.value} icon={item.icon} />
                ))}
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <Card className="p-5 xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-white">Earnings Chart</div>
                        <Badge color="violet">Analytics</Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Button
                            size="sm"
                            variant={chartMode === "weekly" ? "primary" : "secondary"}
                            onClick={() => setChartMode("weekly")}
                        >
                            Weekly
                        </Button>
                        <Button
                            size="sm"
                            variant={chartMode === "monthly" ? "primary" : "secondary"}
                            onClick={() => setChartMode("monthly")}
                        >
                            Monthly
                        </Button>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-800/70 bg-gray-900/20 p-4">
                        <div className="h-44 flex items-end gap-3">
                            {chartData.map((item) => (
                                <div key={item.label} className="flex-1">
                                    <div className="w-full bg-slate-200 rounded-xl h-36 flex items-end overflow-hidden">
                                        <div
                                            className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-xl transition-all duration-500"
                                            style={{ height: `${Math.max(8, Math.min(item.value, 100))}%` }}
                                        />
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-2 text-center">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="font-bold text-white">Upcoming Sessions</div>
                    <div className="mt-4 space-y-3">
                        {upcomingSessions.length ? (
                            upcomingSessions.map((session) => (
                                <div key={session.id} className="rounded-xl border border-gray-800/70 bg-gray-900/20 p-3">
                                    <div className="text-sm font-semibold text-white">{session.student}</div>
                                    <div className="text-xs text-gray-500 mt-1">{session.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">{session.time}</div>
                                    <Button size="sm" className="mt-3" onClick={() => navigate("/webinars")}>
                                        Join
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No upcoming sessions scheduled.</div>
                        )}
                    </div>

                    <div className="mt-6 border-t border-gray-800/60 pt-4">
                        <div className="font-bold text-white mb-3">Actions</div>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-center"
                                onClick={() => navigate("/profile")}
                            >
                                Update Profile
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-center"
                                onClick={() => navigate("/webinars/create")}
                            >
                                Host Webinar
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <ActivityFeed items={activityItems} />
                </div>
                <Card className="p-5">
                    <div className="font-bold text-white">Performance Notes</div>
                    <div className="mt-3 text-sm text-gray-500">
                        {hasActivity
                            ? "Great momentum. Keep consistency in session quality and response time."
                            : "Start by hosting your first webinar and opening booking slots to unlock insights."}
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        Weekly summary updates after each completed session.
                    </div>
                    <div className="mt-5">
                        <Button
                            variant="primary"
                            className="w-full justify-center"
                            onClick={() => navigate("/interview")}
                        >
                            Review Interview Trends
                        </Button>
                    </div>
                </Card>
            </div>

            {loading ? <div className="sr-only">Loading mentor dashboard...</div> : null}
        </div>
    );
};

export default MentorDashboard;
