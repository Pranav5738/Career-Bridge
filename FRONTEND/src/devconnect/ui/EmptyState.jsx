import Button from "./Button";
import Card from "./Card";
import Icon from "./Icon";

const EmptyState = ({
    title,
    message,
    icon = "file",
    ctaLabel,
    onCta,
}) => {
    return (
        <Card className="p-8 text-center bg-white/70 border-white/60 backdrop-blur-md shadow-lg shadow-slate-200/70">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
                <Icon name={icon} size={22} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            {ctaLabel ? (
                <div className="mt-5 flex justify-center">
                    <Button onClick={onCta}>{ctaLabel}</Button>
                </div>
            ) : null}
        </Card>
    );
};

export default EmptyState;
