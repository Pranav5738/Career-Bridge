import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { ProgressBar } from "../devconnect/ui/Progress";
import Modal from "../devconnect/ui/Modal";
import { apiRequest } from "../utils/api";

const normalizeProfile = (source) => {
    const raw = source || {};
    const nameFromEmail = raw?.email ? (raw.email.split("@")[0] || "").replace(/[._-]+/g, " ") : "";

    return {
        ...raw,
        name: raw?.name || raw?.fullName || nameFromEmail,
        status: raw?.status || raw?.currentStatus || "",
        targetRole: raw?.targetRole || "",
        expertise: raw?.expertise || "",
        github: raw?.github || "",
        location: raw?.location || "",
        membershipPlan: raw?.membershipPlan || "",
        skills: Array.isArray(raw?.skills)
            ? raw.skills
            : typeof raw?.skills === "string"
                ? raw.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                : [],
    };
};

const toFormState = (source) => {
    const normalized = normalizeProfile(source);

    return {
        name: normalized.name || "",
        status: normalized.status || "",
        targetRole: normalized.targetRole || "",
        expertise: normalized.expertise || "",
        github: normalized.github || "",
        location: normalized.location || "",
        membershipPlan: normalized.membershipPlan || "",
        skills: Array.isArray(normalized.skills) ? normalized.skills.join(", ") : "",
    };
};

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();
    const [profile, setProfile] = useState(() => normalizeProfile(user));
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(() => toFormState(user));

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            setLoading(true);

            try {
                const response = await apiRequest("/api/user/profile");
                if (!isMounted) return;

                const nextProfile = normalizeProfile(response?.user || response?.data?.user || user);
                setProfile(nextProfile);
                updateUser(nextProfile);
                setForm(toFormState(nextProfile));
            } catch (error) {
                if (isMounted) {
                    const fallbackProfile = normalizeProfile(user);
                    setProfile(fallbackProfile);
                    setForm(toFormState(fallbackProfile));
                    addToast(error.message || "Unable to load profile", "error");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [addToast, updateUser, user]);

    const activeProfile = normalizeProfile(profile || user || {});

    const displayName = useMemo(() => {
        if (!activeProfile?.email) return "User";
        const namePart = activeProfile.email.split("@")[0] || "User";
        return namePart
            .split(/[._-]+/)
            .filter(Boolean)
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
    }, [activeProfile?.email]);

    const initials = useMemo(() => {
        const parts = displayName.split(" ").filter(Boolean);
        const first = parts[0]?.[0] ?? "U";
        const second = parts[1]?.[0] ?? "";
        return (first + second).toUpperCase();
    }, [displayName]);

    const roleLabel = activeProfile?.role === "mentor" ? "Mentor" : "Student";

    const openEditor = () => {
        setForm(toFormState(activeProfile));
        setIsEditing(true);
    };

    const saveProfile = async () => {
        setSaving(true);

        try {
            const response = await apiRequest("/api/user/profile", {
                method: "PATCH",
                body: {
                    status: form.status,
                    targetRole: form.targetRole,
                    expertise: form.expertise,
                    github: form.github,
                    location: form.location,
                    membershipPlan: form.membershipPlan,
                    skills: form.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),
                },
            });

            const nextProfile = normalizeProfile(response?.user || profile || user);
            setProfile(nextProfile);
            updateUser(nextProfile);
            setForm(toFormState(nextProfile));
            setIsEditing(false);
            addToast("Profile updated", "success");
        } catch (error) {
            addToast(error.message || "Unable to save profile", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading && !activeProfile?.email) {
        return (
            <div className="space-y-6">
                <Card className="p-6">
                    <div className="text-sm text-gray-400">Loading profile...</div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">My Profile</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage your identity, goals, and progress.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate("/resume")}>
                        Resume AI
                    </Button>
                    <Button onClick={() => navigate("/skills")}>
                        Skill Gap <Icon name="arrowRight" size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <Card className="p-6 xl:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-lg font-black text-white">
                                {initials}
                            </div>
                            <div>
                                <div className="text-xl font-black text-white">{displayName}</div>
                                <div className="text-sm text-gray-500">{activeProfile?.email ?? ""}</div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <Badge color="violet">{roleLabel}</Badge>
                                    <Badge color="emerald">Active</Badge>
                                    <Badge color="gray">{activeProfile?.membershipPlan || "Pro Plan"}</Badge>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" onClick={openEditor}>
                            <Icon name="edit" size={16} /> Edit
                        </Button>
                    </div>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4">
                            <div className="text-xs text-gray-500">Career Goal</div>
                            <div className="text-sm font-semibold text-white mt-1">
                                {activeProfile?.targetRole ?? (activeProfile?.role === "mentor" ? "Mentor" : "SWE")}
                            </div>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4">
                            <div className="text-xs text-gray-500">GitHub</div>
                            <div className="text-sm font-semibold text-white mt-1">
                                @{(activeProfile?.github || activeProfile?.email?.split("@")[0] || "user").toLowerCase()}
                            </div>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4">
                            <div className="text-xs text-gray-500">Location</div>
                            <div className="text-sm font-semibold text-white mt-1">
                                {activeProfile?.location || "San Francisco, CA"}
                            </div>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4">
                            <div className="text-xs text-gray-500">Membership</div>
                            <div className="text-sm font-semibold text-white mt-1">
                                {activeProfile?.membershipPlan || "DevConnect Pro"}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="text-xs font-semibold text-gray-400 mb-2">Technical Skills</div>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(activeProfile?.skills) && activeProfile.skills.length
                                ? activeProfile.skills
                                : ["React", "Node.js", "TypeScript", "System Design", "SQL", "Docker"]
                            ).map((s) => (
                                <Badge key={s} color="gray">
                                    {s}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-white">Progress</div>
                        <Icon name="trending" size={18} className="text-violet-400" />
                    </div>
                    <div className="mt-5 space-y-4">
                        {[
                            { label: "Resume Score", value: 87 },
                            { label: "Interview Ready", value: 72 },
                            { label: "Skill Coverage", value: 64 },
                        ].map((row) => (
                            <div key={row.label}>
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                    <span>{row.label}</span>
                                    <span className="text-gray-500">{row.value}%</span>
                                </div>
                                <ProgressBar value={row.value} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-gray-800/60 pt-4">
                        <Button className="w-full justify-center" onClick={() => navigate("/interview")}>
                            Practice Now <Icon name="arrowRight" size={16} />
                        </Button>
                    </div>
                </Card>
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile" size="lg">
                <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1">
                        <span className="text-xs font-semibold text-gray-400">Name</span>
                        <input
                            value={form.name}
                            readOnly
                            className="w-full bg-gray-900/40 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-300"
                        />
                    </label>

                    {[
                        ["status", "Current Status"],
                        ["targetRole", "Target Role"],
                        ["expertise", "Expertise"],
                        ["github", "GitHub"],
                        ["location", "Location"],
                        ["membershipPlan", "Membership Plan"],
                    ].map(([key, label]) => (
                        <label key={key} className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400">{label}</span>
                            <input
                                value={form[key]}
                                onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
                                className="w-full bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            />
                        </label>
                    ))}
                </div>

                <label className="space-y-1 block mt-4">
                    <span className="text-xs font-semibold text-gray-400">Skills</span>
                    <textarea
                        rows={4}
                        value={form.skills}
                        onChange={(e) => setForm((current) => ({ ...current, skills: e.target.value }))}
                        className="w-full bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                        placeholder="React, Node.js, SQL"
                    />
                </label>

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button onClick={saveProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
