import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ArrowLeft, LogIn, Target } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(
                err.response?.data?.msg || "Invalid credentials. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left/Top side: Visual/Brand Context (hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 text-zinc-50 relative overflow-hidden">
                {/* Abstract Background pattern/gradient */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute -top-[20%] -left-[10%] h-[70%] w-[70%] rounded-full bg-primary/40 blur-[120px]" />
                    <div className="absolute top-[60%] right-[0%] h-[50%] w-[50%] rounded-full bg-blue-500/30 blur-[100px]" />
                </div>

                <div className="relative z-10 flex items-center gap-3 font-bold text-2xl tracking-tight">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <Target className="h-6 w-6" />
                    </div>
                    ApplyTrack
                </div>

                <div className="relative z-10 max-w-lg mt-auto mb-16">
                    <h2 className="text-4xl font-bold tracking-tight mb-4 leading-[1.15]">
                        Your career journey,<br /> perfectly organized.
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Keep track of every application, interview, and offer in one unified workspace designed for serious job seekers.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-zinc-500 font-medium">
                    &copy; {new Date().getFullYear()} ApplyTrack. All rights reserved.
                </div>
            </div>

            {/* Right side: Form Container */}
            <div className="flex w-full lg:w-1/2 flex-col items-center lg:justify-center px-4 py-6 sm:px-6 lg:px-8 relative">
                <Link
                    to="/"
                    className="absolute top-8 left-8 hidden lg:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-x-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
                <Link
                    to="/"
                    className="lg:hidden mb-6 self-start inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center sm:text-left">
                        <div className="lg:hidden mb-6 flex justify-center sm:justify-start">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                                <Target className="h-7 w-7" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to your account to continue your job search
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 pl-11 bg-muted/50 focus:bg-background transition-colors text-base"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Link to="#" className="text-xs font-medium text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 pl-11 bg-muted/50 focus:bg-background transition-colors text-base"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="h-12 w-full gap-2 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 mt-2" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <LogIn className="h-5 w-5" />
                            )}
                            Sign in
                        </Button>
                    </form>

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
