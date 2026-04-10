import InterviewSession from "./interviewSession.model.js";
import { env } from "../../config/env.js";
import { generateGeminiJson } from "../../utils/gemini.js";

const DSA_QUESTION_BANK = [
    {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "easy",
        tags: ["arrays", "hashmap"],
        estimatedTime: 15,
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "nums[0] + nums[1] == 9"
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "Exactly one valid answer exists"
        ]
    },
    {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "easy",
        tags: ["stack", "strings"],
        estimatedTime: 12,
        description:
            "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        examples: [
            {
                input: "s = \"()[]{}\"",
                output: "true",
                explanation: "All brackets are correctly closed in order"
            }
        ],
        constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only"
        ]
    },
    {
        id: "longest-substring-without-repeating",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
        tags: ["sliding-window", "strings", "hashmap"],
        estimatedTime: 20,
        description:
            "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [
            {
                input: "s = \"abcabcbb\"",
                output: "3",
                explanation: "The answer is \"abc\", with the length of 3"
            }
        ],
        constraints: [
            "0 <= s.length <= 5 * 10^4",
            "s consists of English letters, digits, symbols and spaces"
        ]
    },
    {
        id: "product-of-array-except-self",
        title: "Product of Array Except Self",
        difficulty: "medium",
        tags: ["arrays", "prefix-suffix"],
        estimatedTime: 20,
        description:
            "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
        examples: [
            {
                input: "nums = [1,2,3,4]",
                output: "[24,12,8,6]",
                explanation: "Each element is product of all numbers except current index"
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^5",
            "-30 <= nums[i] <= 30",
            "Solve in O(n) time"
        ]
    },
    {
        id: "number-of-islands",
        title: "Number of Islands",
        difficulty: "medium",
        tags: ["graphs", "dfs", "bfs"],
        estimatedTime: 25,
        description:
            "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
        examples: [
            {
                input: "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"0\",\"0\"],[\"0\",\"0\",\"1\"]]",
                output: "2",
                explanation: "Two disconnected groups of land cells exist"
            }
        ],
        constraints: [
            "1 <= m, n <= 300",
            "grid[i][j] is '0' or '1'"
        ]
    },
    {
        id: "kth-largest-element",
        title: "Kth Largest Element in an Array",
        difficulty: "medium",
        tags: ["heap", "quickselect", "arrays"],
        estimatedTime: 22,
        description:
            "Given an integer array nums and an integer k, return the kth largest element in the array.",
        examples: [
            {
                input: "nums = [3,2,1,5,6,4], k = 2",
                output: "5",
                explanation: "The 2nd largest element is 5"
            }
        ],
        constraints: [
            "1 <= k <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ]
    },
    {
        id: "merge-intervals",
        title: "Merge Intervals",
        difficulty: "medium",
        tags: ["intervals", "sorting"],
        estimatedTime: 18,
        description:
            "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
        examples: [
            {
                input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
                output: "[[1,6],[8,10],[15,18]]",
                explanation: "[1,3] and [2,6] overlap and are merged"
            }
        ],
        constraints: [
            "1 <= intervals.length <= 10^4",
            "intervals[i].length == 2",
            "0 <= starti <= endi <= 10^4"
        ]
    },
    {
        id: "trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "hard",
        tags: ["two-pointers", "arrays", "stack"],
        estimatedTime: 30,
        description:
            "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        examples: [
            {
                input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                output: "6",
                explanation: "The total trapped water is 6"
            }
        ],
        constraints: [
            "1 <= height.length <= 2 * 10^4",
            "0 <= height[i] <= 10^5"
        ]
    }
];

const QUESTION_COUNT_PER_DAY = 4;

const getDaySeed = (date = new Date()) => {
    const start = Date.UTC(date.getUTCFullYear(), 0, 0);
    const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const dayOfYear = Math.floor((now - start) / 86400000);
    return date.getUTCFullYear() * 1000 + dayOfYear;
};

const seededShuffle = (items, seed) => {
    const arr = [...items];
    let state = seed;

    const rand = () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };

    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
};

export const getDailyDsaQuestionsService = () => {
    const seed = getDaySeed();
    const shuffled = seededShuffle(DSA_QUESTION_BANK, seed);
    const questions = shuffled.slice(0, QUESTION_COUNT_PER_DAY);
    const date = new Date().toISOString().slice(0, 10);

    return {
        date,
        questions
    };
};

export const getDsaQuestionByIdService = (questionId) => {
    const fromBank = DSA_QUESTION_BANK.find((q) => q.id === questionId);
    if (fromBank) {
        return fromBank;
    }

    const { questions } = getDailyDsaQuestionsService();
    const fromDaily = questions.find((q) => q.id === questionId);

    return fromDaily || null;
};

export const startInterviewService = async (userId, mode) => {
    const session = await InterviewSession.create({
        userId,
        mode,
        startedAt: new Date(),
        status: "running"
    });

    return session;
};

export const endInterviewService = async (userId, mode) => {
    const session = await InterviewSession.findOne({
        userId,
        mode,
        status: "running"
    }).sort({ createdAt: -1 });

    if (!session) {
        throw new Error("No active session found");
    }

    session.endedAt = new Date();
    session.status = "completed";
    await session.save();

    return session;
};

export const reviewInterviewService = async (userId, mode) => {
    const session = await InterviewSession.findOne({
        userId,
        mode
    }).sort({ createdAt: -1 });

    if (!session) {
        throw new Error("Session not found");
    }

    session.reviewRequested = true;
    await session.save();

    return session._id;
};

