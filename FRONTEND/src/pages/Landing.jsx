import { useNavigate } from "react-router-dom";
import Badge from "../devconnect/ui/Badge";
import Button from "../devconnect/ui/Button";
import Icon from "../devconnect/ui/Icon";

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: "cpu",
            title: "AI Resume Match",
            desc: "Get instant match scores against job descriptions powered by semantic AI.",
            color: "violet",
        },
        {
            icon: "mic",
            title: "Mock Interviews",
            desc: "Practice with AI interviewers that adapt to your experience level.",
            color: "indigo",
        },
        {
            icon: "users",
            title: "Expert Mentors",
            desc: "Connect with FAANG engineers and startup founders for 1:1 guidance.",
            color: "cyan",
        },
        {
            icon: "target",
            title: "Skill Gap Analysis",
            desc: "Pinpoint exactly what skills you need for your dream role.",
            color: "emerald",
        },
        {
            icon: "video",
            title: "Live Webinars",
            desc: "Join live sessions on system design, DSA, and career strategy.",
            color: "amber",
        },
        {
            icon: "message",
            title: "Dev Community",
            desc: "Engage in peer-reviewed discussions and knowledge sharing.",
            color: "rose",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "SWE @ Google",
            text: "DevConnect's resume analyzer helped me crack Google in 3 months. The skill gap feature is insanely accurate.",
            avatar: "SC",
        },
        {
            name: "Marcus Kim",
            role: "Staff Eng @ Stripe",
            text: "The mock interview AI is scary good. It caught every weakness in my system design answers.",
            avatar: "MK",
        },
        {
            name: "Priya Patel",
            role: "PM @ Meta",
            text: "Found an incredible mentor who guided me through the Meta PM loop. Worth every penny.",
            avatar: "PP",
        },
    ];

    const pricing = [
        {
            plan: "Free",
            price: "$0",
            features: [
                "3 resume analyses/mo",
                "Community access",
                "5 mentor messages",
                "1 mock interview",
            ],
            cta: "Get Started",
        },
        {
            plan: "Pro",
            price: "$29",
            features: [
                "Unlimited analyses",
                "Skill gap reports",
                "Unlimited mock interviews",
                "10 mentor sessions",
                "Priority matching",
            ],
            cta: "Start Pro",
            popular: true,
        },
        {
            plan: "Mentor+",
            price: "$79",
            features: [
                "All Pro features",
                "1:1 dedicated mentor",
                "Weekly coaching calls",
                "Career roadmap",
                "Job referral program",
            ],
            cta: "Go All In",
        },
    ];

    return (
        <div className="bg-slate-50 text-slate-900 min-h-screen">
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center">
                        <Icon name="zap" size={16} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tight text-slate-900">
                        Career <span className="text-sky-600">Bridge</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
                    {["Features", "How It Works", "Pricing"].map((l) => (
                        <button
                            key={l}
                            type="button"
                            className="hover:text-slate-900 transition-colors"
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => navigate("/login")}>
                        Sign In
                    </Button>
                    <Button onClick={() => navigate("/register")}>Get Started</Button>
                </div>
            </nav>

            <section className="relative pt-28 pb-20 px-8 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-slate-50 to-slate-50" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-400/20 rounded-full blur-3xl" />
                <div className="relative max-w-5xl mx-auto text-center">
                    <Badge color="cyan" className="mb-6">
                        AI-Powered Career Intelligence
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
                        Land Your
                        <br />
                        <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                            Dream Tech Role
                        </span>
                        <br />
                        Faster
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        AI-powered resume analysis, skill gap intelligence, mock interviews, and curated expert mentors — everything you need to break into top tech companies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => navigate("/register")}
                        >
                            Start Free Today <Icon name="arrowRight" size={18} />
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() => navigate("/marketplace")}
                        >
                            Browse Mentors
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-20 px-8 border-t border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-black mb-4">
                            Everything You Need to{" "}
                            <span className="text-sky-600">Succeed</span>
                        </h2>
                        <p className="text-slate-500 text-lg">
                            A complete toolkit for engineering career growth
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-300 group"
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                >
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-sky-100 text-sky-700">
                                        <Icon name={f.icon} size={20} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-8 bg-slate-100/70">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black mb-4">
                        How It <span className="text-sky-600">Works</span>
                    </h2>
                    <p className="text-slate-500 mb-14">
                        Three steps to your next offer
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Analyze & Plan",
                                desc: "Upload your resume, set your target role. AI identifies your exact skill gaps instantly.",
                            },
                            {
                                step: "02",
                                title: "Practice & Learn",
                                desc: "Mock interviews, curated resources, and live webinars build confidence fast.",
                            },
                            {
                                step: "03",
                                title: "Connect & Land",
                                desc: "Book sessions with mentors who've been there. Get referrals. Land the offer.",
                            },
                        ].map((s) => (
                            <div key={s.step} className="relative">
                                <div className="text-6xl font-black text-slate-300 mb-3">
                                    {s.step}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    {s.title}
                                </h3>
                                <p className="text-slate-500 text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-14">
                        Real <span className="text-sky-600">Results</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.name}
                                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
                            >
                                <div className="flex gap-1 mb-4">
                                    {Array(5)
                                        .fill(0)
                                        .map((_, i) => (
                                            <Icon
                                                key={i}
                                                name="star"
                                                size={14}
                                                className="text-amber-400 fill-amber-400"
                                            />
                                        ))}
                                </div>
                                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                                    “{t.text}”
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-xs font-bold text-white">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {t.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {t.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-8 bg-slate-100/70 border-t border-slate-200">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-4">
                        Simple <span className="text-sky-600">Pricing</span>
                    </h2>
                    <p className="text-slate-500 text-center mb-14">
                        No hidden fees. Cancel anytime.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {pricing.map((p) => (
                            <div
                                key={p.plan}
                                className={`relative p-6 rounded-2xl border ${
                                    p.popular
                                        ? "border-sky-500/60 bg-sky-500/5"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                {p.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge color="cyan">Most Popular</Badge>
                                    </div>
                                )}
                                <div className="mb-2 text-sm font-semibold text-slate-500">
                                    {p.plan}
                                </div>
                                <div className="text-4xl font-black text-slate-900 mb-6">
                                    {p.price}
                                    <span className="text-base font-normal text-slate-500">
                                        /mo
                                    </span>
                                </div>
                                <ul className="space-y-2.5 mb-8">
                                    {p.features.map((f) => (
                                        <li
                                            key={f}
                                            className="flex items-center gap-2.5 text-sm text-slate-600"
                                        >
                                            <Icon
                                                name="check"
                                                size={15}
                                                className="text-emerald-400 flex-shrink-0"
                                            />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={p.popular ? "primary" : "outline"}
                                    className="w-full justify-center"
                                    onClick={() => navigate("/register")}
                                >
                                    {p.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-12 px-8 border-t border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center">
                            <Icon name="zap" size={14} className="text-white" />
                        </div>
                        <span className="font-black text-slate-900">
                            Career <span className="text-sky-600">Bridge</span>
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">
                        © 2026 Career Bridge. Built for builders who ship.
                    </p>
                    <div className="flex gap-4 text-sm text-slate-500">
                        {[
                            "Privacy",
                            "Terms",
                            "Contact",
                        ].map((l) => (
                            <button
                                key={l}
                                type="button"
                                className="hover:text-slate-900 transition-colors"
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
