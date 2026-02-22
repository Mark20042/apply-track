import {
  Briefcase,
  Activity,
  Target,
  BarChart3,
  TrendingUp,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Gift,
  Ghost
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/10", count: 42 },
  interview: { label: "Interview", icon: MessageSquare, color: "text-blue-500", border: "border-blue-500/20", bg: "bg-blue-500/10", count: 18 },
  offer: { label: "Offer", icon: Gift, color: "text-purple-500", border: "border-purple-500/20", bg: "bg-purple-500/10", count: 4 },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/10", count: 2 },
  declined: { label: "Declined", icon: XCircle, color: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/10", count: 6 },
  ghosted: { label: "Ghosted", icon: Ghost, color: "text-slate-500", border: "border-slate-500/20", bg: "bg-slate-500/10", count: 12 },
};

/** High-fidelity replica of the real Dashboard for the landing page */
export default function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl h-[500px] sm:h-[600px] mt-8 mb-16 perspective-[2500px] flex items-center justify-center">

      {/* The single floating dashboard card in 3D perspective */}
      <div className="absolute z-20 w-[95%] sm:w-[100%] transform -rotate-[2deg] translate-y-4 transition-all duration-700 hover:rotate-0 hover:scale-[1.02] hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] shadow-primary/10 rounded-2xl group">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl ring-1 ring-border/50 flex flex-col h-[500px] sm:h-[600px] pointer-events-none">

          {/* Fake Browser Top Bar */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-4 py-3 shrink-0">
            <div className="flex gap-1.5 opacity-80">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="mx-auto flex h-6 px-4 items-center justify-center rounded-md bg-background/50 text-[10px] font-medium text-muted-foreground tracking-wide border border-border/50 shadow-inner">
              applytrack.com/dashboard
            </div>
          </div>

          {/* Dashboard Content matching user's real Dashboard */}
          <div className="flex-1 overflow-hidden p-6 sm:p-8 bg-background flex flex-col gap-6">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Overview
                </h1>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary" />
                  Here's what's happening with your job search.
                </p>
              </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-medium text-muted-foreground">Total Applications</p>
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">84</div>
                  <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">+12%</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-medium text-muted-foreground">Success Rate</p>
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">21%</div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Applications converting to interviews
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-medium text-muted-foreground">Total Offers</p>
                  <Gift className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">4</div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Current highly successful outcomes
                </p>
              </div>
            </div>

            {/* Pipeline Status Breakdown grid */}
            <div className="shrink-0">
              <h2 className="text-sm font-semibold tracking-tight text-foreground mb-3">Pipeline Status</h2>
              <div className="grid grid-cols-3 xl:grid-cols-6 gap-3">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={key} className="rounded-xl border border-border bg-card p-3 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-1.5 rounded-md ${config.bg}`}>
                          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                        </div>
                        <span className="text-lg font-bold text-foreground">{config.count}</span>
                      </div>
                      <p className="text-[10px] font-medium text-muted-foreground">
                        {config.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Charts Area Mockup */}
            <div className="grid grid-cols-3 gap-4 min-h-0 flex-1">
              <div className="col-span-2 rounded-xl border border-border bg-card shadow-sm flex flex-col">
                <div className="flex items-center gap-2 border-b border-border/40 py-3 px-4 shrink-0">
                  <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="text-xs font-semibold">Distribution by Status</h3>
                </div>
                <div className="p-4 flex-1 flex items-end gap-2 relative">
                  {/* CSS only BarChart mock */}
                  {["h-[30%]", "h-[70%]", "h-[20%]", "h-[10%]", "h-[50%]", "h-[40%]"].map((h, i) => (
                    <div key={i} className={`flex-1 ${h} rounded-t-sm bg-gradient-to-t from-primary/10 to-primary/80 opacity-80 shadow-sm border border-primary/20`} />
                  ))}
                  <div className="absolute bottom-4 left-4 right-4 border-b border-border/50" />
                </div>
              </div>

              <div className="col-span-1 rounded-xl border border-border bg-card shadow-sm flex flex-col">
                <div className="flex items-center justify-between border-b border-border/40 py-3 px-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <h3 className="text-xs font-semibold">Activity</h3>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-end">
                  {/* CSS only AreaChart mock */}
                  <div className="w-full h-full relative overflow-hidden rounded-b-lg">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/20 to-transparent" />
                    <div className="absolute bottom-1/2 left-0 w-full border-t-2 border-emerald-500/50 transform -rotate-6" />
                    <div className="absolute bottom-1/3 left-1/2 w-1/2 border-t-2 border-emerald-500/50 transform rotate-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background floating blur to give depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/20 blur-[100px] rounded-full z-0 opacity-50" />
    </div>
  );
}
