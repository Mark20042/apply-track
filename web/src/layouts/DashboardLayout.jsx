import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    LayoutDashboard,
    ListTodo,
    CheckSquare,
    User,
    Sun,
    Moon,
    LogOut,
    Shield,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Jobs", href: "/dashboard/jobs", icon: ListTodo },
    { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Retrieve state from local storage or default to false
        const saved = localStorage.getItem("sidebar_collapsed");
        return saved === "true";
    });

    // Save state changes 
    useEffect(() => {
        localStorage.setItem("sidebar_collapsed", isCollapsed.toString());
    }, [isCollapsed]);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 lg:static lg:translate-x-0 
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    ${isCollapsed ? "lg:w-20 w-72" : "w-72"}
                `}
            >
                <div className={`flex h-16 items-center border-b border-border/60 bg-muted/20 relative ${isCollapsed ? 'justify-center' : 'px-6 gap-3'}`}>
                    <div className="flex h-8 w-8 items-center justify-center shrink-0 rounded-lg bg-primary text-primary-foreground shadow-sm">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-lg font-bold tracking-tight text-foreground transition-opacity">
                            ApplyTrack
                        </span>
                    )}

                    {/* Mobile Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`ml-auto lg:hidden ${isCollapsed && 'absolute right-2'}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    {/* Desktop Collapse Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        className={`hidden lg:flex absolute -right-3.5 h-7 w-7 rounded-full bg-background border-border shadow-sm z-50 hover:bg-muted/80`}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>

                <nav className={`flex-1 space-y-1 p-4 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'items-center' : ''}`}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                title={isCollapsed ? item.label : undefined}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center rounded-lg py-3 text-sm font-medium transition-all duration-200 group
                                    ${isCollapsed ? 'justify-center px-0 mb-2' : 'gap-3 px-4'}
                                    ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}

                    {user?.isAdmin && (
                        <>
                            <div className="my-3 border-t border-border/50 w-full" />
                            <Link
                                to="/admin"
                                title={isCollapsed ? "Admin Panel" : undefined}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center rounded-lg py-3 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-foreground
                                    ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}
                                `}
                            >
                                <Shield className="h-5 w-5 shrink-0 text-amber-500" />
                                {!isCollapsed && <span>Admin Panel</span>}
                            </Link>
                        </>
                    )}
                </nav>

                <div className={`border-t border-border/50 p-4 space-y-3 bg-muted/10 transition-all ${isCollapsed ? 'px-2' : ''}`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2 py-2'}`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-foreground">{user?.username}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className={`flex ${isCollapsed ? 'flex-col gap-2 w-full items-center' : 'gap-2'}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            title={isCollapsed ? "Toggle Theme" : undefined}
                            className={isCollapsed ? "w-10 h-10" : "flex-1"}
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
                            title={isCollapsed ? "Logout" : undefined}
                            className={`text-destructive hover:text-destructive ${isCollapsed ? "w-10 h-10" : "flex-1"}`}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
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
