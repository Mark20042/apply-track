import { useState, useEffect, useCallback } from "react";
import { adminAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Briefcase,
    Shield,
    Clock,
    MessageSquare,
    XCircle,
    CheckCircle2,
    Ghost,
    Gift,
    Search,
    Trash2,
    Eye,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userJobs, setUserJobs] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await adminAPI.getPlatformStats();
            setStats(data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await adminAPI.getAllUsers({ search, limit: 50 });
            setUsers(data.users);
            setTotalUsers(data.totalUsers);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        const t = setTimeout(() => fetchUsers(), 300);
        return () => clearTimeout(t);
    }, [fetchUsers]);

    const handleViewUser = async (id) => {
        try {
            const { data } = await adminAPI.getSingleUser(id);
            setSelectedUser(data.user);
            setUserJobs(data.jobs);
            setDetailOpen(true);
        } catch {
            toast.error("Failed to load user details");
        }
    };

    const handleDeleteUser = async (id, username) => {
        if (!confirm(`Delete user "${username}" and all their jobs?`)) return;
        try {
            await adminAPI.deleteUser(id);
            toast.success(`User "${username}" deleted`);
            fetchUsers();
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to delete user");
        }
    };

    const statCards = stats
        ? [
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#3b82f6" },
            { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase, color: "#8b5cf6" },
            { label: "Admins", value: stats.totalAdmins, icon: Shield, color: "#10b981" },
        ]
        : [];

    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Admin Overview</h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Platform-wide statistics</p>
            </div>

            {/* Stats */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                {statCards.map((s) => (
                    <Card key={s.label} className="glass-card border-0">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${s.color}20` }}
                            >
                                <s.icon className="h-6 w-6" style={{ color: s.color }} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="text-2xl font-bold">{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Job status breakdown */}
            {stats?.jobStats && (
                <div className="grid gap-2 sm:gap-3 grid-cols-3 lg:grid-cols-6">
                    {[
                        { k: "pending", icon: Clock, color: "#f59e0b" },
                        { k: "interview", icon: MessageSquare, color: "#3b82f6" },
                        { k: "offer", icon: Gift, color: "#8b5cf6" },
                        { k: "accepted", icon: CheckCircle2, color: "#10b981" },
                        { k: "declined", icon: XCircle, color: "#ef4444" },
                        { k: "ghosted", icon: Ghost, color: "#6b7280" },
                    ].map((item) => (
                        <div
                            key={item.k}
                            className="glass-card rounded-xl p-4 text-center"
                        >
                            <item.icon
                                className="mx-auto h-5 w-5"
                                style={{ color: item.color }}
                            />
                            <p className="mt-1 text-lg font-bold">
                                {stats.jobStats[item.k] || 0}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {item.k}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Users table */}
            <Card className="glass-card border-0">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <CardTitle className="text-base sm:text-lg">
                        Users ({totalUsers})
                    </CardTitle>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 text-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {users.map((u) => (
                                <div
                                    key={u._id}
                                    className="flex items-center gap-3 sm:gap-4 rounded-xl p-3 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                        {u.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-sm sm:text-base">
                                            {u.username}
                                            {u.isAdmin && (
                                                <Badge variant="outline" className="ml-2 text-[10px] sm:text-xs">
                                                    Admin
                                                </Badge>
                                            )}
                                        </p>
                                        <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                                            {u.email}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="hidden sm:inline-flex">{u.jobCount} jobs</Badge>
                                    <span className="text-[11px] font-medium text-muted-foreground sm:hidden">{u.jobCount}</span>
                                    <div className="flex gap-0.5 sm:gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleViewUser(u._id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {!u.isAdmin && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteUser(u._id, u.username)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User detail dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                    {selectedUser.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold">{selectedUser.username}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Role:</span>{" "}
                                    {selectedUser.role}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Gender:</span>{" "}
                                    {selectedUser.gender || "—"}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Education:</span>{" "}
                                    {selectedUser.education || "—"}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Joined:</span>{" "}
                                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">
                                    Jobs ({userJobs.length})
                                </h4>
                                {userJobs.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No jobs found
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {userJobs.map((j) => (
                                            <div
                                                key={j._id}
                                                className="flex items-center justify-between rounded-lg bg-accent/50 p-3 text-sm"
                                            >
                                                <div>
                                                    <p className="font-medium">{j.position}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {j.company}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="capitalize">
                                                    {j.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
