import Card from "../../../devconnect/ui/Card";
import Icon from "../../../devconnect/ui/Icon";

const ActivityFeed = ({ items = [] }) => {
    return (
        <Card className="p-5 bg-white/70 border-white/60 backdrop-blur-md shadow-lg shadow-slate-200/70">
            <div className="font-bold text-slate-900">Activity Feed</div>
            <div className="mt-4 space-y-3">
                {items.length ? (
                    items.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                            <div className="flex items-start gap-2">
                                <Icon name={item.icon || "bell"} size={14} className="text-violet-500 mt-0.5" />
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                                    <div className="text-xs text-slate-500 mt-1">{item.time}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-slate-500">No recent activity</div>
                )}
            </div>
        </Card>
    );
};

export default ActivityFeed;
