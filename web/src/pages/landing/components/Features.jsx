import {
    Briefcase,
    BarChart3,
    Shield,
    Zap,
    TrendingUp,
    Users,
} from "lucide-react";

const features = [
    {
        icon: Briefcase,
        title: "Track Applications",
        desc: "Organize every job application with status, type, salary, and notes in one place.",
    },
    {
        icon: BarChart3,
        title: "Visual Analytics",
        desc: "Beautiful charts and stats to understand your job search progress at a glance.",
    },
    {
        icon: TrendingUp,
        title: "Status Pipeline",
        desc: "Follow applications from pending → interview → offer → accepted with real-time tracking.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        desc: "Your data is encrypted and protected. Only you can access your applications.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        desc: "Built with modern tech for instant search, filters, and seamless navigation.",
    },
    {
        icon: Users,
        title: "Admin Dashboard",
        desc: "Platform administrators can monitor user activity and manage the platform.",
    },
];

export default function Features() {
    return (
        <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Everything you need to succeed
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                    Features to streamline your job search.
                </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-border hover:bg-muted/20"
                    >
                        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/50 transition-colors group-hover:bg-muted">
                            <feature.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
