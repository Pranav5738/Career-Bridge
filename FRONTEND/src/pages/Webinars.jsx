import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../devconnect/ui/Card";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import EmptyState from "./webinars/components/EmptyState";
import WebinarHeader from "./webinars/components/WebinarHeader";
import WebinarList from "./webinars/components/WebinarList";
import WebinarModal from "./webinars/components/WebinarModal";

const Webinars = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const isMentor = user?.role === "mentor";
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingWebinar, setEditingWebinar] = useState(null);
    const [registeredWebinarIds, setRegisteredWebinarIds] = useState([]);

    const toLocalDateDisplay = (value) => {
        if (!value) return "TBD";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "TBD";
        }

        return date.toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const computeStatus = (webinar) => {
        if (webinar?.meetingStatus === "live") {
            return "live";
        }

        if (webinar?.meetingStatus === "ended") {
            return "completed";
        }

        const date = webinar?.dateTime ? new Date(webinar.dateTime) : null;
        if (date && !Number.isNaN(date.getTime()) && date.getTime() < Date.now()) {
            return "completed";
        }

        return "upcoming";
    };

    const loadWebinars = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await apiRequest("/api/webinars", {
                auth: false,
            });

            setWebinars(Array.isArray(response.webinars) ? response.webinars : []);
        } catch (error) {
            setErrorMessage(error.message || "Unable to load webinars");
            addToast(error.message || "Unable to load webinars", "error");
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadWebinars();
    }, [loadWebinars]);

    useEffect(() => {
        let active = true;

        const loadRegistrations = async () => {
            if (isMentor || !user) {
                if (active) {
                    setRegisteredWebinarIds([]);
                }
                return;
            }

            try {
                const response = await apiRequest("/api/webinars/my-registrations");
                if (!active) return;

                const ids = Array.isArray(response?.webinarIds) ? response.webinarIds : [];
                setRegisteredWebinarIds(ids.map((id) => String(id)));
            } catch {
                if (active) {
                    setRegisteredWebinarIds([]);
                }
            }
        };

        loadRegistrations();

        return () => {
            active = false;
        };
    }, [isMentor, user]);

    const formattedWebinars = useMemo(() => {
        return webinars.map((webinar) => ({
            id: webinar._id || webinar.id,
            title: webinar.title || "Untitled webinar",
            speaker: webinar.speaker || "Community speaker",
            dateTime: webinar.dateTime,
            displayDate: toLocalDateDisplay(webinar.dateTime),
            tag: webinar.tag || "Career",
            duration: webinar.duration || 60,
            location: webinar.location || "Online",
            meetingLink: webinar.meetingLink || "",
            registrationCount: webinar.registrationCount || webinar.registrationsCount || 0,
            meetingStatus: webinar.meetingStatus,
            status: computeStatus(webinar),
            isRegistered: registeredWebinarIds.includes(String(webinar._id || webinar.id)),
        }));
    }, [registeredWebinarIds, webinars]);

    const handleRegister = async (webinar) => {
        if (!webinar?.id) return;

        if (webinar.isRegistered) {
            addToast("Already registered for this webinar", "info");
            return;
        }

        setBusyId(webinar.id);

        try {
            await apiRequest("/api/webinars/register", {
                method: "POST",
                body: { webinarId: webinar.id },
            });

            setRegisteredWebinarIds((current) => {
                const nextId = String(webinar.id);
                if (current.includes(nextId)) return current;
                return [...current, nextId];
            });

            setWebinars((current) =>
                current.map((item) => {
                    const itemId = String(item._id || item.id);
                    if (itemId !== String(webinar.id)) {
                        return item;
                    }

                    const currentCount = Number(item.registrationCount || item.registrationsCount || 0);
                    return {
                        ...item,
                        registrationCount: currentCount + 1,
                        registrationsCount: currentCount + 1,
                    };
                }),
            );

            addToast(`Registered for ${webinar.title}`, "success");
        } catch (error) {
            addToast(error.message || "Unable to register", "error");
        } finally {
            setBusyId(null);
        }
    };

    const handleUnregister = async (webinar) => {
        if (!webinar?.id) return;

        if (!webinar.isRegistered) {
            addToast("You are not registered for this webinar", "info");
            return;
        }

        setBusyId(webinar.id);

        try {
            await apiRequest("/api/webinars/unregister", {
                method: "POST",
                body: { webinarId: webinar.id },
            });

            setRegisteredWebinarIds((current) =>
                current.filter((id) => id !== String(webinar.id)),
            );

            setWebinars((current) =>
                current.map((item) => {
                    const itemId = String(item._id || item.id);
                    if (itemId !== String(webinar.id)) {
                        return item;
                    }

                    const currentCount = Number(item.registrationCount || item.registrationsCount || 0);
                    const nextCount = Math.max(0, currentCount - 1);
                    return {
                        ...item,
                        registrationCount: nextCount,
                        registrationsCount: nextCount,
                    };
                }),
            );

            addToast(`Unregistered from ${webinar.title}`, "success");
        } catch (error) {
            addToast(error.message || "Unable to unregister", "error");
        } finally {
            setBusyId(null);
        }
    };

    const handleAddToCalendar = async (webinar) => {
        if (!webinar?.id) return;

        setBusyId(webinar.id);

        try {
            await apiRequest("/api/webinars/add-to-calendar", {
                method: "POST",
                body: { webinarId: webinar.id },
            });

            addToast(`Added ${webinar.title} to calendar`, "success");
        } catch (error) {
            addToast(error.message || "Unable to add to calendar", "error");
        } finally {
            setBusyId(null);
        }
    };

    const openCreateModal = () => {
        setEditingWebinar(null);
        setModalOpen(true);
    };

    const handleEdit = (webinar) => {
        setEditingWebinar(webinar);
        setModalOpen(true);
    };

    const submitWebinar = async (payload) => {
        if (editingWebinar) {
            setWebinars((current) =>
                current.map((item) => {
                    const itemId = item._id || item.id;
                    if (String(itemId) !== String(editingWebinar.id)) {
                        return item;
                    }

                    return {
                        ...item,
                        ...payload,
                    };
                }),
            );

            setModalOpen(false);
            setEditingWebinar(null);
            addToast("Webinar updated in dashboard", "success");
            return;
        }

        setSubmitting(true);

        try {
            await apiRequest("/api/webinars", {
                method: "POST",
                body: payload,
            });

            addToast("Webinar created", "success");
            setModalOpen(false);
            await loadWebinars();
        } catch (error) {
            addToast(error.message || "Unable to create webinar", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (webinar) => {
        if (!webinar?.id) return;

        setBusyId(webinar.id);

        try {
            await apiRequest(`/api/webinars/${webinar.id}`, {
                method: "DELETE",
            });

            setWebinars((current) =>
                current.filter((item) => String(item._id || item.id) !== String(webinar.id)),
            );
            addToast("Webinar deleted", "success");
        } catch (error) {
            addToast(error.message || "Unable to delete webinar", "error");
        } finally {
            setBusyId(null);
        }
    };

    const handleStartMeeting = async (webinar) => {
        if (!webinar?.id) return;

        setBusyId(webinar.id);

        try {
            await apiRequest(`/api/webinars/${webinar.id}/start`, {
                method: "POST",
            });
            addToast("Meeting started", "success");
            await loadWebinars();
        } catch (error) {
            addToast(error.message || "Unable to start meeting", "error");
        } finally {
            setBusyId(null);
        }
    };

    const handleOpenMeeting = async (webinar) => {
        if (!webinar?.id) return;

        setBusyId(webinar.id);

        try {
            const response = await apiRequest(`/api/webinars/${webinar.id}/meeting-access`);
            const link = response?.access?.meetingLink;

            if (!link) {
                addToast("Meeting link unavailable", "error");
                return;
            }

            const rawLink = String(link).trim();
            const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(rawLink);
            const targetLink = hasScheme
                ? rawLink
                : rawLink.startsWith("/")
                    ? `${window.location.origin}${rawLink}`
                    : `https://${rawLink}`;

            window.open(targetLink, "_blank", "noopener,noreferrer");
        } catch (error) {
            addToast(error.message || "Unable to open meeting", "error");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            <WebinarHeader isMentor={isMentor} onHostWebinar={openCreateModal} />

            {errorMessage ? (
                <Card className="p-5 bg-rose-50/80 border-rose-200">
                    <div className="text-sm text-rose-700">{errorMessage}</div>
                </Card>
            ) : null}

            {formattedWebinars.length === 0 && !loading ? (
                <EmptyState isMentor={isMentor} onHostWebinar={openCreateModal} />
            ) : (
                <WebinarList
                    webinars={formattedWebinars}
                    isMentor={isMentor}
                    loading={loading}
                    busyId={busyId}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onAddCalendar={handleAddToCalendar}
                    onStart={handleStartMeeting}
                    onOpenMeeting={handleOpenMeeting}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <WebinarModal
                isOpen={modalOpen}
                mode={editingWebinar ? "edit" : "create"}
                initialValues={editingWebinar}
                onClose={() => {
                    setModalOpen(false);
                    setEditingWebinar(null);
                }}
                onSubmit={submitWebinar}
                loading={submitting}
            />
        </div>
    );
};

export default Webinars;
