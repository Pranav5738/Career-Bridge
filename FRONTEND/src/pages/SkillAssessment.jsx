import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const ASSESSMENT_STORAGE_PREFIX = "careerbridge-skill-assessment-v1";
const getProfileKey = (role) => (role === "mentor" ? "mentor" : "student");
const getProfileLabel = (profileKey) => (profileKey === "mentor" ? "Mentor" : "Student");
const getAssessmentStorageKey = (profileKey) => `${ASSESSMENT_STORAGE_PREFIX}:${profileKey}`;

const SUBJECT_LABELS = {
    dsa: "DSA",
    dbms: "DBMS",
    os: "OS",
    cn: "Computer Networks",
    oop: "OOP"
};

const QUESTION_BANK = {
    dsa: [
        { question: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1 },
        { question: "Stack follows which order?", options: ["FIFO", "LIFO", "Random", "None"], answer: 1 },
        { question: "Queue is commonly used in which traversal?", options: ["DFS", "BFS", "Sorting", "Hashing"], answer: 1 },
        { question: "Best case of QuickSort?", options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], answer: 1 },
        { question: "A common way to resolve hash collisions is:", options: ["DFS", "Chaining", "BFS", "Topological sort"], answer: 1 },
        { question: "A tree with n nodes has how many edges?", options: ["n", "n-1", "n+1", "2n"], answer: 1 },
        { question: "AVL tree is:", options: ["A complete tree", "Self-balancing BST", "Heap variant", "Trie"], answer: 1 },
        { question: "Heap is:", options: ["Complete binary tree", "Full binary tree", "Binary search tree", "N-ary tree"], answer: 0 },
        { question: "DFS mainly uses:", options: ["Queue", "Stack", "Hash table", "Priority queue"], answer: 1 },
        { question: "BFS mainly uses:", options: ["Queue", "Stack", "Recursion only", "Array sort"], answer: 0 },
        { question: "Merge sort average complexity is:", options: ["O(n)", "O(n^2)", "O(n log n)", "O(log n)"], answer: 2 },
        { question: "Maximum nodes at level L in a binary tree:", options: ["2L", "L^2", "2^L", "L"], answer: 2 },
        { question: "Linked list random access complexity:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 2 },
        { question: "Graph cycle detection (directed/undirected) is commonly done with:", options: ["Dijkstra", "BFS only", "DFS", "KMP"], answer: 2 },
        { question: "Dynamic programming is useful for:", options: ["Disjoint subproblems", "Overlapping subproblems", "Randomized pivots", "Only graph coloring"], answer: 1 },
        { question: "Greedy works best when problem has:", options: ["Optimal substructure", "Only recursion", "Circular dependency", "No constraints"], answer: 0 },
        { question: "Average-case lookup in hashing:", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], answer: 0 },
        { question: "Height of balanced BST is typically:", options: ["n", "n/2", "log n", "sqrt(n)"], answer: 2 },
        { question: "Priority queue is often implemented using:", options: ["Linked List", "Heap", "Trie", "Hash Set"], answer: 1 },
        { question: "Dijkstra algorithm works on:", options: ["Unweighted graphs only", "Graphs with negative edges", "Weighted graphs with non-negative weights", "Only DAG"], answer: 2 }
    ],
    dbms: [
        { question: "Normalization primarily removes:", options: ["Redundancy", "Indexes", "Constraints", "Transactions"], answer: 0 },
        { question: "Primary key must be:", options: ["Nullable and unique", "Unique and not null", "Only indexed", "Foreign"], answer: 1 },
        { question: "Foreign key is used to:", options: ["Sort rows", "Reference key in another table", "Encrypt rows", "Normalize to 5NF"], answer: 1 },
        { question: "ACID includes:", options: ["Atomicity, Consistency, Isolation, Durability", "Availability, Consistency, Integrity, Durability", "Atomicity, Caching, Isolation, Durability", "None"], answer: 0 },
        { question: "JOIN is used to:", options: ["Delete rows", "Combine rows from multiple tables", "Create index", "Backup schema"], answer: 1 },
        { question: "Index mainly improves:", options: ["Insert speed", "Search speed", "Backup speed", "Normalization"], answer: 1 },
        { question: "SQL command to retrieve data:", options: ["GET", "FETCH", "SELECT", "SHOW"], answer: 2 },
        { question: "GROUP BY is used for:", options: ["Row locking", "Aggregation by columns", "Schema migration", "Foreign keys"], answer: 1 },
        { question: "HAVING clause filters:", options: ["Before grouping", "Grouped data", "Indexes", "Views"], answer: 1 },
        { question: "Transactions ensure:", options: ["Data integrity", "UI integrity", "Fast rendering", "No locking"], answer: 0 },
        { question: "3NF removes:", options: ["Partial dependency", "Transitive dependency", "Multivalued dependency", "Join dependency"], answer: 1 },
        { question: "Deadlock occurs because of:", options: ["Circular wait", "Low cache", "Read uncommitted", "Null constraints"], answer: 0 },
        { question: "View is:", options: ["Physical table", "Virtual table", "Materialized index", "Stored procedure"], answer: 1 },
        { question: "Trigger executes:", options: ["Manually only", "Automatically on events", "Once per DB", "On backup"], answer: 1 },
        { question: "Stored procedure is:", options: ["Client-only script", "Precompiled SQL block", "Trigger type", "Index strategy"], answer: 1 },
        { question: "Isolation level controls:", options: ["Disk allocation", "Concurrency behavior", "Schema naming", "Replication lag"], answer: 1 },
        { question: "DELETE vs TRUNCATE difference:", options: ["Both same", "DELETE logs row-wise; TRUNCATE minimal logging", "TRUNCATE supports WHERE", "DELETE resets identity always"], answer: 1 },
        { question: "Schema represents:", options: ["Database structure", "User role", "Backup file", "Transaction log"], answer: 0 },
        { question: "OLTP vs OLAP:", options: ["Transactional vs Analytical", "Analytical vs Transactional", "Both analytical", "Both transactional"], answer: 0 },
        { question: "ER diagram shows:", options: ["Entities and relationships", "Indexes and triggers", "Transactions only", "SQL queries"], answer: 0 }
    ],
    os: [
        { question: "Operating System manages:", options: ["Only memory", "Resources", "Only CPU", "Only files"], answer: 1 },
        { question: "Process vs Thread:", options: ["Both same", "Execution units with different isolation", "Thread heavier than process", "Process shares all memory by default"], answer: 1 },
        { question: "Scheduling can be:", options: ["Only preemptive", "Only non-preemptive", "Both preemptive and non-preemptive", "Random"], answer: 2 },
        { question: "FCFS stands for:", options: ["First Core First Serve", "Fast Come Fast Schedule", "First Come First Serve", "First Come Fixed Slot"], answer: 2 },
        { question: "Deadlock requires how many necessary conditions?", options: ["2", "3", "4", "5"], answer: 2 },
        { question: "Paging helps reduce:", options: ["Internal fragmentation", "External fragmentation", "CPU usage", "Context switch"], answer: 1 },
        { question: "Virtual memory means:", options: ["Using disk as extension of RAM", "RAM mirroring", "GPU memory", "Cache-only memory"], answer: 0 },
        { question: "Semaphore is used for:", options: ["Sorting", "Synchronization", "Encryption", "Compression"], answer: 1 },
        { question: "Context switch is:", options: ["Switching from user to kernel only", "Switching CPU from one process/thread context to another", "Swapping disk blocks", "Changing file handle"], answer: 1 },
        { question: "Kernel mode is:", options: ["Privileged mode", "Guest mode", "Thread mode", "Unsafe mode"], answer: 0 },
        { question: "Starvation means:", options: ["Process crashes", "Low-priority process waits indefinitely", "All processes blocked", "No ready queue"], answer: 1 },
        { question: "Thrashing means:", options: ["Excessive paging", "CPU overheating", "Deadlock", "Fragmentation"], answer: 0 },
        { question: "IPC stands for:", options: ["Inter Program Cache", "Inter Process Communication", "Internal Process Control", "Instruction Pipeline Control"], answer: 1 },
        { question: "Mutex is:", options: ["Lock mechanism", "Queue type", "Paging strategy", "Scheduler"], answer: 0 },
        { question: "File system handles:", options: ["Only metadata", "Data storage organization", "Only memory", "Only networking"], answer: 1 },
        { question: "CPU scheduling goal includes:", options: ["Efficiency", "Higher latency", "Only fairness", "Disk compaction"], answer: 0 },
        { question: "Multithreading enables:", options: ["Parallel/concurrent tasks", "Only single task", "No context switches", "No memory sharing"], answer: 0 },
        { question: "Swapping uses:", options: ["CPU cache", "Disk space", "GPU", "Network"], answer: 1 },
        { question: "Interrupt is:", options: ["Signal to CPU to handle event", "Compiler optimization", "Thread lock", "Disk partition"], answer: 0 },
        { question: "OS types include:", options: ["Batch, Real-time, Distributed", "Only batch", "Only real-time", "Only embedded"], answer: 0 }
    ],
    cn: [
        { question: "OSI model has how many layers?", options: ["5", "6", "7", "8"], answer: 2 },
        { question: "TCP is:", options: ["Unreliable protocol", "Reliable transport protocol", "Network layer protocol", "Application protocol"], answer: 1 },
        { question: "UDP is:", options: ["Reliable and connection-oriented", "Unreliable and connectionless", "Application protocol", "Routing protocol"], answer: 1 },
        { question: "IP address is:", options: ["Unique network identifier", "Only MAC alias", "Application port", "Cipher key"], answer: 0 },
        { question: "DNS translates:", options: ["IP to MAC", "Domain name to IP", "Port to process", "HTTP to HTTPS"], answer: 1 },
        { question: "HTTP belongs to:", options: ["Application layer", "Transport layer", "Network layer", "Data link layer"], answer: 0 },
        { question: "Port number identifies:", options: ["Computer model", "Process/service", "Packet size", "Subnet"], answer: 1 },
        { question: "Router operates mainly at:", options: ["Data link layer", "Network layer", "Transport layer", "Application layer"], answer: 1 },
        { question: "Switch mainly operates at:", options: ["Physical layer", "Data link layer", "Transport layer", "Session layer"], answer: 1 },
        { question: "MAC address is:", options: ["Logical address", "Physical address", "Port number", "Domain name"], answer: 1 },
        { question: "Bandwidth is:", options: ["Delay", "Transfer capacity", "Packet loss", "Jitter"], answer: 1 },
        { question: "Latency means:", options: ["Throughput", "Delay", "Loss", "Buffer size"], answer: 1 },
        { question: "Firewall is used for:", options: ["Routing", "Security filtering", "Compression", "Caching"], answer: 1 },
        { question: "Packet switching is:", options: ["Circuit reservation", "Data transfer by packets", "Only LAN broadcast", "File encryption"], answer: 1 },
        { question: "TCP handshake is:", options: ["2-way", "3-way", "4-way", "No handshake"], answer: 1 },
        { question: "IPv6 address length:", options: ["32-bit", "64-bit", "128-bit", "256-bit"], answer: 2 },
        { question: "Subnetting means:", options: ["Encrypting network", "Dividing network into smaller networks", "Increasing latency", "Converting UDP to TCP"], answer: 1 },
        { question: "FTP is used for:", options: ["File transfer", "Time sync", "Mail routing", "DNS lookup"], answer: 0 },
        { question: "SSL/TLS provides:", options: ["Compression", "Security layer", "Routing", "Load balancing"], answer: 1 },
        { question: "CDN helps with:", options: ["Content delivery performance", "Database normalization", "Kernel scheduling", "Thread safety"], answer: 0 }
    ],
    oop: [
        { question: "Which is a core OOP principle?", options: ["Encapsulation", "Normalization", "Sharding", "Routing"], answer: 0 },
        { question: "Inheritance provides:", options: ["Code reuse", "Data replication", "Encryption", "Serialization"], answer: 0 },
        { question: "Polymorphism means:", options: ["Multiple forms/behaviors", "Single inheritance", "No abstraction", "Code duplication"], answer: 0 },
        { question: "Abstraction is:", options: ["Showing all internals", "Hiding implementation details", "Only runtime errors", "Memory cleanup"], answer: 1 },
        { question: "Class vs Object:", options: ["Instance vs blueprint", "Blueprint vs instance", "Both same", "None"], answer: 1 },
        { question: "Constructor is used to:", options: ["Destroy object", "Initialize object", "Serialize object", "Sort object"], answer: 1 },
        { question: "Destructor is used to:", options: ["Initialize object", "Cleanup/release resources", "Create class", "Override methods"], answer: 1 },
        { question: "Method overloading is:", options: ["Runtime polymorphism", "Compile-time polymorphism", "No polymorphism", "Only inheritance"], answer: 1 },
        { question: "Method overriding is:", options: ["Compile-time polymorphism", "Runtime polymorphism", "Static binding only", "Memory allocation"], answer: 1 },
        { question: "Common access modifiers:", options: ["public/private/protected", "open/close/static", "global/local", "up/down/left"], answer: 0 },
        { question: "Interface is:", options: ["Concrete class only", "Abstract contract", "DB schema", "Compiler option"], answer: 1 },
        { question: "Virtual function supports:", options: ["Runtime binding", "Compile-time constants", "Deadlock prevention", "Garbage collection"], answer: 0 },
        { question: "Encapsulation helps in:", options: ["Data hiding", "Data duplication", "Infinite loops", "Sharding"], answer: 0 },
        { question: "Static keyword often implies:", options: ["Per-object copy", "Shared member", "Temporary member", "Read-only always"], answer: 1 },
        { question: "Final keyword usually means:", options: ["Can be overridden", "Cannot be overridden/extended", "Always private", "Always abstract"], answer: 1 },
        { question: "Abstract class typically has:", options: ["No methods", "Partial implementation", "Only static methods", "No inheritance"], answer: 1 },
        { question: "Method is:", options: ["Function inside class", "Variable in struct", "Type of loop", "Thread lock"], answer: 0 },
        { question: "Object creation keyword in many OOP languages:", options: ["class", "new", "this", "super"], answer: 1 },
        { question: "Composition represents:", options: ["Is-a relationship", "Has-a relationship", "No relationship", "Many-to-many SQL"], answer: 1 },
        { question: "Association in OOP means:", options: ["Relationship between objects", "Method overloading", "Memory leak", "Access control"], answer: 0 }
    ]
};

