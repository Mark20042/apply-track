import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Briefcase,
    Sun,
    Moon,
    User,
    LogOut,
    LayoutDashboard,
    Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
                        <Briefcase className="h-5 w-5 text-foreground" />
                        <span className="text-foreground">
                            ApplyTrack
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                            {user.username?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <span className="hidden sm:inline">{user.username}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate("/dashboard/profile")}
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </DropdownMenuItem>
                                    {user.isAdmin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => navigate("/admin")}>
                                                <Shield className="mr-2 h-4 w-4" />
                                                Admin Panel
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/login">Log in</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link to="/register">Sign up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
