import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { userAPI, jobsAPI } from "@/lib/api";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, User, Trophy, Briefcase, CalendarCheck, Settings, Mail, MapPin, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
    const { user, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        gender: user?.gender || "",
        education: user?.education || "",
        role: ["Job Hunter", "Student", "Freelancer", "Hired Professional"].includes(user?.role) ? user?.role : "Job Hunter",
    });
    const [saving, setSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sync formData dynamically once User loads from context
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                gender: user.gender || "",
                education: user.education || "",
                role: ["Job Hunter", "Student", "Freelancer", "Hired Professional"].includes(user.role) ? user.role : "Job Hunter",
            });
        }
    }, [user]);

    // Force a fresh fetch when landing here to sync status edits from AllJobs
    useEffect(() => {
        refreshUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Storyline State
    const [acceptedJob, setAcceptedJob] = useState(null);
    const [loadingJob, setLoadingJob] = useState(true);

    useEffect(() => {
        const fetchLatestJobJourney = async () => {
            try {
                const res = await jobsAPI.getAll({ sort: "latest-updated" });
                if (res.data.jobs && res.data.jobs.length > 0) {
                    // Get the most recently active job application tracking
                    const activeJob = res.data.jobs.find(j => j.status !== "declined" && j.status !== "ghosted");
                    if (activeJob) {
                        setAcceptedJob(activeJob);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch storyline:", err);
            }
            setLoadingJob(false);
        };
        fetchLatestJobJourney();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await userAPI.updateProfile(formData);
            await refreshUser();
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you entirely sure you want to delete your account? This action cannot be undone and you will lose all tracking history.")) return;

        setIsDeleting(true);
        try {
            await userAPI.deleteAccount();
            toast.success("Account deleted successfully. We're sorry to see you go!");
            await logout();
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to delete account");
            setIsDeleting(false);
        }
    };

    const hasHiredDetails = user?.hiredDetails && user?.hiredDetails?.company;
    const showTimeline = acceptedJob && !loadingJob;

    return (
        <div className="max-w-6xl mx-auto pb-10 space-y-8 px-4 sm:px-6 lg:px-8 mt-8 z-10 relative">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Profile Settings
                </h1>
                <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Manage your account details and preferences.
                </p>
            </div>

            <div className={`grid gap-8 ${showTimeline ? 'lg:grid-cols-10' : 'max-w-3xl'}`}>

                {/* Left Column: Editable Details */}
                <div className={`space-y-6 ${showTimeline ? 'lg:col-span-6' : 'w-full'}`}>
                    <Card className="border-border shadow-sm overflow-hidden bg-card transition-all">
                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-24 sm:h-32 border-b border-border/50 relative">
                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                        </div>

                        <CardHeader className="relative pb-0 -mt-12 sm:-mt-16 pl-6">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-card border-4 border-background shadow-lg relative z-10">
                                    <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                                </div>
                                <div className="mb-1 space-y-1">
                                    <CardTitle className="text-2xl font-bold">{user?.username}</CardTitle>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <Mail className="h-3.5 w-3.5" /> {user?.email}
                                        {user?.role === "Hired Professional" && (
                                            <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
                                                Hired
                                            </span>
                                        )}
                                    </div>
                                    {user?.hiredDetails?.company && (
                                        <div className="text-sm text-emerald-600/90 dark:text-emerald-400 font-medium flex flex-wrap items-center gap-1.5 pt-1">
                                            <Briefcase className="h-3.5 w-3.5" />
                                            <span>
                                                Hired as <span className="font-bold text-emerald-700 dark:text-emerald-300">{user.hiredDetails.position}</span> at <span className="font-bold text-emerald-700 dark:text-emerald-300">{user.hiredDetails.company}</span> in {new Date(user.hiredDetails.dateHired).getFullYear()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="mt-8 px-6 pb-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</Label>
                                        <Input
                                            value={formData.username}
                                            onChange={(e) =>
                                                setFormData({ ...formData, username: e.target.value })
                                            }
                                            className="bg-muted/30 focus:bg-background h-11 border-border/60 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="bg-muted/30 focus:bg-background h-11 border-border/60 transition-colors text-muted-foreground"
                                            disabled // Usually email is locked or requires special flow
                                        />
                                    </div>
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Role</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, role: value })
                                            }
                                        >
                                            <SelectTrigger className="bg-muted/30 focus:bg-background h-11 border-border/60 transition-colors">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Job Hunter">Job Hunter</SelectItem>
                                                <SelectItem value="Student">Student</SelectItem>
                                                <SelectItem value="Freelancer">Freelancer</SelectItem>
                                                {user?.hiredDetails?.company && (
                                                    <SelectItem value="Hired Professional">Hired Professional</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(v) =>
                                                setFormData({ ...formData, gender: v })
                                            }
                                        >
                                            <SelectTrigger className="bg-muted/30 focus:bg-background h-11 border-border/60 transition-colors">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Education</Label>
                                        <Input
                                            value={formData.education}
                                            onChange={(e) =>
                                                setFormData({ ...formData, education: e.target.value })
                                            }
                                            placeholder="e.g. BS Computer Science"
                                            className="bg-muted/30 focus:bg-background h-11 border-border/60 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/40 flex justify-end">
                                    <Button type="submit" disabled={saving} className="w-full sm:w-auto px-8 shadow-sm">
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-border shadow-sm overflow-hidden bg-card transition-all">
                        <CardHeader className="pb-3 border-b border-border/40">
                            <CardTitle className="text-foreground text-lg font-bold flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                                Account Management
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">
                                Irreversible and destructive actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-semibold text-foreground">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Permanently delete your account and all of your data. This action cannot be undone.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="w-full sm:w-auto shadow-sm transition-transform hover:scale-105"
                                >
                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Timeline / Analytics Container */}
                {showTimeline && (
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
                        <div className="bg-card border border-border/40 shadow-sm rounded-2xl overflow-hidden relative group flex flex-col max-h-[calc(100vh-8rem)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                            {/* Fixed Header within Card */}
                            <div className="px-6 pt-6 pb-4 border-b border-border/40 relative z-10 bg-card/80 backdrop-blur-sm shrink-0">
                                <div>
                                    <div className="text-xl font-bold flex items-center gap-2">
                                        <Trophy className="h-6 w-6 text-emerald-500" /> Application Journey
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Tracking your latest opportunity
                                    </p>
                                </div>
                            </div>

                            {/* Scrollable Timeline Area */}
                            <div className="p-6 relative z-10 overflow-y-auto overflow-x-hidden flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border/60 hover:[&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-track]:bg-transparent">
                                <div className="relative mx-1 sm:mx-2">
                                    {/* Vertical Line exactly centered on 12px (left of container 0 offset) */}
                                    <div className="absolute left-[11px] top-3 bottom-0 w-[2px] bg-gradient-to-b from-border/40 via-border/80 to-transparent"></div>

                                    <div className="space-y-10 relative pr-2">

                                        {/* Timeline Item 1: Start */}
                                        <div className="relative pl-10 sm:pl-12 group">
                                            {/* Dot precisely at left 0 with w-6, making its center 12px */}
                                            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background bg-muted-foreground/30 shadow-sm z-10 transition-colors group-hover:bg-muted-foreground/50 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
                                            </div>
                                            <div className="w-full">
                                                <div className="text-[11px] sm:text-xs font-bold text-muted-foreground mb-1 pt-1 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{acceptedJob ? new Date(acceptedJob.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Journey Started"}</span>
                                                    <span className="ml-auto sm:ml-2 text-foreground/70 font-medium">Status: Applied</span>
                                                </div>
                                                <div className="text-sm font-semibold text-foreground py-1 inline-block">
                                                    Created Application {acceptedJob?.position && acceptedJob?.company ? <span>for <span className="font-bold">{acceptedJob.position}</span> at <span className="font-bold">{acceptedJob.company}</span></span> : ""}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline Item 2: Interviewed (Optional) */}
                                        {(acceptedJob?.interviewedAt || ["interview", "offer", "accepted"].includes(acceptedJob?.status)) && (
                                            <div className="relative pl-10 sm:pl-12 group">
                                                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background bg-purple-500/80 shadow-sm z-10 transition-colors group-hover:bg-purple-500 flex items-center justify-center"></div>
                                                <div className="w-full">
                                                    <div className="text-[11px] sm:text-xs font-bold text-purple-500/80 mb-1 pt-1 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                                                        <CalendarCheck className="h-4 w-4" />
                                                        <span>{(acceptedJob.interviewedAt ? new Date(acceptedJob.interviewedAt) : new Date(acceptedJob.updatedAt)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        <span className="ml-auto sm:ml-2 text-purple-600 dark:text-purple-400 font-medium">Status: Interview</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-foreground py-1 inline-block">
                                                        Passed Initial Screening
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Middle Nodes: Tasks / Interview Prep */}
                                        {acceptedJob?.tasks?.filter(t => t.isCompleted)?.map((task, idx) => (
                                            <div key={task._id || idx} className="relative pl-10 sm:pl-12 group">
                                                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background bg-blue-500/80 shadow-sm z-10 transition-colors group-hover:bg-blue-500 flex items-center justify-center"></div>
                                                <div className="w-full">
                                                    <div className="text-[11px] sm:text-xs font-bold text-blue-500/80 mb-1 pt-1 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                                                        <CheckSquare className="h-4 w-4" />
                                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Task Completed"}</span>
                                                        <span className="ml-auto sm:ml-2 text-blue-600 dark:text-blue-400 font-medium">Interview/Task</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-foreground py-1 inline-block">
                                                        {task.title}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Timeline Item Final: Hired */}
                                        {acceptedJob?.status === "accepted" && user?.hiredDetails?.company && (
                                            <div className="relative pl-10 sm:pl-12 group">
                                                {/* Dot */}
                                                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background bg-emerald-500 shadow-sm ring-4 ring-emerald-500/20 z-10 transition-colors group-hover:bg-emerald-400 flex items-center justify-center"></div>
                                                <div className="w-full">
                                                    <div className="text-[11px] sm:text-xs font-bold text-emerald-500 mb-1 pt-1 flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider">
                                                        <CalendarCheck className="h-4 w-4" />
                                                        <span>{new Date(user.hiredDetails.dateHired).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        <span className="ml-auto sm:ml-2 text-emerald-600 dark:text-emerald-400 font-medium">Status: Accepted</span>
                                                    </div>
                                                    <div className="py-1">
                                                        <h4 className="font-bold text-foreground text-lg tracking-tight">
                                                            {user.hiredDetails.position}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium mt-0.5">
                                                            <Briefcase className="h-4 w-4 relative -top-[1px]" />
                                                            {user.hiredDetails.company}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
