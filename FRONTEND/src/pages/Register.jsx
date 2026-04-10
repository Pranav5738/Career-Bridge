import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../devconnect/ui/Button";
import Card from "../devconnect/ui/Card";
import Icon from "../devconnect/ui/Icon";

const Register = () => {
    const [role, setRole] = useState("student");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();

    const goToStepTwo = () => {
        navigate(role === "mentor" ? "/register/mentor" : "/register/student", {
            state: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-10 md:py-16">
            <div className="mx-auto max-w-lg">
                <Card className="p-7 md:p-8 border-slate-200 shadow-xl shadow-slate-200/60">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-600 items-center justify-center text-white">
                            <Icon name="user" size={16} />
                        </div>
                        <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">Career Bridge</p>
                            <h1 className="text-xl font-black text-slate-900">Create your account</h1>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 mb-5">
                        Choose how you want to join and continue to account setup.
                    </p>

                    <div className="flex gap-2 mb-5">
                        <div className="h-1.5 w-12 rounded-full bg-sky-600" />
                        <div className="h-1.5 w-12 rounded-full bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole("student")}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                role === "student"
                                    ? "border-sky-500 bg-sky-50 shadow-sm shadow-sky-100"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            <div className="inline-flex w-10 h-10 rounded-lg bg-sky-100 items-center justify-center text-sky-700 mb-3">
                                <Icon name="book" size={16} />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900">Student</h3>
                            <p className="text-xs text-slate-500 mt-1">Learn, practice, and land roles.</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole("mentor")}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                role === "mentor"
                                    ? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            <div className="inline-flex w-10 h-10 rounded-lg bg-cyan-100 items-center justify-center text-cyan-700 mb-3">
                                <Icon name="award" size={16} />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900">Mentor</h3>
                            <p className="text-xs text-slate-500 mt-1">Teach, coach, and grow impact.</p>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div>
                            <label className="text-xs font-semibold text-slate-500">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Jordan"
                                className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Kim"
                                className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                            />
                        </div>
                    </div>

                    <Button className="w-full justify-center" onClick={goToStepTwo}>
                        Continue <Icon name="arrowRight" size={16} />
                    </Button>

                    <p className="text-center text-sm text-slate-500 mt-5">
                        Already have an account?{" "}
                        <Link to="/login" className="text-sky-700 hover:text-sky-600 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Register;