import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";
import { apiRequest } from "../utils/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const { addToast } = useToast();
    const token = searchParams.get("token") || "";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const tokenLabel = useMemo(() => {
        if (!token) return "No reset token detected";
        return "Reset link verified";
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!token) {
            addToast("Reset token is missing", "error");
            return;
        }

        if (!password || password.length < 8) {
            addToast("Password must be at least 8 characters", "warning");
            return;
        }

        if (password !== confirmPassword) {
            addToast("Passwords do not match", "warning");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest("/api/auth/reset-password", {
                method: "POST",
                body: { token, password },
                auth: false,
            });

            if (response?.user && response?.token) {
                login(response.user, response.token);
            }

            addToast("Password updated successfully", "success");
            navigate(response?.user?.role === "mentor" ? "/mentor-dashboard" : "/dashboard", { replace: true });
        } catch (error) {
            addToast(error.message || "Unable to reset password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-10 md:py-16">
            <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-[1.05fr_1fr] items-stretch">
                <Card className="p-8 md:p-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-white border-sky-100 shadow-xl shadow-sky-100/70 hidden lg:block">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 items-center justify-center mb-6 text-white">
                        <Icon name="lock" size={20} />
                    </div>
                    <p className="text-xs tracking-[0.24em] uppercase text-sky-700 font-semibold">Account Recovery</p>
                    <h1 className="text-3xl font-black text-slate-900 mt-3">Set a new password</h1>
                    <p className="text-slate-600 mt-3 max-w-md text-sm leading-6">
                        Create a new secure password to restore access to your Career Bridge account.
                    </p>

                    <div className="mt-8 space-y-3">
                        {[
                            "Use a strong password you have not used before",
                            "You will be signed in after the update",
                            "If the token expires, request a new reset link",
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
                            <Icon name="key" size={16} />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900">Reset password</div>
                            <p className="text-xs text-slate-500">{tokenLabel}</p>
                        </div>
                    </div>

                    <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">New Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="lock" size={16} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="lock" size={16} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                                />
                            </div>
                        </div>

                        <Button className="w-full justify-center" type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
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

export default ResetPassword;