const buildFallbackEvaluation = (action, reason, status) => {
    const cleanReason = String(reason || "").trim();
    const isQuotaIssue = status === 429 || /quota|rate limit|resource_exhausted/i.test(cleanReason);
    const isMissingKey = /not configured on server/i.test(cleanReason);

    let summary = action === "submit"
        ? "Unable to evaluate submission with AI right now."
        : "Unable to run AI feedback right now.";

    if (isQuotaIssue) {
        summary = "Gemini quota exceeded. Please enable billing or wait for quota reset.";
    } else if (isMissingKey) {
        summary = "Gemini API key is missing on server.";
    } else if (cleanReason && cleanReason.length <= 120 && !/https?:\/\//i.test(cleanReason)) {
        summary = cleanReason;
    }

    return {
        verdict: "needs_work",
        score: 0,
        summary,
        strengths: [],
        improvements: isQuotaIssue
            ? ["Enable billing or increase Gemini quota", "Retry after quota reset"]
            : ["Retry after a few seconds"],
        complexity: "Not evaluated"
    };
};

const inferComplexity = (source) => {
    const code = String(source || "");
    const nestedLoop = /(for|while)[\s\S]{0,200}(for|while)/i.test(code);
    const singleLoop = /(for|while)/i.test(code);
    const usesHash = /(unordered_map|unordered_set|map<|set<|dict\(|Map\(|Object\.)/i.test(code);
    const usesSort = /(\.sort\(|sort\s*\()/i.test(code);

    if (nestedLoop) return "Likely O(n^2) due to nested loops";
    if (usesSort) return "Likely O(n log n) due to sorting";
    if (singleLoop && usesHash) return "Likely O(n) with hash lookup";
    if (singleLoop) return "Likely O(n) single pass";
    return "Complexity could not be inferred confidently";
};

const buildRealtimeLocalEvaluation = ({ question, code, action, reason, status }) => {
    const source = String(code || "");
    const tags = (question?.tags || []).join(" ").toLowerCase();

    const hasFunction = /(function\s+\w+|def\s+\w+|int\s+\w+\s*\()/i.test(source);
    const hasLoopOrIf = /(for|while|if\s*\()/i.test(source);
    const hasReturn = /\breturn\b/i.test(source);
    const usesHash = /(unordered_map|unordered_set|dict\(|Map\(|Object\.)/i.test(source);
    const usesPointers = /(left|right|l\s*=|r\s*=|i\+\+|j\+\+)/i.test(source);
    const lines = source.split(/\r?\n/).filter((line) => line.trim()).length;

    let score = 25;
    if (hasFunction) score += 15;
    if (hasLoopOrIf) score += 15;
    if (hasReturn) score += 10;
    if (lines >= 8) score += 12;
    if (tags.includes("hash") && usesHash) score += 10;
    if ((tags.includes("sliding-window") || tags.includes("two-pointers")) && usesPointers) score += 10;
    if (action === "submit" && lines >= 12) score += 8;

    score = Math.max(0, Math.min(100, score));

    const strengths = [];
    const improvements = [];

    if (hasFunction) strengths.push("Clear function structure is present");
    if (hasLoopOrIf) strengths.push("Core control flow is implemented");
    if (hasReturn) strengths.push("Returns a computed result");

    if (!hasLoopOrIf) improvements.push("Add iteration or branching for the core logic");
    if (!hasReturn) improvements.push("Return the final answer explicitly");
    if (lines < 8) improvements.push("Handle additional edge cases and input variants");
    if (improvements.length === 0) improvements.push("Validate with more tricky edge cases before final submit");

    const reasonText = String(reason || "").toLowerCase();
    let summary = "Realtime local evaluation generated (AI temporarily unavailable).";

    if (status === 429 || reasonText.includes("quota") || reasonText.includes("rate")) {
        summary = "Gemini quota exceeded. Showing realtime local evaluation.";
    } else if (reasonText.includes("api key") || reasonText.includes("not configured")) {
        summary = "Gemini key issue detected. Showing realtime local evaluation.";
    }

    return {
        verdict: score >= (action === "submit" ? 70 : 60) ? "pass" : "needs_work",
        score,
        summary,
        strengths: strengths.slice(0, 5),
        improvements: improvements.slice(0, 5),
        complexity: inferComplexity(source)
    };
};

const callGeminiEvaluation = async ({ question, language, code, action }) => {
    const parsed = await generateGeminiJson({
        model: env.geminiModel,
        systemPrompt: "You are an interview evaluator for DSA coding questions. Return only valid JSON.",
        userPrompt: [
            `Action: ${action}`,
            'Required JSON shape: {"verdict":"pass|needs_work","score":0-100,"summary":"...","strengths":["..."],"improvements":["..."],"complexity":"..."}',
            "Question:",
            JSON.stringify(
                {
                    id: question.id,
                    title: question.title,
                    difficulty: question.difficulty,
                    description: question.description,
                    examples: question.examples,
                    constraints: question.constraints,
                    tags: question.tags
                },
                null,
                2
            ),
            `Language: ${language}`,
            "Candidate code:",
            code
        ].join("\n\n")
    });

    return {
        verdict: parsed?.verdict === "pass" ? "pass" : "needs_work",
        score: Number.isFinite(parsed?.score) ? Math.max(0, Math.min(100, Math.round(parsed.score))) : 0,
        summary: parsed?.summary || "Evaluation completed",
        strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.slice(0, 5) : [],
        improvements: Array.isArray(parsed?.improvements) ? parsed.improvements.slice(0, 5) : [],
        complexity: parsed?.complexity || "Not specified"
    };
};

export const evaluateDsaCodeService = async ({ question, language, code, action }) => {
    try {
        return await callGeminiEvaluation({ question, language, code, action });
    } catch (error) {
        return buildRealtimeLocalEvaluation({
            question,
            code,
            action,
            reason: error?.message,
            status: error?.status
        });
    }
};