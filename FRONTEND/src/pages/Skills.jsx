import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { ProgressBar } from "../devconnect/ui/Progress";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const SUBJECTS = [
    { key: "dsa", name: "DSA", weight: 0.3, required: 75, mentorRequired: 80 },
    { key: "dbms", name: "DBMS", weight: 0.2, required: 70, mentorRequired: 75 },
    { key: "os", name: "OS", weight: 0.15, required: 65, mentorRequired: 70 },
    { key: "cn", name: "Computer Networks", weight: 0.15, required: 60, mentorRequired: 65 },
    { key: "oop", name: "OOP", weight: 0.2, required: 70, mentorRequired: 75 },
];

const INITIAL_CORRECT = {
    dsa: 0,
    dbms: 0,
    os: 0,
    cn: 0,
    oop: 0,
};

const ASSESSMENT_STORAGE_PREFIX = "careerbridge-skill-assessment-v1";

const getProfileKey = (role) => (role === "mentor" ? "mentor" : "student");
const getProfileLabel = (profileKey) => (profileKey === "mentor" ? "Mentor" : "Student");
const getAssessmentStorageKey = (profileKey) => `${ASSESSMENT_STORAGE_PREFIX}:${profileKey}`;

const readAssessmentSnapshot = (profileKey) => {
    try {
        const raw = localStorage.getItem(getAssessmentStorageKey(profileKey));
        if (!raw) {
            return { correctAnswers: INITIAL_CORRECT, submittedAt: null };
        }

        const parsed = JSON.parse(raw);
        const safeAnswers = {
            dsa: clampCorrect(parsed?.correctAnswers?.dsa ?? 0),
            dbms: clampCorrect(parsed?.correctAnswers?.dbms ?? 0),
            os: clampCorrect(parsed?.correctAnswers?.os ?? 0),
            cn: clampCorrect(parsed?.correctAnswers?.cn ?? 0),
            oop: clampCorrect(parsed?.correctAnswers?.oop ?? 0),
        };

        return {
            correctAnswers: safeAnswers,
            submittedAt: parsed?.submittedAt || null,
        };
    } catch {
        return { correctAnswers: INITIAL_CORRECT, submittedAt: null };
    }
};

const clampCorrect = (value) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return 0;
    }
    return Math.min(20, Math.max(0, parsed));
};

const scoreFromCorrect = (correct) => Math.round((correct / 20) * 100);

const difficultyFromScore = (score) => {
    if (score < 40) {
        return { level: "Beginner", weeks: 4 };
    }
    if (score <= 70) {
        return { level: "Intermediate", weeks: 3 };
    }
    return { level: "Advanced", weeks: 1 };
};

const priorityFromGap = (gap) => {
    if (gap >= 25) {
        return "High";
    }
    if (gap >= 10) {
        return "Medium";
    }
    return "Low";
};

const proficiencyLabel = (score) => {
    if (score >= 80) {
        return "Strong";
    }
    if (score >= 60) {
        return "Working";
    }
    if (score >= 40) {
        return "Developing";
    }
    return "Beginner";
};

const weeklyPlanForSubject = (subjectName, difficulty) => {
                const [correctAnswers, setCorrectAnswers] = useState(() => readAssessmentSnapshot(profileKey).correctAnswers);
        return `Build fundamentals in ${subjectName}, solve 25 practice problems, then take one mini mock.`;
    }
                const [assessmentSubmittedAt, setAssessmentSubmittedAt] = useState(() => readAssessmentSnapshot(profileKey).submittedAt);
        return `Strengthen weak concepts in ${subjectName}, solve 40 mixed problems, and review mistakes weekly.`;
    }
    return `Focus on advanced ${subjectName} patterns, solve 20 hard problems, and complete one timed mock.`;
};

