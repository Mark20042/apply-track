import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function LoadingSpinner() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
}

/**
 * Protects routes — only authenticated users can access.
 * Optionally restrict to admin-only with `adminOnly` prop.
 */
export function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" replace />;

    return children;
}

/**
 * Guest-only routes — redirects authenticated users away (e.g. login/register).
 */
export function GuestRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (user) return <Navigate to="/dashboard" replace />;

    return children;
}
