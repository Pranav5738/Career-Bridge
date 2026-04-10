import { useCallback, useEffect, useMemo, useState } from "react";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import Modal from "../devconnect/ui/Modal";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../utils/api";

const Marketplace = () => {
    const { addToast } = useToast();
    const [query, setQuery] = useState("");
    const [activeMentor, setActiveMentor] = useState(null);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [sortBy, setSortBy] = useState("relevance");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [skillFilter, setSkillFilter] = useState("all");
    const [profileMentor, setProfileMentor] = useState(null);
    const [booking, setBooking] = useState(false);
    const [savingMentorId, setSavingMentorId] = useState(null);
    const [bookedMentorIds, setBookedMentorIds] = useState(() => new Set());
    const [savedMentorIds, setSavedMentorIds] = useState(() => new Set());

    const normalizeMentor = (mentor, index) => {
        const safeName = String(mentor?.name || "Mentor");
        const safeTags = Array.isArray(mentor?.tags)
            ? mentor.tags.filter(Boolean).map((tag) => String(tag))
            : [];

        return {
            id: mentor?.id || mentor?._id || `mentor-${index}`,
            name: safeName,
            title: String(mentor?.title || "Career Mentor"),
            tags: safeTags.length ? safeTags : ["Career", "Interview"],
            rating: Number.isFinite(Number(mentor?.rating)) ? Number(mentor.rating) : 4.8,
            price: Number.isFinite(Number(mentor?.price)) ? Number(mentor.price) : 49,
            avatar: String(mentor?.avatar || safeName.charAt(0).toUpperCase() || "M"),
        };
    };

    const loadMentors = useCallback(async () => {
        setLoading(true);
        setLoadError("");

        try {
            const response = await apiRequest("/api/marketplace/mentors", {
                auth: false,
            });

            const incoming = Array.isArray(response?.mentors) ? response.mentors : [];
            setMentors(incoming.map(normalizeMentor));
        } catch (error) {
            setLoadError(error.message || "Unable to load mentors");
            addToast(error.message || "Unable to load mentors", "error");
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadMentors();
    }, [loadMentors]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let result = mentors;

        if (q) {
            result = result.filter((m) => {
                const safeTags = Array.isArray(m.tags) ? m.tags : [];
                const hay = `${m.name || ""} ${m.title || ""} ${safeTags.join(" ")}`.toLowerCase();
                return hay.includes(q);
            });
        }

        if (ratingFilter !== "all") {
            result = result.filter((m) => Number(m.rating || 0) >= Number(ratingFilter));
        }

        if (priceFilter === "under-60") {
            result = result.filter((m) => Number(m.price || 0) < 60);
        }

        if (priceFilter === "60-70") {
            result = result.filter((m) => Number(m.price || 0) >= 60 && Number(m.price || 0) <= 70);
        }

        if (priceFilter === "above-70") {
            result = result.filter((m) => Number(m.price || 0) > 70);
        }

        if (skillFilter !== "all") {
            result = result.filter((m) => (Array.isArray(m.tags) ? m.tags : []).join(" ").toLowerCase().includes(skillFilter.toLowerCase()));
        }

        if (sortBy === "price") {
            result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        }

        if (sortBy === "rating") {
            result = [...result].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        }

        return result;
    }, [mentors, query, ratingFilter, priceFilter, skillFilter, sortBy]);

    const handleBook = (mentor) => {
        setActiveMentor(mentor);
    };

    const confirmBooking = async () => {
        if (!activeMentor) return;
        if (bookedMentorIds.has(activeMentor.id)) {
            setActiveMentor(null);
            return;
        }

        setBooking(true);

        try {
            await apiRequest("/api/marketplace/book", {
                method: "POST",
                body: { mentorId: activeMentor.id },
            });

            setBookedMentorIds((prev) => new Set(prev).add(activeMentor.id));
            addToast(`Booked a session with ${activeMentor.name}`, "success");
            setActiveMentor(null);
        } catch (error) {
            addToast(error.message || "Unable to book session", "error");
        } finally {
            setBooking(false);
        }
    };

    const saveMentor = async (mentor) => {
        if (savedMentorIds.has(mentor.id) || savingMentorId === mentor.id) {
            return;
        }

        setSavingMentorId(mentor.id);

        try {
            await apiRequest("/api/marketplace/save", {
                method: "POST",
                body: { mentorId: mentor.id },
            });

            setSavedMentorIds((prev) => new Set(prev).add(mentor.id));
            addToast(`Saved ${mentor.name} to your shortlist`, "success");
        } catch (error) {
            addToast(error.message || "Unable to save mentor", "error");
        } finally {
            setSavingMentorId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">Mentor Marketplace</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Find mentors for interviews, resumes, and career strategy.
                    </p>
                </div>
                <div className="w-full md:w-[360px]">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <Icon name="search" size={16} />
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, company, skill"
                            className="w-full bg-gray-900/60 border border-gray-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                        />
                    </div>
                </div>
            </div>

            <Card className="p-4">
                <div className="grid md:grid-cols-4 gap-3">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                    </select>

                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    >
                        <option value="all">All Prices</option>
                        <option value="under-60">Under $60</option>
                        <option value="60-70">$60 - $70</option>
                        <option value="above-70">Above $70</option>
                    </select>

                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    >
                        <option value="all">All Ratings</option>
                        <option value="4.5">4.5+</option>
                        <option value="4.7">4.7+</option>
                    </select>

                    <select
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                        className="bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    >
                        <option value="all">All Skills</option>
                        <option value="backend">Backend</option>
                        <option value="frontend">Frontend</option>
                        <option value="system design">System Design</option>
                    </select>
                </div>
            </Card>

            {loading ? (
                <Card className="p-5">
                    <div className="text-sm text-gray-400">Loading mentors...</div>
                </Card>
            ) : null}

            {!loading && loadError ? (
                <Card className="p-5">
                    <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
                        <div className="text-sm text-rose-600">{loadError}</div>
                        <Button variant="outline" onClick={loadMentors}>Retry</Button>
                    </div>
                </Card>
            ) : null}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((m) => (
                    <Card key={m.id} className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-black text-white">
                                    {m.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{m.name}</div>
                                    <div className="text-xs text-gray-500">{m.title}</div>
                                    <Badge color="emerald" className="mt-1">Available today</Badge>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Icon
                                            name="star"
                                            size={14}
                                            className="text-amber-400 fill-amber-400"
                                        />
                                        <span className="text-xs text-gray-400">
                                            {m.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Badge color="violet">${m.price}/hr</Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {(Array.isArray(m.tags) ? m.tags : []).map((t) => (
                                <Badge key={t} color="gray">
                                    {t}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-5">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setProfileMentor(m)}
                                >
                                    View Profile
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleBook(m)}
                                    disabled={bookedMentorIds.has(m.id)}
                                >
                                    {bookedMentorIds.has(m.id) ? "Booked" : "Book"} <Icon name="chevronRight" size={16} />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => saveMentor(m)}
                                disabled={savedMentorIds.has(m.id) || savingMentorId === m.id}
                            >
                                <Icon name="thumbUp" size={16} />
                                {savedMentorIds.has(m.id) ? "Saved" : savingMentorId === m.id ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {!loading && !loadError && filtered.length === 0 ? (
                <Card className="p-5">
                    <div className="text-sm text-gray-500">
                        No mentors matched "{query}". Try a different keyword.
                    </div>
                </Card>
            ) : null}

            <Modal
                open={Boolean(activeMentor)}
                onClose={() => setActiveMentor(null)}
                title="Confirm Booking"
            >
                {activeMentor ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-300">
                            Book a 60-minute session with{" "}
                            <span className="font-semibold text-white">{activeMentor.name}</span>
                            {" "}for{" "}
                            <span className="font-semibold text-white">
                                ${activeMentor.price}
                            </span>
                            .
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="secondary" onClick={() => setActiveMentor(null)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmBooking} disabled={booking || bookedMentorIds.has(activeMentor.id)}>
                                {bookedMentorIds.has(activeMentor.id) ? "Booked" : booking ? "Booking..." : "Confirm"}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </Modal>

            <Modal
                open={Boolean(profileMentor)}
                onClose={() => setProfileMentor(null)}
                title="Mentor Profile"
            >
                {profileMentor ? (
                    <div className="space-y-4">
                        <div className="text-lg font-bold text-white">{profileMentor.name}</div>
                        <div className="text-sm text-gray-500">{profileMentor.title}</div>
                        <div className="flex items-center gap-2">
                            <Badge color="violet">${profileMentor.price}/hr</Badge>
                            <Badge color="emerald">Available today</Badge>
                            <Badge color="amber">⭐ {profileMentor.rating}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(profileMentor.tags) ? profileMentor.tags : []).map((tag) => (
                                <Badge key={tag} color="gray">{tag}</Badge>
                            ))}
                        </div>
                        <div className="text-sm text-gray-400">
                            Full mentor profile preview with expertise, approach, and availability.
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setProfileMentor(null)}>Close</Button>
                            <Button
                                onClick={() => {
                                    setProfileMentor(null);
                                    handleBook(profileMentor);
                                }}
                            >
                                Book
                            </Button>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
};

export default Marketplace;