const subjectOrder = ["dsa", "dbms", "os", "cn", "oop"];

const emptyAnswers = () => {
    const data = {};
    subjectOrder.forEach((subjectKey) => {
        data[subjectKey] = {};
    });
    return data;
};

const SkillAssessment = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();
    const profileKey = getProfileKey(user?.role);
    const profileLabel = getProfileLabel(profileKey);
    const [activeSubject, setActiveSubject] = useState("dsa");
    const [answers, setAnswers] = useState(emptyAnswers);

    const subjectStats = useMemo(() => {
        return subjectOrder.map((subjectKey) => {
            const total = QUESTION_BANK[subjectKey].length;
            const answered = Object.keys(answers[subjectKey] || {}).length;
            return {
                subjectKey,
                total,
                answered,
                completed: answered === total
            };
        });
    }, [answers]);

    const answeredAll = subjectStats.every((item) => item.completed);

    const selectAnswer = (subjectKey, questionIndex, optionIndex) => {
        setAnswers((current) => ({
            ...current,
            [subjectKey]: {
                ...current[subjectKey],
                [questionIndex]: optionIndex
            }
        }));
    };

    const buildCorrectCounts = () => {
        const counts = {
            dsa: 0,
            dbms: 0,
            os: 0,
            cn: 0,
            oop: 0,
        };

        subjectOrder.forEach((subjectKey) => {
            QUESTION_BANK[subjectKey].forEach((question, index) => {
                if (answers[subjectKey]?.[index] === question.answer) {
                    counts[subjectKey] += 1;
                }
            });
        });

        return counts;
    };

    const submitAssessment = () => {
        if (!answeredAll) {
            addToast("Please answer all questions before submitting.", "error");
            return;
        }

        const correctAnswers = buildCorrectCounts();

        localStorage.setItem(
            getAssessmentStorageKey(profileKey),
            JSON.stringify({
                correctAnswers,
                profile: profileKey,
                submittedAt: new Date().toISOString(),
            }),
        );

        addToast(`${profileLabel} assessment submitted. Scores loaded into Skill Gap Analyzer.`, "success");
        navigate("/skills");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-black text-white">SDE Skill Assessment</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Complete 20 MCQs per subject. Results are auto-synced to your Skill Gap Analyzer.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge color="violet">{profileLabel}</Badge>
                    <Button variant="ghost" onClick={() => navigate("/skills")}>Back to Analyzer</Button>
                    <Button variant="outline" onClick={submitAssessment}>Submit Assessment</Button>
                </div>
            </div>

            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {subjectStats.map((subject) => (
                        <button
                            key={subject.subjectKey}
                            type="button"
                            onClick={() => setActiveSubject(subject.subjectKey)}
                            className={`rounded-xl border px-3 py-2 text-left ${
                                activeSubject === subject.subjectKey
                                    ? "border-violet-500/70 bg-violet-500/10"
                                    : "border-gray-800/70 bg-gray-900/30"
                            }`}
                        >
                            <div className="text-xs font-semibold text-white">{SUBJECT_LABELS[subject.subjectKey]}</div>
                            <div className="text-[11px] text-gray-400 mt-1">{subject.answered}/{subject.total} answered</div>
                            <div className="mt-1">
                                <Badge color={subject.completed ? "emerald" : "gray"}>
                                    {subject.completed ? "Complete" : "Pending"}
                                </Badge>
                            </div>
                        </button>
                    ))}
                </div>
            </Card>

            <Card className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-bold text-white">{SUBJECT_LABELS[activeSubject]} MCQs</div>
                        <div className="text-xs text-gray-500">Select one option per question</div>
                    </div>
                    <Badge color="violet">20 Questions</Badge>
                </div>

                <div className="mt-4 space-y-4">
                    {QUESTION_BANK[activeSubject].map((question, index) => {
                        const selected = answers[activeSubject]?.[index];
                        return (
                            <div key={`${activeSubject}-${index}`} className="rounded-xl border border-gray-800/70 bg-gray-900/20 p-4">
                                <div className="text-sm font-semibold text-white">
                                    {index + 1}. {question.question}
                                </div>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {question.options.map((option, optionIndex) => (
                                        <button
                                            key={`${activeSubject}-${index}-${optionIndex}`}
                                            type="button"
                                            onClick={() => selectAnswer(activeSubject, index, optionIndex)}
                                            className={`rounded-lg border px-3 py-2 text-left text-sm ${
                                                selected === optionIndex
                                                    ? "border-violet-500/80 bg-violet-500/10 text-white"
                                                    : "border-gray-800/70 bg-gray-950/40 text-gray-300"
                                            }`}
                                        >
                                            {String.fromCharCode(65 + optionIndex)}. {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs text-gray-400">
                        {answeredAll ? "All questions answered. Ready to submit." : "Finish all subjects before submitting."}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => setAnswers(emptyAnswers())}>
                            Reset
                        </Button>
                        <Button variant="outline" onClick={submitAssessment}>
                            Submit Assessment <Icon name="arrowRight" size={16} />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export { ASSESSMENT_STORAGE_PREFIX };
export default SkillAssessment;
