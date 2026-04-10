import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { ProgressBar } from "../devconnect/ui/Progress";
import { useToast } from "../context/ToastContext";

const Skills = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [target, setTarget] = useState("Backend Engineer");
    const [plan, setPlan] = useState(null);

    const gaps = useMemo(
        () => [
            {
                group: "Core",
                items: [
                    { name: "Data Structures", level: 72 },
                    { name: "Algorithms", level: 66 },
                    { name: "System Design", level: 58 },
                ],
            },
            {
                group: "Backend",
                items: [
                    { name: "Databases", level: 75 },
                    { name: "Caching", level: 52 },
                    { name: "Observability", level: 44 },
                ],
            },
            {
                group: "Career",
                items: [
                    { name: "Behavioral", level: 63 },
                    { name: "Negotiation", level: 38 },
                ],
            },
        ],
        [],
    );

    const overall = useMemo(() => {
        const all = gaps.flatMap((g) => g.items);
        const sum = all.reduce((a, b) => a + b.level, 0);
        return Math.round(sum / all.length);
    }, [gaps]);

    const allGaps = useMemo(
        () =>
            gaps.flatMap((group) =>
                group.items.map((item) => ({
                    ...item,
                    group: group.group,
                    gap: Math.max(0, 100 - item.level),
                })),
            ),
        [gaps],
    );

    const generatePlan = () => {
        const prioritized = [...allGaps].sort((a, b) => a.level - b.level);

        const steps = prioritized.map((item, index) => {
            const weeks = item.gap >= 45 ? 3 : item.gap >= 30 ? 2 : 1;
            const sessionsPerWeek = item.level < 60 ? 4 : 3;

            return {
                id: `${item.name}-${index}`,
                skill: item.name,
                group: item.group,
                currentLevel: item.level,
                targetLevel: Math.min(100, item.level + Math.max(10, Math.round(item.gap * 0.4))),
                weeks,
                sessionsPerWeek,
                priority: index + 1,
                priorityLabel: item.level < 50 ? "High" : item.level < 70 ? "Medium" : "Low",
            };
        });

        const totalWeeks = steps.reduce((sum, step) => sum + step.weeks, 0);
        const mentorCount = Math.max(1, Math.ceil(steps.filter((step) => step.currentLevel < 60).length / 2));

        setPlan({
            steps,
            totalWeeks,
            nextFocus: steps[0]?.skill || "Maintain consistency",
            mentorCount,
        });

        addToast(`Generated ${steps.length}-step learning plan`, "success");
    };

    const downloadPlanAsPdf = () => {
        if (!plan?.steps?.length) {
            addToast("Generate the plan before downloading PDF", "error");
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

            const ensureSpace = (needed = 90) => {
                if (y + needed > page.height - page.marginY) {
                    doc.addPage();
                    y = page.marginY;
                }
            };

            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(3, 105, 161);
            doc.text("Career Bridge Learning Plan", page.marginX, y);
            y += 28;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(71, 85, 105);
            doc.text(
                `Role: ${target}   |   Readiness: ${overall}%   |   Generated: ${now.toLocaleString()}`,
                page.marginX,
                y,
            );
            y += 26;

            doc.setDrawColor(203, 213, 225);
            doc.line(page.marginX, y, page.width - page.marginX, y);
            y += 24;

            writeLine(`Next Focus: ${plan.nextFocus}`, 12, [15, 23, 42], 18);
            writeLine(`Estimated Timeline: ${plan.totalWeeks} weeks`, 12, [15, 23, 42], 18);
            writeLine(`Suggested Mentors: ${plan.mentorCount}`, 12, [15, 23, 42], 18);
            y += 8;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(15, 23, 42);
            doc.text("Prioritized Roadmap", page.marginX, y);
            y += 20;

            plan.steps.forEach((step) => {
                ensureSpace(92);

                doc.setDrawColor(226, 232, 240);
                doc.roundedRect(page.marginX, y - 14, page.width - page.marginX * 2, 74, 8, 8);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(15, 23, 42);
                doc.text(`${step.priority}. ${step.skill} (${step.group})`, page.marginX + 12, y + 4);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(51, 65, 85);
                doc.text(
                    `Current: ${step.currentLevel}%   Target: ${step.targetLevel}%   Duration: ${step.weeks} week(s)`,
                    page.marginX + 12,
                    y + 24,
                );
                doc.text(
                    `Weekly Cadence: ${step.sessionsPerWeek} focused session(s)`,
                    page.marginX + 12,
                    y + 42,
                );

                y += 86;
            });

            ensureSpace(50);
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            const footer = "Generated by Career Bridge Skill Gap Analyzer";
            doc.text(footer, page.marginX, page.height - page.marginY);

            const safeTarget = target.toLowerCase().replace(/\s+/g, "-");
            const filename = `career-bridge-plan-${safeTarget}.pdf`;

            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);

            addToast("Plan downloaded as PDF", "success");
        } catch (error) {
            addToast("PDF download failed. Please try again.", "error");
            console.error("PDF export failed:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">Skill Gap Analyzer</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Identify what to learn next for your target role.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge color="violet">Target</Badge>
                    <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/60"
                    >
                        <option>Backend Engineer</option>
                        <option>Frontend Engineer</option>
                        <option>Fullstack Engineer</option>
                        <option>Data Engineer</option>
                    </select>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <Card className="p-5 xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-white">Your Gaps</div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={generatePlan}>
                                Generate Plan <Icon name="arrowRight" size={16} />
                            </Button>
                            <Button variant="secondary" onClick={downloadPlanAsPdf} disabled={!plan?.steps?.length}>
                                Download PDF <Icon name="file" size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 space-y-5">
                        {gaps.map((g) => (
                            <div key={g.group}>
                                <div className="text-xs font-semibold text-gray-400 mb-2">
                                    {g.group}
                                </div>
                                <div className="space-y-3">
                                    {g.items.map((s) => (
                                        <div key={s.name} className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-semibold text-white">
                                                    {s.name}
                                                </div>
                                                <Badge color={s.level >= 70 ? "emerald" : s.level >= 50 ? "violet" : "rose"}>
                                                    {s.level}%
                                                </Badge>
                                            </div>
                                            <ProgressBar value={s.level} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold text-white">
                                Readiness
                            </div>
                            <div className="text-xs text-gray-500">for {target}</div>
                        </div>
                        <Badge color={overall >= 70 ? "emerald" : "violet"}>
                            {overall}%
                        </Badge>
                    </div>

                    <div className="mt-5 space-y-3 text-sm text-gray-300">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Next focus</span>
                            <span className="font-semibold text-white">{plan?.nextFocus || "Generate a plan"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Est. time</span>
                            <span className="font-semibold text-white">{plan ? `${plan.totalWeeks} weeks` : "--"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Suggested</span>
                            <span className="font-semibold text-white">{plan ? `${plan.mentorCount} mentors` : "--"}</span>
                        </div>
                    </div>

                    <div className="mt-4 max-h-64 overflow-auto space-y-2 pr-1">
                        {plan?.steps?.length ? (
                            plan.steps.map((step) => (
                                <div
                                    key={step.id}
                                    className="rounded-xl border border-gray-800/70 bg-gray-900/20 px-3 py-2"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-white">
                                            {step.priority}. {step.skill}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Badge color={step.priorityLabel === "High" ? "rose" : step.priorityLabel === "Medium" ? "violet" : "emerald"}>
                                                {step.priorityLabel}
                                            </Badge>
                                            <Badge color={step.currentLevel < 50 ? "rose" : step.currentLevel < 70 ? "violet" : "emerald"}>
                                                {step.currentLevel}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-1 text-[11px] text-gray-500">
                                        {step.group} · {step.weeks} week(s) · {step.sessionsPerWeek} sessions/week · target {step.targetLevel}%
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge color="gray">~{step.weeks * step.sessionsPerWeek} sessions</Badge>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => navigate(step.currentLevel < 55 ? "/marketplace" : "/webinars")}
                                        >
                                            Start Learning
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-800/70 px-3 py-3 text-xs text-gray-500">
                                Click Generate Plan to build a prioritized roadmap from all gaps.
                            </div>
                        )}
                    </div>

                    <div className="mt-4 rounded-xl border border-gray-800/70 bg-gray-900/20 p-3">
                        <div className="text-xs font-semibold text-gray-400 mb-2">Roadmap Legend</div>
                        <div className="flex flex-wrap gap-2">
                            <Badge color="rose">High Priority</Badge>
                            <Badge color="violet">Medium Priority</Badge>
                            <Badge color="emerald">Low Priority</Badge>
                            <Badge color="gray">Time Estimation Included</Badge>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-800/60 pt-4 space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Icon name="award" size={14} className="text-violet-400" />
                            AI scores are estimates (demo)
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon name="book" size={14} className="text-violet-400" />
                            Learning plans integrate webinars + mentors
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Skills;
