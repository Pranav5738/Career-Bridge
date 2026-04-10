import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../../devconnect/ui/Button";
import Badge from "../../../devconnect/ui/Badge";

const emptyForm = {
    title: "",
    speaker: "",
    meetingLink: "",
    location: "",
    date: "",
    time: "",
    tag: "",
    duration: 60,
};

const parseDateTime = (value) => {
    if (!value) {
        return { date: "", time: "" };
    }

    const dt = new Date(value);

    if (Number.isNaN(dt.getTime())) {
        return { date: "", time: "" };
    }

    const pad = (num) => String(num).padStart(2, "0");

    return {
        date: `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`,
        time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`,
    };
};

const buildIsoDateTime = (date, time) => {
    if (!date || !time) {
        return "";
    }

    const normalizedTime = time.length === 5 ? `${time}:00` : time;
    const localDate = new Date(`${date}T${normalizedTime}`);

    if (Number.isNaN(localDate.getTime())) {
        return "";
    }

    return localDate.toISOString();
};

const WebinarModal = ({
    isOpen,
    mode = "create",
    initialValues,
    onClose,
    onSubmit,
    loading,
}) => {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (initialValues) {
            const { date, time } = parseDateTime(initialValues.dateTime);
            setForm({
                title: initialValues.title || "",
                speaker: initialValues.speaker || "",
                meetingLink: initialValues.meetingLink || "",
                location: initialValues.location || "",
                date,
                time,
                tag: initialValues.tag || "",
                duration: Number(initialValues.duration) || 60,
            });
            setErrors({});
            return;
        }

        setForm(emptyForm);
        setErrors({});
    }, [initialValues, isOpen]);

    const title = useMemo(() => (mode === "edit" ? "Edit Webinar" : "Host Webinar"), [mode]);

    const validate = () => {
        const nextErrors = {};

        if (!form.title.trim()) nextErrors.title = "Title is required";
        if (!form.speaker.trim()) nextErrors.speaker = "Speaker is required";
        if (!form.date) nextErrors.date = "Date is required";
        if (!form.time) nextErrors.time = "Time is required";
        if (!form.tag.trim()) nextErrors.tag = "Topic tag is required";
        if (!form.duration || Number(form.duration) < 15) {
            nextErrors.duration = "Duration must be at least 15 minutes";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const submit = (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const dateTime = buildIsoDateTime(form.date, form.time);

        if (!dateTime) {
            setErrors((current) => ({
                ...current,
                date: "Invalid date",
                time: "Invalid time",
            }));
            return;
        }

        onSubmit({
            title: form.title,
            speaker: form.speaker,
            meetingLink: form.meetingLink,
            location: form.location,
            dateTime,
            tag: form.tag,
            duration: Number(form.duration),
        });
    };

    const inputBase = "w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500";

    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-sm" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-3xl rounded-2xl border border-white/70 bg-white/90 backdrop-blur-md shadow-2xl shadow-slate-300/60"
                    >
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{title}</h3>
                                <p className="text-xs text-slate-500 mt-1">Create and schedule your session.</p>
                            </div>
                            <Badge color="violet">Mentor</Badge>
                        </div>

                        <form onSubmit={submit} className="p-5 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Webinar Title</label>
                                    <input
                                        value={form.title}
                                        onChange={(e) => setForm((cur) => ({ ...cur, title: e.target.value }))}
                                        className={inputBase}
                                        placeholder="System Design Deep Dive"
                                    />
                                    {errors.title ? <p className="text-xs text-rose-600 mt-1">{errors.title}</p> : null}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Speaker</label>
                                    <input
                                        value={form.speaker}
                                        onChange={(e) => setForm((cur) => ({ ...cur, speaker: e.target.value }))}
                                        className={inputBase}
                                        placeholder="Your name"
                                    />
                                    {errors.speaker ? <p className="text-xs text-rose-600 mt-1">{errors.speaker}</p> : null}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Meeting Link</label>
                                    <input
                                        value={form.meetingLink}
                                        onChange={(e) => setForm((cur) => ({ ...cur, meetingLink: e.target.value }))}
                                        className={inputBase}
                                        placeholder="https://meet.google.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Location</label>
                                    <input
                                        value={form.location}
                                        onChange={(e) => setForm((cur) => ({ ...cur, location: e.target.value }))}
                                        className={inputBase}
                                        placeholder="Online / Room"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Date</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => setForm((cur) => ({ ...cur, date: e.target.value }))}
                                        className={inputBase}
                                    />
                                    {errors.date ? <p className="text-xs text-rose-600 mt-1">{errors.date}</p> : null}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Time</label>
                                    <input
                                        type="time"
                                        value={form.time}
                                        onChange={(e) => setForm((cur) => ({ ...cur, time: e.target.value }))}
                                        className={inputBase}
                                    />
                                    {errors.time ? <p className="text-xs text-rose-600 mt-1">{errors.time}</p> : null}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Topic Tag</label>
                                    <input
                                        value={form.tag}
                                        onChange={(e) => setForm((cur) => ({ ...cur, tag: e.target.value }))}
                                        className={inputBase}
                                        placeholder="System Design"
                                    />
                                    {errors.tag ? <p className="text-xs text-rose-600 mt-1">{errors.tag}</p> : null}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        min="15"
                                        max="240"
                                        step="15"
                                        value={form.duration}
                                        onChange={(e) => setForm((cur) => ({ ...cur, duration: e.target.value }))}
                                        className={inputBase}
                                    />
                                    {errors.duration ? <p className="text-xs text-rose-600 mt-1">{errors.duration}</p> : null}
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Launching..." : "Launch Session 🚀"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default WebinarModal;
