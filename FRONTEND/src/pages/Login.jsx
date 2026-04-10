import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { apiRequest } from "../utils/api";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (event) => {
        event?.preventDefault();

        if (!form.email || !form.password) {
            addToast("Enter your email and password", "warning");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest("/api/auth/login", {
                method: "POST",
                body: form,
                auth: false,
            });

            login(response.user, response.token);

            const nextPath = response.user?.role === "mentor" ? "/mentor-dashboard" : "/dashboard";
            navigate(nextPath, { replace: true });
            addToast("Signed in successfully", "success");
        } catch (error) {
            addToast(error.message || "Unable to sign in", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-10 md:py-16">
            <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-[1.05fr_1fr] items-stretch">
                <Card className="p-8 md:p-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-white border-sky-100 shadow-xl shadow-sky-100/70 hidden lg:block">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 items-center justify-center mb-6 text-white">
                        <Icon name="zap" size={20} />
                    </div>
                    <p className="text-xs tracking-[0.24em] uppercase text-sky-700 font-semibold">Career Bridge</p>
                    <h1 className="text-3xl font-black text-slate-900 mt-3">Welcome back</h1>
                    <p className="text-slate-600 mt-3 max-w-md text-sm leading-6">
                        Continue your learning journey with personalized interview prep, skill plans, and mentor support.
                    </p>

                    <div className="mt-8 space-y-3">
                        {[
                            "Track readiness with real progress insights",
                            "Access mentor sessions and webinars",
                            "Get AI-guided resume and interview practice",
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-3 rounded-xl border border-sky-100 bg-white/75 px-3.5 py-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                                    <Icon name="check" size={14} />
                                </span>
                                <span className="text-sm text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-7 md:p-8 border-slate-200 shadow-xl shadow-slate-200/60">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-600 items-center justify-center text-white">
                            <Icon name="lock" size={16} />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900">Sign In</div>
                            <p className="text-xs text-slate-500">Access your Career Bridge workspace</p>
                        </div>
                    </div>

                    <form className="space-y-4 mt-6" onSubmit={handleSignIn}>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="mail" size={16} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, email: e.target.value }))
                                    }
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="lock" size={16} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            password: e.target.value,
                                        }))
                                    }
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-300" /> Remember me
                            </label>
                            <button
                                type="button"
                                onClick={() => navigate("/forgot")}
                                className="text-sky-700 hover:text-sky-600 transition-colors font-semibold"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            className="w-full justify-center mt-1"
                            size="md"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>

                        <p className="text-center text-sm text-slate-500 pt-1">
                            Do not have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="text-sky-700 hover:text-sky-600 font-semibold"
                            >
                                Create one
                            </button>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
