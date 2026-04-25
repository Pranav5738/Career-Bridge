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
import { apiRequest, resolveApiUrl } from "../utils/api";

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
        avatarUrl: raw?.avatarUrl || "",
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
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarSaving, setAvatarSaving] = useState(false);

    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

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
    }, [user?.id]);

    const activeProfile = normalizeProfile(profile || user || {});

    const displayName = useMemo(() => {
        if (activeProfile?.name?.trim()) {
            return activeProfile.name.trim();
        }

        if (!activeProfile?.email) return "User";
        const namePart = activeProfile.email.split("@")[0] || "User";
        return namePart
            .split(/[._-]+/)
            .filter(Boolean)
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
    }, [activeProfile?.email, activeProfile?.name]);

    const initials = useMemo(() => {
        const parts = displayName.split(" ").filter(Boolean);
        const first = parts[0]?.[0] ?? "U";
        const second = parts[1]?.[0] ?? "";
        return (first + second).toUpperCase();
    }, [displayName]);

    const roleLabel = activeProfile?.role === "mentor" ? "Mentor" : "Student";
    const profileAvatarSrc = activeProfile?.avatarUrl ? resolveApiUrl(activeProfile.avatarUrl) : "";

    const openEditor = () => {
        setForm(toFormState(activeProfile));
        setAvatarPreview(activeProfile?.avatarUrl ? resolveApiUrl(activeProfile.avatarUrl) : "");
        setAvatarFile(null);
        setIsEditing(true);
    };

    const saveProfile = async () => {
        setSaving(true);

        try {
            const response = await apiRequest("/api/user/profile", {
                method: "PATCH",
                body: {
                    name: form.name,
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

    const onAvatarSelected = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            addToast("Please select a valid image file", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            addToast("Image must be 5MB or smaller", "error");
            return;
        }

        setAvatarFile(file);
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };

    const uploadAvatar = async () => {
        if (!avatarFile) {
            addToast("Select an image first", "warning");
            return;
        }

        setAvatarSaving(true);

        try {
            const data = new FormData();
            data.append("avatar", avatarFile);

            const response = await apiRequest("/api/user/profile/avatar", {
                method: "PATCH",
                body: data,
            });

            const nextProfile = normalizeProfile(response?.user || profile || user);
            setProfile(nextProfile);
            updateUser(nextProfile);
            setAvatarFile(null);
            setAvatarPreview(nextProfile?.avatarUrl ? resolveApiUrl(nextProfile.avatarUrl) : "");
            addToast("Profile picture updated", "success");
        } catch (error) {
            addToast(error.message || "Unable to upload profile picture", "error");
        } finally {
            setAvatarSaving(false);
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
                            {profileAvatarSrc ? (
                                <img
                                    src={profileAvatarSrc}
                                    alt="Profile"
                                    className="w-14 h-14 rounded-2xl object-cover border border-gray-800/70"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-lg font-black text-white">
                                    {initials}
                                </div>
                            )}
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
                <div className="mb-5 p-4 rounded-2xl border border-gray-800/70 bg-gray-900/30">
                    <div className="flex items-center gap-4 flex-wrap">
                        {avatarPreview || profileAvatarSrc ? (
                            <img
                                src={avatarPreview || profileAvatarSrc}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-2xl object-cover border border-gray-700/70"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white">
                                {initials}
                            </div>
                        )}

                        <div className="flex-1 min-w-[220px]">
                            <div className="text-xs font-semibold text-gray-400 mb-2">Profile Picture</div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/70 text-sm text-white cursor-pointer hover:border-violet-500/60 transition-colors">
                                    <Icon name="upload" size={14} /> Choose Image
                                    <input type="file" accept="image/*" className="hidden" onChange={onAvatarSelected} />
                                </label>
                                <Button
                                    size="sm"
                                    onClick={uploadAvatar}
                                    disabled={!avatarFile || avatarSaving}
                                >
                                    {avatarSaving ? "Uploading..." : "Upload"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1">
                        <span className="text-xs font-semibold text-gray-400">Name</span>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                            className="w-full bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
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
