import { useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { CircularScore, ProgressBar } from "../devconnect/ui/Progress";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../utils/api";

const Resume = () => {
    const { addToast } = useToast();
    const fileInputRef = useRef(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const score = useMemo(() => {
        return analysis?.score ?? 0;
    }, [analysis?.score]);

    const breakdown = useMemo(
        () => analysis?.breakdown || [
            { label: "Keywords Match", value: 0 },
            { label: "Impact", value: 0 },
            { label: "Structure", value: 0 },
            { label: "ATS Readability", value: 0 },
        ],
        [analysis],
    );

    const suggestions = analysis?.suggestions || [];
    const missingKeywords = analysis?.missingKeywords || analysis?.keywordsMissing || [];

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const removeFile = () => {
        setResumeFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        addToast("Removed resume file", "info");
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            return;
        }

        setResumeFile(file);
        addToast(`Selected ${file.name}`, "success");
    };

    const analyze = async () => {
        if (!jobDesc.trim()) {
            addToast("Paste a job description first", "warning");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            if (resumeFile) {
                formData.append("resume", resumeFile);
            }

            formData.append("jobDescription", jobDesc);

            const response = await apiRequest("/api/resume/analyze", {
                method: "POST",
                body: formData,
            });

            setAnalysis(response.analysis);
            addToast("Resume analyzed successfully", "success");
        } catch (error) {
            addToast(error.message || "Unable to analyze resume", "error");
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = () => {
        if (!analysis) {
            addToast("Run analysis first", "warning");
            return;
        }

        const doc = new jsPDF({ unit: "pt", format: "a4" });
        let y = 52;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("Career Bridge Resume Report", 40, y);
        y += 30;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`Overall Match Score: ${score}/100`, 40, y);
        y += 22;

        doc.text(`File: ${resumeFile?.name || "No file uploaded"}`, 40, y);
        y += 24;

        doc.setFont("helvetica", "bold");
        doc.text("Breakdown", 40, y);
        y += 18;

        doc.setFont("helvetica", "normal");
        breakdown.forEach((item) => {
            doc.text(`- ${item.label}: ${item.value}%`, 44, y);
            y += 16;
        });

        y += 8;
        doc.setFont("helvetica", "bold");
        doc.text("Suggestions", 40, y);
        y += 18;
        doc.setFont("helvetica", "normal");
        (suggestions.length ? suggestions : ["No suggestions available"]).forEach((item) => {
            const wrapped = doc.splitTextToSize(`- ${item}`, 500);
            doc.text(wrapped, 44, y);
            y += wrapped.length * 14;
        });

        y += 8;
        doc.setFont("helvetica", "bold");
        doc.text("Missing Keywords", 40, y);
        y += 18;
        doc.setFont("helvetica", "normal");
        (missingKeywords.length ? missingKeywords : ["No missing keywords found"]).forEach((item) => {
            doc.text(`- ${item}`, 44, y);
            y += 14;
        });

        doc.save("career-bridge-resume-report.pdf");
        addToast("Resume report downloaded", "success");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white">Resume AI</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Get a match score and actionable feedback for top roles.
                </p>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
                <Card className="p-5 xl:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-white">Upload Resume</div>
                        <Badge color={resumeFile ? "emerald" : "gray"}>
                            {resumeFile ? "Uploaded" : "Not uploaded"}
                        </Badge>
                    </div>
                    <div className="mt-4 border border-dashed border-gray-700 rounded-2xl p-6 bg-gray-900/30">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
                                <Icon name="upload" size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-white">
                                    Upload a PDF resume
                                </div>
                                <div className="text-xs text-gray-500">
                                    The file and job description are analyzed by the backend and saved to the database.
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Button
                                variant={resumeFile ? "secondary" : "primary"}
                                onClick={triggerUpload}
                            >
                                {resumeFile ? "Replace" : "Upload"}
                            </Button>
                            {resumeFile ? (
                                <Button variant="ghost" onClick={removeFile}>
                                    Remove
                                </Button>
                            ) : null}
                        </div>
                        {resumeFile ? (
                            <div className="mt-3 text-xs text-gray-400">
                                Selected file: {resumeFile.name}
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-white">
                                Job Description
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setJobDesc("")}
                            >
                                Clear
                            </Button>
                        </div>
                        <textarea
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            rows={6}
                            placeholder="Paste a job description to get a tailored score..."
                            className="w-full bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
                        />
                    </div>

                    <div className="mt-5 flex justify-end">
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={downloadReport}>
                                Download PDF
                            </Button>
                            <Button onClick={analyze} disabled={loading}>
                                {loading ? "Analyzing..." : (<><span>Analyze</span> <Icon name="trending" size={16} /></>)}
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold text-white">
                                Match Score
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                ATS + semantic similarity
                            </div>
                        </div>
                        <Badge color={score >= 80 ? "emerald" : "violet"}>
                            {score >= 80 ? "Strong" : "Improve"}
                        </Badge>
                    </div>

                    <div className="mt-5 flex justify-center">
                        <CircularScore value={score} />
                    </div>

                    <div className="mt-6 space-y-3">
                        {breakdown.map((b) => (
                            <div key={b.label}>
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                    <span>{b.label}</span>
                                    <span className="text-gray-500">{b.value}%</span>
                                </div>
                                <ProgressBar value={b.value} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card className="p-5">
                <div className="text-sm font-semibold text-white mb-3">Suggestions</div>
                <div className="grid md:grid-cols-2 gap-3">
                    {suggestions.length ? suggestions.map((item) => (
                        <div key={item} className="bg-gray-900/30 border border-gray-800/70 rounded-2xl p-4 text-sm text-gray-300">
                            {item}
                        </div>
                    )) : (
                        <div className="text-sm text-gray-500">Run an analysis to see tailored suggestions.</div>
                    )}
                </div>
            </Card>

            <Card className="p-5">
                <div className="text-sm font-semibold text-white mb-3">Missing Keywords</div>
                <div className="flex flex-wrap gap-2">
                    {missingKeywords.length ? missingKeywords.map((keyword) => (
                        <Badge key={keyword} color="rose">{keyword}</Badge>
                    )) : (
                        <div className="text-sm text-gray-500">No missing keywords detected from current analysis.</div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Resume;
