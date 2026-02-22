import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BarChart2, Layers, Zap } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

const stats = [
  { value: "10K+", label: "Applications Tracked", icon: Layers },
  { value: "95%", label: "User Satisfaction", icon: Sparkles },
  { value: "50+", label: "Status Categories", icon: BarChart2 },
  { value: "24/7", label: "Always Available", icon: Zap },
];

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:pt-12 pb-16 sm:pb-24 sm:px-6 lg:px-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left: Headline + CTA */}
        <div className="flex-1 text-center lg:text-left z-10 relative">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Land your dream job{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              faster
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg text-muted-foreground lg:mx-0 mx-auto">
            Stop losing track of your applications. Organize, monitor, and
            optimize your job search in a beautiful, Excel-like dashboard that
            keeps you in absolute control.
          </p>

          <div className="mt-6 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row lg:justify-start">
            <Button
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 gap-2 text-sm sm:text-md rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105 w-full sm:w-auto"
              asChild
            >
              <Link to="/register">
                Get started free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-md rounded-full border-border/60 hover:bg-muted/50 transition-all hover:scale-105 backdrop-blur-sm w-full sm:w-auto"
              asChild
            >
              <Link to="/login">Log in to dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl mt-12 lg:mt-0 flex justify-center lg:justify-end">
          <DashboardPreview />
        </div>
      </div>

      <div className="mx-auto mt-12 sm:mt-24 grid max-w-5xl grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="group flex flex-col items-center gap-2 sm:gap-3 rounded-2xl p-3 sm:p-6 text-center transition-all hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/5 backdrop-blur-sm"
          >
            <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center text-primary transition-transform group-hover:scale-110">
              <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-foreground">{value}</p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm font-medium text-muted-foreground">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
