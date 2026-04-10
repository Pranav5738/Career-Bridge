const Skeleton = ({ className = "", lines = 1 }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                className="h-4 bg-gray-800 rounded-lg animate-pulse"
                style={{
                    width: i === lines - 1 && lines > 1 ? "60%" : "100%",
                }}
            />
        ))}
    </div>
);

export default Skeleton;
