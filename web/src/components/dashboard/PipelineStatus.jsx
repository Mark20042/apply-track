import { Card, CardContent } from "@/components/ui/card";
import { STATUS_CONFIG } from "@/lib/constants";

export default function PipelineStatus({ stats }) {
    return (
        <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground mb-3 sm:mb-4">Pipeline Status</h2>
            <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    const count = stats?.[key] || 0;
                    return (
                        <Card key={key} className="shadow-sm border-border hover:shadow-md transition-all duration-200">
                            <CardContent className="p-2.5 sm:p-4 flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between mb-2 sm:mb-4">
                                    <div className={`p-1.5 sm:p-2 rounded-lg ${config.bg}`}>
                                        <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.color}`} />
                                    </div>
                                    <span className={`text-lg sm:text-2xl font-bold ${count > 0 ? "text-foreground" : "text-muted-foreground/50"}`}>{count}</span>
                                </div>
                                <p className="text-[11px] sm:text-sm font-medium text-muted-foreground">
                                    {config.label}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
