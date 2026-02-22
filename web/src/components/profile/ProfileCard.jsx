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
import { User, Mail, Briefcase, Loader2, AlertTriangle } from "lucide-react";

export default function ProfileCard({
    user,
    acceptedJobsList,
    formData,
    setFormData,
    saving,
    isDeleting,
    onSubmit,
    onDeleteAccount,
}) {
    return (
        <div className="space-y-6">
            <Card className="border-border shadow-sm overflow-hidden bg-card transition-all">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-24 sm:h-32 border-b border-border/50 relative">
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
                            {acceptedJobsList.length > 0 ? (
                                <div className="flex flex-col gap-1 pt-1 mt-1">
                                    {acceptedJobsList.map((job) => (
                                        <div key={job._id} className="text-sm text-emerald-600/90 dark:text-emerald-400 font-medium flex flex-wrap items-center gap-1.5">
                                            <Briefcase className="h-3.5 w-3.5" />
                                            <span>
                                                Hired as <span className="font-bold text-emerald-700 dark:text-emerald-300">{job.position}</span> at <span className="font-bold text-emerald-700 dark:text-emerald-300">{job.company}</span> in {job.updatedAt ? new Date(job.updatedAt).getFullYear() : new Date().getFullYear()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : user?.hiredDetails?.company ? (
                                <div className="text-sm text-emerald-600/90 dark:text-emerald-400 font-medium flex flex-wrap items-center gap-1.5 pt-1 mt-1">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    <span>
                                        Hired as <span className="font-bold text-emerald-700 dark:text-emerald-300">{user.hiredDetails.position}</span> at <span className="font-bold text-emerald-700 dark:text-emerald-300">{user.hiredDetails.company}</span> in {new Date(user.hiredDetails.dateHired).getFullYear()}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="mt-8 px-6 pb-8">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</Label>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="bg-muted/30 focus:bg-background h-11 border-border/60 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-muted/30 focus:bg-background h-11 border-border/60 transition-colors text-muted-foreground"
                                    disabled
                                />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
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
                                    onValueChange={(v) => setFormData({ ...formData, gender: v })}
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
                                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
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
                            onClick={onDeleteAccount}
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
    );
}
