import { useMemo, useState } from "react";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { useToast } from "../context/ToastContext";
import InterviewTimer from "./interview/components/InterviewTimer";

const Interview = () => {
    const { addToast } = useToast();
    const [mode, setMode] = useState("System Design");
    const [running, setRunning] = useState(false);
    const [difficulty, setDifficulty] = useState("Medium");
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [feedback, setFeedback] = useState(null);
    const [micActive, setMicActive] = useState(false);

    const questions = useMemo(() => {
        if (mode === "DSA") {
            return [
                "Two Sum variants",
                "Sliding Window",
                "Binary Search on Answer",
                "Graphs (BFS/DFS)",
            ];
        }
        if (mode === "Behavioral") {
            return [
                "Tell me about yourself",
                "Conflict with teammate",
                "A project you're proud of",
                "Handling ambiguity",
            ];
        }
        return [
            "Design a URL shortener",
            "Design a rate limiter",
            "Design a notification system",
            "Design a feed timeline",
        ];
    }, [mode]);

    const start = () => {
        setRunning(true);
        setMicActive(true);
        setCurrentQuestion(1);
        setFeedback(null);
        addToast("Mock interview started (demo)", "success");
    };

    const stop = () => {
        setRunning(false);
        setMicActive(false);
        setFeedback({
            score: 78,
            strengths: [
                "Clear structure and concise communication",
                "Good tradeoff discussion",
            ],
            improvements: [
                "Add more concrete metrics in examples",
                "Go deeper into edge-case handling",
            ],
        });
        addToast("Session saved to history (demo)", "info");
    };

    const nextQuestion = () => {
        setCurrentQuestion((prev) => Math.min(questions.length, prev + 1));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">Mock Interview</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Practice with an AI interviewer and get instant feedback.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Badge color="violet">Mode</Badge>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/60"
                    >
                        <option>System Design</option>
                        <option>DSA</option>
                        <option>Behavioral</option>
                    </select>

                    <Badge color="indigo">Difficulty</Badge>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/60"
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <Card className="p-5 xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-white">Question Set</div>
                        <div className="flex items-center gap-2">
                            <Badge color={running ? "emerald" : "gray"}>
                                {running ? "Live" : "Ready"}
                            </Badge>
                            {micActive ? <Badge color="rose">🎙 Recording</Badge> : null}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                        <InterviewTimer running={running} initialSeconds={1200} />
                        <div className="rounded-xl border border-gray-800/70 bg-gray-900/20 px-3 py-2">
                            <div className="text-[11px] text-gray-500">Progress</div>
                            <div className="text-sm font-bold text-white mt-0.5">
                                {currentQuestion} / {questions.length} questions completed
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                        {questions.map((q, index) => (
                            <div
                                key={q}
                                className={`p-4 rounded-2xl border bg-gray-900/30 ${
                                    index + 1 <= currentQuestion ? "border-violet-500/50" : "border-gray-800/70"
                                }`}
                            >
                                <div className="text-sm font-semibold text-white">
                                    {q}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                                    <span>Estimated: 10 min</span>
                                    <Badge color="gray">{difficulty}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        {running ? (
                            <Button variant="secondary" onClick={nextQuestion}>
                                Next Question
                            </Button>
                        ) : null}
                        {!running ? (
                            <Button onClick={start}>
                                Start <Icon name="mic" size={16} />
                            </Button>
                        ) : (
                            <Button variant="danger" onClick={stop}>
                                End Session <Icon name="x" size={16} />
                            </Button>
                        )}
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold text-white">
                                Tips
                            </div>
                            <div className="text-xs text-gray-500">
                                What the AI looks for
                            </div>
                        </div>
                        <Icon name="award" size={18} className="text-violet-400" />
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                            <Icon name="check" size={16} className="text-emerald-400 mt-0.5" />
                            Structure your answer with clarity.
                        </div>
                        <div className="flex items-start gap-2">
                            <Icon name="check" size={16} className="text-emerald-400 mt-0.5" />
                            Call out tradeoffs and constraints.
                        </div>
                        <div className="flex items-start gap-2">
                            <Icon name="check" size={16} className="text-emerald-400 mt-0.5" />
                            Use metrics and impact.
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-800/60 pt-4">
                        <Button
                            variant="outline"
                            className="w-full justify-center"
                            onClick={() => addToast("Mentor review requested", "success")}
                        >
                            Request Mentor Review
                        </Button>
                    </div>

                    {feedback ? (
                        <div className="mt-6 border-t border-gray-800/60 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold text-white">AI Feedback</div>
                                <Badge color="violet">Score {feedback.score}</Badge>
                            </div>
                            <div className="rounded-xl border border-gray-800/70 bg-gray-900/20 p-3">
                                <div className="text-xs font-semibold text-emerald-400 mb-2">Strengths</div>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    {feedback.strengths.map((item) => (
                                        <li key={item}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-xl border border-gray-800/70 bg-gray-900/20 p-3">
                                <div className="text-xs font-semibold text-amber-400 mb-2">Improvements</div>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    {feedback.improvements.map((item) => (
                                        <li key={item}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : null}
                </Card>
            </div>
        </div>
    );
};

export default Interview;
