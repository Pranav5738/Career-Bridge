const roleSkillsMap = {
    "Machine Learning Engineer": [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "Docker",
        "AWS",
        "CI/CD"
    ],
    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Redux",
        "Tailwind"
    ],
    "Backend Developer": [
        "Node.js",
        "Express",
        "MongoDB",
        "SQL",
        "Docker",
        "API Design"
    ]
};

export const analyzeSkillGapService = async (targetRole, currentSkills) => {
    const requiredSkills = roleSkillsMap[targetRole] || [];

    const missingSkills = requiredSkills.filter(
        (skill) => !currentSkills.includes(skill)
    );

    const suggestions = missingSkills.map(
        (skill) => `Learn ${skill} fundamentals`
    );

    return {
        targetRole,
        currentSkills,
        missingSkills,
        suggestions
    };
};