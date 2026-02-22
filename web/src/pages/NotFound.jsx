import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
            </div>

            <div className="relative glass-card rounded-3xl p-10 max-w-lg w-full">
                {/* Placeholder — swap with your own GIF */}
                <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center rounded-2xl bg-primary/10 text-6xl">
                    🛸
                </div>

                <h1 className="text-7xl font-extrabold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="mt-3 text-2xl font-bold">Page Not Found</h2>
                <p className="mt-2 text-muted-foreground">
                    Oops! Looks like you've drifted into uncharted territory. Let's get
                    you back on track.
                </p>

                <div className="mt-8 flex justify-center gap-3">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                    <Button asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
