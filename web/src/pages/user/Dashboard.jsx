import { useState, useEffect, useCallback } from "react";
import { jobsAPI } from "@/lib/api";
import { STATUS_CONFIG } from "@/lib/constants";
import { Briefcase, Target } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import PipelineStatus from "@/components/dashboard/PipelineStatus";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

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

    if (totalJobs === 0) {
        return (
            <div className="max-w-7xl mx-auto pb-10 space-y-6 sm:space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 sm:mt-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Dashboard
                        </h1>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
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
        <div className="max-w-7xl mx-auto pb-10 space-y-6 sm:space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 sm:mt-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Overview</h1>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Here's what's happening with your job search.
                    </p>
                </div>
            </div>

            <StatsCards totalJobs={totalJobs} stats={stats} />
            <PipelineStatus stats={stats} />
            <DashboardCharts barData={barData} pieData={pieData} activityData={activityData} />
        </div>
    );
}
