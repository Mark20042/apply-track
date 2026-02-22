import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
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

const TOOLTIP_STYLE = {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    color: "var(--foreground)",
};
const TOOLTIP_ITEM_STYLE = { color: "var(--foreground)", fontWeight: "600" };

export default function DashboardCharts({ barData, pieData, activityData }) {
    return (
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
                                    contentStyle={TOOLTIP_STYLE}
                                    itemStyle={TOOLTIP_ITEM_STYLE}
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
                {/* Area Chart for Activity */}
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
                                    <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} />
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
                                        contentStyle={TOOLTIP_STYLE}
                                        itemStyle={TOOLTIP_ITEM_STYLE}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
