import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Rocket } from "lucide-react";

export default function Landing() {
    return (
        <div className="relative min-h-screen bg-background">
            <Navbar />
            <Hero />
            <Features />

            {/* CTA */}
            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-border bg-card p-10 text-center sm:p-14">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/50">
                        <Rocket className="h-7 w-7 text-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Ready to take control of your job search?
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
                        Track applications, follow status, and stay organized—free.
                    </p>
                    <div className="mt-6 flex flex-col items-center gap-4">
                        <Button size="default" className="h-11 gap-2 px-6" asChild>
                            <Link to="/register">
                                Create account
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                No credit card
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                Free forever
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                Instant setup
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
