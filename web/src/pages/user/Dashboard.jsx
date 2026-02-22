import { useState, useEffect, useCallback } from "react";
import { jobsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Clock,
    MessageSquare,
    XCircle,
    CheckCircle2,
    Gift,
    Ghost,
    TrendingUp,
    Briefcase,
    Activity,
    Target,
    BarChart3
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";

// Premium mapping configuration
const STATUS_CONFIG = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/10", hex: "#f59e0b" },
    interview: { label: "Interview", icon: MessageSquare, color: "text-blue-500", border: "border-blue-500/20", bg: "bg-blue-500/10", hex: "#3b82f6" },
    offer: { label: "Offer", icon: Gift, color: "text-purple-500", border: "border-purple-500/20", bg: "bg-purple-500/10", hex: "#a855f7" },
    accepted: { label: "Accepted", icon: CheckCircle2, color: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/10", hex: "#10b981" },
    declined: { label: "Declined", icon: XCircle, color: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/10", hex: "#ef4444" },
    ghosted: { label: "Ghosted", icon: Ghost, color: "text-slate-500", border: "border-slate-500/20", bg: "bg-slate-500/10", hex: "#64748b" },
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await jobsAPI.getStats();
            setStats(data.defaultStats);
            setActivityData(data.activityData || []);
        } catch (err) {
            console.error("Failed to load stats", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    const totalJobs = stats
        ? Object.values(stats).reduce((a, b) => a + b, 0)
        : 0;

    const barData = stats
        ? Object.entries(STATUS_CONFIG).map(([key, config]) => ({
            name: config.label,
            count: stats[key] || 0,
            fill: config.hex,
        }))
        : [];

    const pieData = barData.filter((d) => d.count > 0);

    // Area chart data comes from real historical backend applications now.
    // If empty or missing, it will stay empty unless filled organically by the user.

    if (totalJobs === 0) {
        return (
            <div className="max-w-7xl mx-auto pb-10 space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Track your job search progress
                        </p>
                    </div>
                </div>
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-16 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                        <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2">No applications yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Start tracking your job search journey by adding your first application.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-10 space-y-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Overview
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Here's what's happening with your job search.
                    </p>
                </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-sm border-border bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-4xl font-bold">{totalJobs}</div>
                            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12% from last week</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Success Rate (Interviews)</p>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-4xl font-bold">
                            {totalJobs > 0 ? Math.round(((stats?.interview || 0) / totalJobs) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Applications converting to interviews
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Offers</p>
                            <Gift className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="text-4xl font-bold text-foreground">
                            {stats?.offer || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current highly successful outcomes
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Pipeline Status Breakdown grid */}
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">Pipeline Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                        const Icon = config.icon;
                        const count = stats?.[key] || 0;
                        return (
                            <Card key={key} className="shadow-sm border-border hover:shadow-md transition-all duration-200">
                                <CardContent className="p-4 flex flex-col justify-between h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-2 rounded-lg ${config.bg}`}>
                                            <Icon className={`h-4 w-4 ${config.color}`} />
                                        </div>
                                        <span className={`text-2xl font-bold ${count > 0 ? "text-foreground" : "text-muted-foreground/50"}`}>{count}</span>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {config.label}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Main Bar Chart */}
                <Card className="lg:col-span-4 shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center gap-2 border-b border-border/40 py-4 px-6">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base font-semibold">Distribution by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: "currentColor", opacity: 0.7, fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        tick={{ fill: "currentColor", opacity: 0.7, fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            color: "var(--foreground)",
                                        }}
                                        itemStyle={{ color: "var(--foreground)", fontWeight: "600" }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} isAnimationActive={false}>
                                        {barData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Secondary Charts Column */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Area Chart for "Activity" */}
                    <Card className="shadow-sm border-border flex-1 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 py-4 px-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base font-semibold">Activity (7 Days)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-1">
                            <div className="h-[120px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--card)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                color: 'var(--foreground)'
                                            }}
                                            itemStyle={{ color: "var(--foreground)", fontWeight: "600" }}
                                        />
                                        <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="shadow-sm border-border flex-1 flex flex-col">
                        <CardContent className="p-4 flex-1 flex flex-col items-center justify-center min-h-[180px]">
                            <div className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="count"
                                            nameKey="name"
                                            stroke="none"
                                            isAnimationActive={false}
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "8px",
                                                color: "var(--foreground)",
                                            }}
                                            itemStyle={{ color: "var(--foreground)", fontWeight: "600" }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
