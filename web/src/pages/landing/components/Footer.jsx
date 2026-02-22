import { Heart, Briefcase } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:gap-1 tracking-tight">
                <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
                    <Briefcase className="h-4 w-4" />
                    © {new Date().getFullYear()} ApplyTrack
                </span>
                <span className="hidden sm:inline text-border font-bold">·</span>
                <span className="inline-flex items-center gap-1">
                    Built with <Heart className="h-3.5 w-3.5 fill-current text-red-500/80" /> for job seekers by <strong className="text-foreground">Azoredev</strong>
                </span>
            </div>
        </footer>
    );
}
