import { motion } from "framer-motion";
import Card from "../../../devconnect/ui/Card";
import WebinarCard from "./WebinarCard";

const WebinarList = ({
    webinars,
    isMentor,
    loading,
    busyId,
    onRegister,
    onUnregister,
    onAddCalendar,
    onStart,
    onOpenMeeting,
    onEdit,
    onDelete,
}) => {
    if (loading) {
        return (
            <div className="grid lg:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((item) => (
                    <Card
                        key={item}
                        className="p-5 bg-white/70 backdrop-blur-md border-white/60 shadow-lg shadow-slate-200/70 animate-pulse"
                    >
                        <div className="h-5 w-48 bg-slate-200 rounded" />
                        <div className="mt-3 h-4 w-32 bg-slate-200 rounded" />
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="h-3 bg-slate-200 rounded" />
                            <div className="h-3 bg-slate-200 rounded" />
                            <div className="h-3 bg-slate-200 rounded" />
                            <div className="h-3 bg-slate-200 rounded" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            className="grid lg:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
            {webinars.map((webinar) => (
                <WebinarCard
                    key={webinar.id}
                    webinar={webinar}
                    isMentor={isMentor}
                    isBusy={busyId === webinar.id}
                    onRegister={onRegister}
                    onUnregister={onUnregister}
                    onAddCalendar={onAddCalendar}
                    onStart={onStart}
                    onOpenMeeting={onOpenMeeting}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </motion.div>
    );
};

export default WebinarList;
