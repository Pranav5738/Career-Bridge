import Button from "../../../devconnect/ui/Button";
import Icon from "../../../devconnect/ui/Icon";

const WebinarHeader = ({ isMentor, onHostWebinar }) => {
    return (
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
                <h1 className="text-2xl font-black text-white">Webinars</h1>
                <p className="text-gray-400 text-sm mt-1">
                    {isMentor
                        ? "Host and manage your live sessions"
                        : "Live sessions with engineers and hiring managers."}
                </p>
            </div>

            {isMentor ? (
                <Button onClick={onHostWebinar}>
                    + Host Webinar <Icon name="arrowRight" size={16} />
                </Button>
            ) : null}
        </div>
    );
};

export default WebinarHeader;
