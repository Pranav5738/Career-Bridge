const STOPWORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "he", "her", "his",
    "in", "is", "it", "its", "of", "on", "or", "our", "that", "the", "their", "them", "they", "this", "to",
    "was", "were", "will", "with", "you", "your", "years", "year",
]);

const ACTION_VERBS = [
    "built", "designed", "implemented", "optimized", "led", "delivered", "developed", "improved", "launched",
    "managed", "reduced", "increased", "created", "deployed", "automated", "scaled", "analyzed", "engineered",
];

const SECTION_HEADERS = ["summary", "experience", "projects", "skills", "education", "certifications"];

const tokenize = (text) => {
    return (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, " ")
        .replace(/[-_]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !STOPWORDS.has(word));
};

const toNgrams = (tokens, min = 2, max = 3) => {
    const ngrams = [];
    for (let n = min; n <= max; n += 1) {
        for (let i = 0; i <= tokens.length - n; i += 1) {
            const slice = tokens.slice(i, i + n);
            if (slice.some((token) => STOPWORDS.has(token))) continue;
            ngrams.push(slice.join(" "));
        }
    }
    return ngrams;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const analyzeResumeService = async (resumeText, jobDescription) => {
    const cleanResume = (resumeText || "").trim();
    const cleanJd = (jobDescription || "").trim();

    const resumeTokens = tokenize(cleanResume);
    const jdTokens = tokenize(cleanJd);

    const resumeSet = new Set(resumeTokens);
    const jdSet = new Set(jdTokens);

    const matchedKeywords = [...jdSet].filter((word) => resumeSet.has(word));
    const missingKeywords = [...jdSet].filter((word) => !resumeSet.has(word));

    const jdPhrases = [...new Set(toNgrams(jdTokens))];
    const resumeTextLower = cleanResume.toLowerCase();
    const matchedPhrases = jdPhrases.filter((phrase) => resumeTextLower.includes(phrase));

    const keywordCoverage = jdSet.size ? matchedKeywords.length / jdSet.size : 0;
    const phraseCoverage = jdPhrases.length ? matchedPhrases.length / jdPhrases.length : 0;
    const relevanceScore = Math.round((keywordCoverage * 0.7 + phraseCoverage * 0.3) * 100);

    const numberMentions = cleanResume.match(/\b\d+(?:\.\d+)?%?\b/g)?.length || 0;
    const actionVerbMatches = ACTION_VERBS.reduce((sum, verb) => {
        const count = cleanResume.match(new RegExp(`\\b${verb}\\b`, "gi"))?.length || 0;
        return sum + count;
    }, 0);
    const impactScore = clamp(Math.round(numberMentions * 6 + actionVerbMatches * 5), 0, 100);

    const headerCount = SECTION_HEADERS.reduce((sum, header) => {
        const found = new RegExp(`\\b${header}\\b`, "i").test(cleanResume);
        return sum + (found ? 1 : 0);
    }, 0);
    const lengthBonus = cleanResume.length > 450 ? 15 : cleanResume.length > 250 ? 8 : 0;
    const structureScore = clamp(headerCount * 14 + lengthBonus, 0, 100);

    const noisyCharacters = cleanResume.match(/[|\t`~<>]/g)?.length || 0;
    const shortLines = cleanResume.split(/\n+/).filter((line) => line.trim().length > 0 && line.trim().length < 3).length;
    const atsScore = clamp(95 - noisyCharacters * 4 - shortLines * 2, 10, 100);

    const weighted = (
        relevanceScore * 0.55 +
        impactScore * 0.2 +
        structureScore * 0.15 +
        atsScore * 0.1
    );

    let finalScore = Math.round(weighted);

    // Hard caps prevent unrelated documents (like certificates) from scoring high.
    if (relevanceScore < 15) finalScore = Math.min(finalScore, 30);
    else if (relevanceScore < 30) finalScore = Math.min(finalScore, 45);
    else if (relevanceScore < 45) finalScore = Math.min(finalScore, 60);

    // If resume is very short compared to JD, penalize confidence.
    if (resumeTokens.length < Math.max(30, Math.round(jdTokens.length * 0.35))) {
        finalScore = Math.max(0, finalScore - 12);
    }

    const breakdown = [
        { label: "Keywords Match", value: relevanceScore },
        { label: "Impact", value: impactScore },
        { label: "Structure", value: structureScore },
        { label: "ATS Readability", value: atsScore },
    ];

    const suggestions = [
        "Tailor the resume content to the exact role and responsibilities in the job description",
        "Use measurable achievements (numbers, metrics, percentages)",
        "Ensure clear sections: Summary, Experience, Projects, Skills, Education",
        ...missingKeywords.slice(0, 8).map((word) => `Include keyword: ${word}`),
    ];

    return {
        score: finalScore,
        breakdown,
        suggestions,
    };
};