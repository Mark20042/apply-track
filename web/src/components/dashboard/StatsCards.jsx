import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Activity, Gift } from "lucide-react";

export default function StatsCards({ totalJobs, stats }) {
    return (
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
    );
}
