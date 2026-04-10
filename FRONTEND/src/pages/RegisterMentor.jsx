import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import { apiRequest } from "../utils/api";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";

const RegisterMentor = () => {
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const displayName = [location.state?.firstName, location.state?.lastName].filter(Boolean).join(" ").trim();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [expertise, setExpertise] = useState("System Design");
    const [loading, setLoading] = useState(false);

    const handleCreateMentor = async (event) => {
        event?.preventDefault();

        if (!email || !password) {
            addToast("Please fill all fields", "warning");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest("/api/auth/register", {
                method: "POST",
                body: {
                    name: displayName || undefined,
                    email,
                    password,
                    role: "mentor",
                    expertise,
                },
                auth: false,
            });

            login(response.user, response.token);
            addToast("Mentor account created", "success");
            navigate("/mentor-dashboard", { replace: true });
        } catch (error) {
            addToast(error.message || "Unable to create account", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-10 md:py-16">
            <div className="mx-auto max-w-lg">
                <Card className="p-7 md:p-8 border-slate-200 shadow-xl shadow-slate-200/60">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-600 items-center justify-center text-white">
                            <Icon name="award" size={16} />
                        </div>
                        <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-cyan-700 font-semibold">Career Bridge</p>
                            <h1 className="text-xl font-black text-slate-900">Mentor account setup</h1>
                        </div>
                    </div>

                    {displayName ? (
                        <div className="mb-4 rounded-xl border border-cyan-100 bg-cyan-50 px-3.5 py-2.5 text-sm text-cyan-800">
                            Setting up mentor profile for {displayName}
                        </div>
                    ) : null}

                    <div className="flex gap-2 mb-5">
                        <div className="h-1.5 w-12 rounded-full bg-cyan-600" />
                        <div className="h-1.5 w-12 rounded-full bg-cyan-600" />
                    </div>

                    <form className="space-y-4" onSubmit={handleCreateMentor}>
                        <div>
                            <label className="text-xs font-semibold text-slate-500">Email Address</label>
                            <div className="mt-1.5 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="mail" size={15} />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500">Password</label>
                            <div className="mt-1.5 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="lock" size={15} />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500">Your Expertise</label>
                            <select
                                value={expertise}
                                onChange={(e) => setExpertise(e.target.value)}
                                className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500"
                            >
                                <option>System Design</option>
                                <option>Data Structures & Algorithms</option>
                                <option>Behavioral Interviews</option>
                                <option>Frontend (React/Vue)</option>
                                <option>Backend (Node/Go/Java)</option>
                                <option>ML/AI Engineering</option>
                            </select>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full justify-center mt-1">
                            {loading ? "Creating Account..." : "Create Mentor Account"}
                        </Button>

                        <div className="text-center text-sm text-slate-500 pt-1">
                            <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-600">
                                Back to role selection
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterMentor;