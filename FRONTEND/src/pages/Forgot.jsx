import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../utils/api";

const Forgot = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim()) {
            addToast("Enter your email address", "warning");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest("/api/auth/forgot-password", {
                method: "POST",
                body: { email: email.trim() },
                auth: false,
            });

            addToast(response.message || "Reset link sent", "success");
        } catch (error) {
            addToast(error.message || "Unable to send reset link", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-10 md:py-16">
            <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-[1.05fr_1fr] items-stretch">
                <Card className="p-8 md:p-10 bg-gradient-to-br from-cyan-50 via-sky-50 to-white border-cyan-100 shadow-xl shadow-cyan-100/60 hidden lg:block">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-600 items-center justify-center mb-6 text-white">
                        <Icon name="lock" size={20} />
                    </div>
                    <p className="text-xs tracking-[0.24em] uppercase text-cyan-700 font-semibold">Security</p>
                    <h1 className="text-3xl font-black text-slate-900 mt-3">Reset your password</h1>
                    <p className="text-slate-600 mt-3 max-w-md text-sm leading-6">
                        Enter your account email and we will help you recover access securely.
                    </p>

                    <div className="mt-8 space-y-3">
                        {[
                            "Request a recovery link for your account",
                            "Use a strong new password after verification",
                            "Get back to your dashboard quickly",
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-3 rounded-xl border border-cyan-100 bg-white/80 px-3.5 py-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                                    <Icon name="check" size={14} />
                                </span>
                                <span className="text-sm text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-7 md:p-8 border-slate-200 shadow-xl shadow-slate-200/60">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-600 items-center justify-center text-white">
                            <Icon name="mail" size={16} />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900">Forgot password</div>
                            <p className="text-xs text-slate-500">We will send you a reset link</p>
                        </div>
                    </div>

                    <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <Button className="w-full justify-center" type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full text-center text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Icon name="chevronLeft" size={14} /> Back to sign in
                        </button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Forgot;
