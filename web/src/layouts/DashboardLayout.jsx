import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    LayoutDashboard,
    ListTodo,
    User,
    Sun,
    Moon,
    LogOut,
    Shield,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Jobs", href: "/dashboard/jobs", icon: ListTodo },
    { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center gap-3 px-6 border-b border-border/60 bg-muted/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        ApplyTrack
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}

                    {user?.isAdmin && (
                        <>
                            <div className="my-3 border-t border-border/50" />
                            <Link
                                to="/admin"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
                            >
                                <Shield className="h-5 w-5" />
                                Admin Panel
                            </Link>
                        </>
                    )}
                </nav>

                <div className="border-t border-border/50 p-5 space-y-3 bg-muted/10">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">{user?.username}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="flex-1"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="flex-1 text-destructive hover:text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden bg-background">
                <header className="flex h-16 items-center gap-4 border-b border-border/60 bg-card/50 backdrop-blur-md px-6 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Briefcase className="h-4 w-4" />
                    </div>
                    <span className="font-bold tracking-tight text-lg">ApplyTrack</span>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
