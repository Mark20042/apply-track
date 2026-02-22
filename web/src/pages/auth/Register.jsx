import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Mail, Lock, User, Loader2, GraduationCap, ArrowLeft, UserPlus, Target } from "lucide-react";
import { toast } from "sonner";

const ROLE_OPTIONS = ["Job Hunter", "Student", "Career Changer", "Professional", "Other"];
const GENDER_OPTIONS = [
    { value: "__optional__", label: "Optional" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Prefer not to say", label: "Prefer not to say" },
    { value: "Other", label: "Other" },
];

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Job Hunter");
    const [gender, setGender] = useState("__optional__");
    const [education, setEducation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(username, email, password, {
                role: role || undefined,
                gender: gender && gender !== "__optional__" ? gender : undefined,
                education: education.trim() || undefined,
            });
            toast.success("Account created! Welcome aboard.");
            navigate("/dashboard");
        } catch (err) {
            toast.error(
                err.response?.data?.msg || "Registration failed. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left/Top side: Visual/Brand Context */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 text-zinc-50 relative overflow-hidden">
                {/* Abstract Background pattern/gradient */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-[10%] right-[10%] h-[60%] w-[60%] rounded-full bg-primary/40 blur-[120px]" />
                    <div className="absolute bottom-[0%] left-[-10%] h-[50%] w-[50%] rounded-full bg-purple-500/30 blur-[100px]" />
                </div>

                <div className="relative z-10 flex items-center gap-3 font-bold text-2xl tracking-tight">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <Target className="h-6 w-6" />
                    </div>
                    ApplyTrack
                </div>

                <div className="relative z-10 max-w-lg mt-auto mb-16">
                    <h2 className="text-4xl font-bold tracking-tight mb-4 leading-[1.15]">
                        Start building your <br />career pipeline.
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Join thousands of job seekers who stay organized, motivated, and ahead of the competition.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-sm font-medium">
                    <div className="flex -space-x-3">
                        {/* Fake avatars for social proof */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-9 w-9 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                                <User className="h-4 w-4" />
                            </div>
                        ))}
                    </div>
                    <span className="text-zinc-400">Trusted by modern professionals</span>
                </div>
            </div>

            {/* Right side: Form Container */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative overflow-y-auto max-h-screen">

                <Link
                    to="/"
                    className="absolute top-8 left-8 hidden lg:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-x-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
                <Link
                    to="/"
                    className="lg:hidden mb-8 self-start inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="w-full max-w-sm space-y-6 my-auto pt-8 pb-12">
                    <div className="text-center sm:text-left">
                        <div className="lg:hidden mb-6 flex justify-center sm:justify-start">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                                <Target className="h-7 w-7" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Create an account
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter your details below to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="username"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-11 pl-10 bg-muted/50 focus:bg-background transition-colors"
                                    required
                                    minLength={3}
                                    maxLength={20}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 pl-10 bg-muted/50 focus:bg-background transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 pl-10 bg-muted/50 focus:bg-background transition-colors"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="h-11 bg-muted/50 focus:bg-background transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLE_OPTIONS.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {r}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Gender <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger className="h-11 bg-muted/50 focus:bg-background transition-colors">
                                        <SelectValue placeholder="Optional" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GENDER_OPTIONS.map((g) => (
                                            <SelectItem key={g.value} value={g.value}>
                                                {g.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="education">Education <span className="text-muted-foreground font-normal">(optional)</span></Label>
                            <div className="relative group">
                                <GraduationCap className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="education"
                                    placeholder="e.g. B.S. Computer Science"
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                    className="h-11 pl-10 bg-muted/50 focus:bg-background transition-colors"
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="h-11 mt-6 w-full gap-2 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UserPlus className="h-4 w-4" />
                            )}
                            Create account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground pt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