const resourcePackForSubject = (subjectName) => {
    const generic = [
        `${subjectName} playlist on YouTube`,
        `${subjectName} practice on LeetCode / platforms`,
        `${subjectName} notes from official docs`,
    ];

    if (subjectName === "DSA") {
        return [
            "LeetCode Blind 75",
            "NeetCode DSA YouTube",
            "GeeksforGeeks DSA sheets",
        ];
    }

    if (subjectName === "DBMS") {
        return [
            "DBMS playlist (YouTube)",
            "SQLBolt + HackerRank SQL",
            "PostgreSQL official docs",
        ];
    }

    return generic;
};

const Skills = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();
    const profileKey = getProfileKey(user?.role);
    const profileLabel = getProfileLabel(profileKey);
    const [target, setTarget] = useState("Backend Engineer (SDE)");
    const [correctAnswers, setCorrectAnswers] = useState(() => readAssessmentSnapshot(profileKey).correctAnswers);
    const [roadmap, setRoadmap] = useState([]);
    const [generatedAt, setGeneratedAt] = useState(null);
    const [assessmentSubmittedAt, setAssessmentSubmittedAt] = useState(() => readAssessmentSnapshot(profileKey).submittedAt);

    const subjectScores = useMemo(() => {
        return SUBJECTS.map((subject) => {
            const correct = correctAnswers[subject.key] || 0;
            const score = scoreFromCorrect(correct);
            const required = profileKey === "mentor" ? subject.mentorRequired : subject.required;
            const gap = Math.max(0, required - score);

            return {
                ...subject,
                correct,
                total: 20,
                score,
                required,
                gap,
                priority: priorityFromGap(gap),
            };
        });
    }, [correctAnswers, profileKey]);

    const readiness = useMemo(() => {
        const weighted = subjectScores.reduce(
            (sum, subject) => sum + subject.score * subject.weight,
            0,
        );

        return Math.round(weighted);
    }, [subjectScores]);

    const weakAreas = useMemo(() => {
        return [...subjectScores]
            .sort((a, b) => b.gap - a.gap)
            .slice(0, 3);
    }, [subjectScores]);

    const confidence = useMemo(() => {
        const entered = subjectScores.filter((subject) => subject.correct > 0).length;
        if (entered >= 5) {
            return "High";
        }
        if (entered >= 3) {
            return "Medium";
        }
        return "Low";
    }, [subjectScores]);

    const generateRoadmap = () => {
        const prioritized = [...subjectScores].sort((a, b) => b.gap - a.gap);

        const steps = prioritized.map((subject, index) => {
            const detail = difficultyFromScore(subject.score);
            return {
                id: `${subject.key}-${index}`,
                topic: subject.name,
                current: subject.score,
                required: subject.required,
                gap: subject.gap,
                priority: subject.priority,
                difficulty: detail.level,
                weeks: detail.weeks,
                plan: weeklyPlanForSubject(subject.name, detail.level),
                resources: resourcePackForSubject(subject.name),
                mentorNeeded: subject.gap >= 25,
            };
        });

        setRoadmap(steps);
        setGeneratedAt(new Date().toISOString());
        addToast("Roadmap generated using your assessment scores", "success");
    };

    const loadAssessmentResults = () => {
        const snapshot = readAssessmentSnapshot(profileKey);
        setCorrectAnswers(snapshot.correctAnswers);
        setAssessmentSubmittedAt(snapshot.submittedAt);
        setRoadmap([]);

        if (snapshot.submittedAt) {
            addToast("Loaded latest assessment results", "success");
            return;
        }

        addToast("No submitted assessment found yet", "error");
    };

    const downloadPlanAsPdf = () => {
        if (!roadmap.length) {
            addToast("Generate roadmap before downloading PDF", "error");
            return;
        }

        try {
            const doc = new jsPDF({ unit: "pt", format: "a4" });
            const now = new Date();

            const page = {
                width: doc.internal.pageSize.getWidth(),
                height: doc.internal.pageSize.getHeight(),
                marginX: 48,
                marginY: 52,
            };

            let y = page.marginY;

            const writeLine = (text, size = 10, color = [15, 23, 42], gap = 16) => {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(size);
                doc.setTextColor(...color);
                const wrapped = doc.splitTextToSize(text, page.width - page.marginX * 2);
                doc.text(wrapped, page.marginX, y);
                y += wrapped.length * gap;
            };

            const ensureSpace = (needed = 100) => {
                if (y + needed > page.height - page.marginY) {
                    doc.addPage();
                    y = page.marginY;
                }
            };

            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(3, 105, 161);
            doc.text("Career Bridge Skill Gap Report", page.marginX, y);
            y += 28;

            writeLine(`Role: ${target}`, 11, [71, 85, 105], 16);
            writeLine(`Readiness: ${readiness}% | Confidence: ${confidence}`, 11, [71, 85, 105], 16);
            writeLine(`Generated: ${now.toLocaleString()}`, 11, [71, 85, 105], 16);

            y += 8;
            doc.setDrawColor(203, 213, 225);
            doc.line(page.marginX, y, page.width - page.marginX, y);
            y += 20;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(15, 23, 42);
            doc.text("Subject Scores", page.marginX, y);
            y += 20;

            subjectScores.forEach((subject) => {
                writeLine(
                    `${subject.name}: ${subject.score}% (Correct ${subject.correct}/${subject.total}, Required ${subject.required}%, Gap ${subject.gap}%)`,
                    10,
                    [51, 65, 85],
                    14,
                );
            });

            y += 10;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(15, 23, 42);
            doc.text("Roadmap", page.marginX, y);
            y += 18;

            roadmap.forEach((step) => {
                ensureSpace(100);

                doc.setDrawColor(226, 232, 240);
                doc.roundedRect(page.marginX, y - 12, page.width - page.marginX * 2, 82, 8, 8);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(15, 23, 42);
                doc.text(`${step.topic} (${step.priority})`, page.marginX + 12, y + 6);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(51, 65, 85);
                doc.text(`Current ${step.current}% -> Required ${step.required}% | ${step.difficulty} | ${step.weeks} week(s)`, page.marginX + 12, y + 24);
                doc.text(step.plan, page.marginX + 12, y + 42);

                y += 94;
            });

            const safeTarget = target.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "");
            const fileName = `career-bridge-skill-gap-${safeTarget}.pdf`;

            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);

            addToast("Assessment report downloaded", "success");
        } catch (error) {
            addToast("PDF download failed. Please try again.", "error");
            console.error("PDF export failed:", error);
        }
    };

    const readinessColor = readiness >= 70 ? "emerald" : readiness >= 45 ? "violet" : "rose";
    const confidenceColor = confidence === "High" ? "emerald" : confidence === "Medium" ? "violet" : "rose";

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">Skill Gap Analyzer</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Assess your SDE fundamentals with 5 core subjects and generate a weighted readiness roadmap.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap rounded-xl border border-gray-700/80 bg-gray-900/35 px-3 py-2">
                    <Badge color="violet">{profileLabel}</Badge>
                    <button
                        type="button"
                        onClick={() => navigate("/skills/assessment")}
                        className="rounded-lg border border-violet-500/70 bg-violet-500/15 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500/25"
                    >
                        Take Assessment
                    </button>
                    <button
                        type="button"
                        onClick={loadAssessmentResults}
                        className="rounded-lg border border-sky-500/70 bg-sky-500/15 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500/25"
                    >
                        Load Latest
                    </button>
                    <Badge color="violet">Target</Badge>
                    <select
                        value={target}
                        onChange={(event) => setTarget(event.target.value)}
                        className="bg-gray-900/90 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/80"
                    >
                        <option>Backend Engineer (SDE)</option>
                    </select>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <Card className="p-5 xl:col-span-2">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <div className="font-bold text-white">Assessment Results</div>
                            <div className="text-xs text-gray-500 mt-1">
                                Scores are read from submitted assessment results (read-only).
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={generateRoadmap}>
                                Generate Plan <Icon name="arrowRight" size={16} />
                            </Button>
                            <Button variant="secondary" onClick={downloadPlanAsPdf} disabled={!roadmap.length}>
                                Download PDF <Icon name="file" size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        {subjectScores.map((subject) => (
                            <div key={subject.key} className="rounded-2xl border border-gray-800/70 bg-gray-900/30 p-4">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div>
                                        <div className="text-sm font-semibold text-white">{subject.name}</div>
                                        <div className="text-[11px] text-gray-500">
                                            Weight {(subject.weight * 100).toFixed(0)}% | Required {subject.required}%
                                        </div>
                                    </div>
                                    <Badge color={subject.score >= 70 ? "emerald" : subject.score >= 40 ? "violet" : "rose"}>
                                        {subject.score}%
                                    </Badge>
                                </div>

                                <ProgressBar value={subject.score} />

                                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                    <div className="text-xs text-gray-400">
                                        Correct Answers (from assessment)
                                        <div className="mt-1 w-full bg-gray-950/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white">
                                            {subject.correct}/20
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Proficiency
                                        <div className="mt-1 text-sm font-semibold text-white">{proficiencyLabel(subject.score)}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Gap
                                        <div className="mt-1 text-sm font-semibold text-white">{subject.gap}% ({subject.priority})</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold text-white">Readiness</div>
                            <div className="text-xs text-gray-500">weighted score</div>
                        </div>
                        <Badge color={readinessColor}>{readiness}%</Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Confidence</span>
                        <Badge color={confidenceColor}>{confidence}</Badge>
                    </div>

                    <div className="mt-4 rounded-xl border border-gray-800/70 bg-gray-900/20 p-3">
                        <div className="text-xs font-semibold text-gray-400 mb-2">Weakest 3 Areas</div>
                        <div className="space-y-2">
                            {weakAreas.map((item) => (
                                <div key={item.key} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-300">{item.name}</span>
                                    <span className="text-gray-400">Gap {item.gap}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 max-h-72 overflow-auto space-y-2 pr-1">
                        {roadmap.length ? (
                            roadmap.map((step) => (
                                <div key={step.id} className="rounded-xl border border-gray-800/70 bg-gray-900/20 px-3 py-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-white">{step.topic}</span>
                                        <Badge color={step.priority === "High" ? "rose" : step.priority === "Medium" ? "violet" : "emerald"}>
                                            {step.priority}
                                        </Badge>
                                    </div>
                                    <div className="mt-1 text-[11px] text-gray-500">
                                        {step.difficulty} · {step.weeks} week(s) · gap {step.gap}%
                                    </div>
                                    <div className="mt-2 text-[11px] text-gray-400">{step.plan}</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge color="gray">Mentor: {step.mentorNeeded ? "Needed" : "Optional"}</Badge>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => navigate(step.mentorNeeded ? "/marketplace" : "/webinars")}
                                        >
                                            Start Learning
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-800/70 px-3 py-3 text-xs text-gray-500">
                                Click Generate Plan to build your personalized roadmap.
                            </div>
                        )}
                    </div>

                    <div className="mt-4 rounded-xl border border-gray-800/70 bg-gray-900/20 p-3">
                        <div className="text-xs font-semibold text-gray-400 mb-2">Tracking</div>
                        <div className="text-xs text-gray-500">
                            Last generated: {generatedAt ? new Date(generatedAt).toLocaleString() : "--"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Last assessment submit: {assessmentSubmittedAt ? new Date(assessmentSubmittedAt).toLocaleString() : "--"}
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-800/60 pt-4 space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Icon name="award" size={14} className="text-violet-400" />
                            {profileLabel} readiness = DSA*0.30 + DBMS*0.20 + OS*0.15 + CN*0.15 + OOP*0.20
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon name="book" size={14} className="text-violet-400" />
                            Gap = max(0, required - current) with {profileLabel.toLowerCase()} benchmark targets.
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Skills;
