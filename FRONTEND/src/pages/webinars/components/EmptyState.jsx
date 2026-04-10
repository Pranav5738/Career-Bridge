import Button from "../../../devconnect/ui/Button";
import Card from "../../../devconnect/ui/Card";
import Icon from "../../../devconnect/ui/Icon";

const EmptyState = ({ isMentor, onHostWebinar }) => {
    return (
        <Card className="p-8 text-center bg-white/70 backdrop-blur-md border-white/60 shadow-lg shadow-slate-200/70">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Icon name="video" size={22} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
                {isMentor
                    ? "You haven’t created any webinars yet."
                    : "No webinars scheduled yet."}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
                {isMentor
                    ? "Start your first session and engage with students."
                    : "Check back soon for upcoming learning sessions."}
            </p>

            {isMentor ? (
                <div className="mt-5 flex justify-center">
                    <Button onClick={onHostWebinar}>Host Webinar</Button>
                </div>
            ) : null}
        </Card>
    );
};

export default EmptyState;
