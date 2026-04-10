import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        // Send the user to the app's role-based entry point to avoid redirect loops
        // (e.g., mentor trying to access student-only routes).
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;