import { useCallback, useEffect, useRef, useState } from "react";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import Modal from "../devconnect/ui/Modal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../utils/api";

const Forum = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [form, setForm] = useState({ title: "", tag: "General", body: "" });
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        { id: "1", user: "Mentor Ava", text: "Welcome to community chat", time: "09:30", online: true },
        { id: "2", user: "Student Lee", text: "Anyone preparing for system design rounds?", time: "09:31", online: true },
    ]);
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);

    const loadPosts = useCallback(async () => {
        setLoading(true);

        try {
            const response = await apiRequest("/api/forum/posts", {
                auth: false,
            });

            setPosts(response.posts || []);
        } catch (error) {
            addToast(error.message || "Unable to load forum posts", "error");
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, typing]);

    const openCreateModal = () => {
        setEditingPost(null);
        setForm({ title: "", tag: "General", body: "" });
        setOpen(true);
    };

    const openEditModal = (post) => {
        setEditingPost(post);
        setForm({
            title: post.title || "",
            tag: post.tag || "General",
            body: post.body || "",
        });
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditingPost(null);
        setForm({ title: "", tag: "General", body: "" });
    };

    const submitPost = async () => {
        if (!form.title.trim()) {
            addToast("Add a title first", "warning");
            return;
        }

        setSaving(true);

        try {
            if (editingPost) {
                await apiRequest(`/api/forum/posts/${editingPost.id}`, {
                    method: "PATCH",
                    body: form,
                });
                addToast("Post updated", "success");
            } else {
                await apiRequest("/api/forum/posts", {
                    method: "POST",
                    body: form,
                });
                addToast("Post created", "success");
            }

            await loadPosts();
            closeModal();
        } catch (error) {
            addToast(error.message || "Unable to save post", "error");
        } finally {
            setSaving(false);
        }
    };

    const deletePost = async (post) => {
        const confirmed = window.confirm(`Delete "${post.title}"?`);
        if (!confirmed) {
            return;
        }

        try {
            await apiRequest(`/api/forum/posts/${post.id}`, {
                method: "DELETE",
            });
            addToast("Post deleted", "success");
            await loadPosts();
        } catch (error) {
            addToast(error.message || "Unable to delete post", "error");
        }
    };

    const isOwner = (post) => {
        if (!user?.id || !post?.userId) {
            return false;
        }

        return String(user.id) === String(post.userId);
    };

    const sendChatMessage = () => {
        if (!chatInput.trim()) return;

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");

        setChatMessages((current) => ([
            ...current,
            {
                id: `${Date.now()}`,
                user: user?.email?.split("@")[0] || "You",
                text: chatInput.trim(),
                time: `${hh}:${mm}`,
                online: true,
            },
        ]));
        setChatInput("");
        setTyping(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">Community Forum</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Ask questions, share progress, and help others.
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <Icon name="plus" size={16} /> New Post
                </Button>
            </div>

            {loading ? (
                <Card className="p-5">
                    <div className="text-sm text-gray-400">Loading forum posts...</div>
                </Card>
            ) : null}

            <div className="grid xl:grid-cols-2 gap-4">
                {posts.map((p) => (
                    <Card key={p.id} className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-lg font-bold text-white">
                                    {p.title}
                                </div>
                                {p.body ? (
                                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                                        {p.body}
                                    </p>
                                ) : null}
                                <div className="flex items-center gap-3 mt-3">
                                    <Badge color="violet">{p.tag}</Badge>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <Icon name="message" size={14} /> {p.replies} replies
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        By {p.authorEmail || "community"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => addToast("Copied link to clipboard", "info")}
                                >
                                    <Icon name="link" size={16} />
                                    Share
                                </Button>
                                {isOwner(p) ? (
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(p)}>
                                            <Icon name="edit" size={16} />
                                            Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => deletePost(p)}>
                                            Delete
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {!loading && posts.length === 0 ? (
                <Card className="p-5">
                    <div className="text-sm text-gray-400">No forum posts yet. Start the first discussion.</div>
                </Card>
            ) : null}

            <Card className="p-5">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">Community Chat</div>
                    <Badge color="emerald">Online</Badge>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-800/70 bg-gray-900/20 h-64 overflow-auto p-3 space-y-3">
                    {chatMessages.map((message) => (
                        <div key={message.id} className="rounded-xl bg-gray-900/40 border border-gray-800/70 px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-xs font-semibold text-white flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${message.online ? "bg-emerald-400" : "bg-gray-500"}`} />
                                    {message.user}
                                </div>
                                <div className="text-[11px] text-gray-500">{message.time}</div>
                            </div>
                            <div className="text-sm text-gray-300 mt-1">{message.text}</div>
                        </div>
                    ))}
                    {typing ? <div className="text-xs text-violet-400">Someone is typing...</div> : null}
                    <div ref={chatEndRef} />
                </div>

                <div className="mt-3 flex gap-2">
                    <input
                        value={chatInput}
                        onChange={(e) => {
                            setChatInput(e.target.value);
                            setTyping(e.target.value.trim().length > 0);
                        }}
                        placeholder="Write a message..."
                        className="flex-1 bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                    />
                    <Button onClick={sendChatMessage}>Send</Button>
                </div>
            </Card>

            <Modal open={open} onClose={closeModal} title={editingPost ? "Edit Post" : "Create Post"}>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                            Title
                        </label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                            className="w-full bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            placeholder="Write a clear question title..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                            Topic
                        </label>
                        <input
                            value={form.tag}
                            onChange={(e) => setForm((current) => ({ ...current, tag: e.target.value }))}
                            className="w-full bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            placeholder="System Design, Resume, DSA..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                            Body
                        </label>
                        <textarea
                            value={form.body}
                            onChange={(e) => setForm((current) => ({ ...current, body: e.target.value }))}
                            rows={5}
                            className="w-full bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                            placeholder="Add context, examples, or your current approach..."
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button onClick={submitPost} disabled={saving}>
                            {saving ? "Saving..." : editingPost ? "Update Post" : "Post"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Forum;
