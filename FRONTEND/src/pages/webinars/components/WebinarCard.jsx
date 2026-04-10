import { motion } from "framer-motion";
import Badge from "../../../devconnect/ui/Badge";
import Button from "../../../devconnect/ui/Button";
import Card from "../../../devconnect/ui/Card";
import Icon from "../../../devconnect/ui/Icon";

const statusColor = {
    upcoming: "violet",
    live: "rose",
    completed: "gray",
};

const WebinarCard = ({
    webinar,
    isMentor,
    isBusy,
    onRegister,
    onUnregister,
    onAddCalendar,
    onStart,
    onOpenMeeting,
    onEdit,
    onDelete,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={{ y: -6 }}
        >
            <Card
                className={`p-5 bg-white/70 backdrop-blur-md border-white/60 shadow-lg shadow-slate-200/70 hover:shadow-xl hover:shadow-slate-300/70 transition-all ${
                    webinar.status === "live" ? "ring-2 ring-rose-400/70" : ""
                }`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-lg font-bold text-white flex items-center gap-2">
                            {webinar.title}
                            {webinar.status === "live" ? (
                                <span className="text-xs font-bold text-rose-600">🔴 LIVE</span>
                            ) : null}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{webinar.speaker}</div>
                    </div>
                    <Badge color={statusColor[webinar.status] || "gray"}>
                        {webinar.status === "upcoming"
                            ? "Upcoming"
                            : webinar.status === "live"
                                ? "Live"
                                : "Completed"}
                    </Badge>
                </div>

                <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <Icon name="calendar" size={14} />
                        {webinar.displayDate}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon name="activity" size={14} />
                        {webinar.duration || 60} min
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon name="target" size={14} />
                        {webinar.tag || "Career"}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon name="users" size={14} />
                        {webinar.registrationCount || 0} registered
                    </div>
                </div>

                {isMentor ? (
                    <div className="mt-5 flex flex-wrap gap-2 justify-end">
                        {webinar.status === "upcoming" ? (
                            <Button onClick={() => onStart(webinar)} disabled={isBusy}>Start Meeting</Button>
                        ) : null}

                        {webinar.status === "live" ? (
                            <>
                                <Button onClick={() => onOpenMeeting(webinar)} disabled={isBusy}>Open Meeting</Button>
                                <Badge color="emerald">Participants: {Math.max(1, webinar.registrationCount || 0)}</Badge>
                                <Badge color="violet">Network: Good</Badge>
                                <Button variant="secondary" disabled>
                                    Screen Share
                                </Button>
                                <Badge color="amber">Active Speaker: Host</Badge>
                            </>
                        ) : null}

                        <Button variant="secondary" onClick={() => onEdit(webinar)} disabled={isBusy}>Edit</Button>
                        <Button variant="ghost" onClick={() => onDelete(webinar)} disabled={isBusy}>Delete</Button>
                    </div>
                ) : (
                    <div className="mt-5 flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => onAddCalendar(webinar)} disabled={isBusy}>
                            Add to Calendar
                        </Button>
                        {webinar.status === "live" && webinar.isRegistered ? (
                            <Button onClick={() => onOpenMeeting(webinar)} disabled={isBusy}>
                                Join Meeting
                            </Button>
                        ) : null}
                        {webinar.status === "live" && !webinar.isRegistered ? (
                            <Button onClick={() => onRegister(webinar)} disabled={isBusy}>
                                Register to Join
                            </Button>
                        ) : null}
                        {webinar.isRegistered ? (
                            <Button variant="success" disabled={isBusy}>
                                Already Registered
                            </Button>
                        ) : null}
                        {webinar.isRegistered ? (
                            <Button variant="ghost" onClick={() => onUnregister(webinar)} disabled={isBusy}>
                                Unregister
                            </Button>
                        ) : webinar.status !== "live" ? (
                            <Button onClick={() => onRegister(webinar)} disabled={isBusy}>Register</Button>
                        ) : null}
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default WebinarCard;
