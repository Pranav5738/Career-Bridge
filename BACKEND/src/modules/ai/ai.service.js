const DEFAULT_TOPICS = [
    "Data Structures",
    "Algorithms",
    "System Design",
    "Databases",
    "Computer Networks",
];

const TOPIC_LIBRARY = {
    "data structures": ["Arrays basics", "Stacks and queues", "Hash maps and sets"],
    algorithms: ["Two pointers", "Sliding window", "Binary search patterns"],
    "system design": ["Scalability basics", "Caching strategies", "Rate limiting"],
    databases: ["SQL joins", "Indexing and query plans", "Transactions and ACID"],
    caching: ["Redis fundamentals", "Cache invalidation", "TTL strategies"],
    observability: ["Metrics and dashboards", "Tracing basics", "Alerting best practices"],
    behavioral: ["STAR framework", "Conflict resolution", "Leadership stories"],
    negotiation: ["Offer benchmarking", "Compensation framing", "Counter-offer strategy"],
    "computer networks": ["OSI model refresher", "TCP vs UDP", "HTTP lifecycle"],
    "dynamic programming": ["State transitions", "Memoization", "Tabulation"],
};

const normalizeGaps = (skillGaps) => {
    if (!Array.isArray(skillGaps)) {
        return [];
    }

    return skillGaps
        .map((entry) => {
            if (typeof entry === "string") {
                return { name: entry.trim(), level: null };
            }

            if (entry && typeof entry === "object") {
                return {
                    name: String(entry.name || "").trim(),
                    level: Number.isFinite(entry.level) ? entry.level : null,
                };
            }

            return { name: "", level: null };
        })
        .filter((entry) => entry.name);
};

export const generateLearningPlanService = async ({ skillGaps, targetRole }) => {
    const normalized = normalizeGaps(skillGaps);

    const prioritized = [...normalized].sort((a, b) => {
        const left = a.level ?? 50;
        const right = b.level ?? 50;
        return left - right;
    });

    const selectedTopics = (prioritized.length ? prioritized.map((item) => item.name) : DEFAULT_TOPICS)
        .slice(0, 5);

    const plan = selectedTopics.map((topic, index) => {
        const key = topic.toLowerCase();
        const moduleItems = TOPIC_LIBRARY[key] || [
            `${topic} fundamentals`,
            `${topic} practice questions`,
            `${topic} recap and revision`,
        ];
        const module = moduleItems[index % moduleItems.length];
        return `Day ${index + 1}: ${module}`;
    });

    while (plan.length < 5) {
        const day = plan.length + 1;
        plan.push(`Day ${day}: Interview drills for ${targetRole || "your target role"}`);
    }

    return plan;
};