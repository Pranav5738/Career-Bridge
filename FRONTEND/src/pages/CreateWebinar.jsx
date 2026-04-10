import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../utils/api";

const CreateWebinar = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        speaker: "",
        dateTime: "",
        meetingLink: "",
        location: "",
        tag: "System Design",
        duration: 60,
    });

    const updateField = (field) => (event) => {
        const value = event.target.value;
        setForm((current) => ({
            ...current,
            [field]: field === "duration" ? Number(value) : value,
        }));
    };

    const submitWebinar = async (event) => {
        event.preventDefault();

        if (!form.title.trim() || !form.speaker.trim() || !form.dateTime.trim() || !form.tag.trim()) {
            addToast("Fill the required webinar fields", "warning");
            return;
        }

        setLoading(true);

        try {
            await apiRequest("/api/webinars", {
                method: "POST",
                body: {
                    title: form.title,
                    speaker: form.speaker,
                    dateTime: form.dateTime,
                    meetingLink: form.meetingLink,
                    location: form.location,
                    tag: form.tag,
                    duration: form.duration,
                },
            });

            addToast("Webinar created", "success");
            navigate("/webinars", { replace: true });
        } catch (error) {
            addToast(error.message || "Unable to create webinar", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">Host a Webinar</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Create a live session and publish it to the webinar list.
                    </p>
                </div>
                <Badge color="violet">Mentor only</Badge>
            </div>

            <Card className="p-6">
                <form className="space-y-5" onSubmit={submitWebinar}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Title</label>
                            <input
                                value={form.title}
                                onChange={updateField("title")}
                                placeholder="System Design for Product Teams"
                                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Speaker</label>
                            <input
                                value={form.speaker}
                                onChange={updateField("speaker")}
                                placeholder="Your name and company"
                                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Date and Time</label>
                            <input
                                type="datetime-local"
                                value={form.dateTime}
                                onChange={updateField("dateTime")}
                                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Duration</label>
                            <input
                                type="number"
                                min="15"
                                max="240"
                                step="15"
                                value={form.duration}
                                onChange={updateField("duration")}
                                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Tag</label>
                        <input
                            value={form.tag}
                            onChange={updateField("tag")}
                            placeholder="System Design, DSA, Career"
                            className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Meeting Link</label>
                            <input
                                value={form.meetingLink}
                                onChange={updateField("meetingLink")}
                                placeholder="https://meet.google.com/..."
                                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Location</label>
                            <input
                                value={form.location}
                                onChange={updateField("location")}
                                placeholder="Online / Office / Room"
                                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => navigate("/webinars")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Webinar"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateWebinar;