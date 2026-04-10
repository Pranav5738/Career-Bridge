import { useEffect, useMemo, useState } from "react";

const InterviewTimer = ({ running, initialSeconds = 900 }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (!running) {
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [running]);

    const formatted = useMemo(() => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
        const ss = String(seconds % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    }, [seconds]);

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[11px] text-slate-500">Session Timer</div>
            <div className="text-base font-black text-slate-900 mt-0.5">{formatted}</div>
        </div>
    );
};

export default InterviewTimer;
