import { useState, useEffect, useCallback } from "react";
import { jobsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    MapPin,
    DollarSign,
    Building2,
    Loader2,
    Briefcase,
    MoreHorizontal,
    ExternalLink,
    CheckSquare,
    CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_OPTIONS = [
    "pending",
    "interview",
    "declined",
    "accepted",
    "offer",
    "ghosted",
];
const JOB_TYPE_OPTIONS = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
];
const WORK_SETTING_OPTIONS = [
    { value: "remote", label: "Remote" },
    { value: "on-site", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
];
const SORT_OPTIONS = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "salary-high", label: "Highest Salary" },
    { value: "salary-low", label: "Lowest Salary" },
];

const emptyJob = {
    company: "",
    position: "",
    status: "pending",
    jobType: "full-time",
    workSetting: "remote",
    jobLocation: "Remote",
    currency: "USD",
    minSalary: "",
    maxSalary: "",
    jobLink: "",
    tasks: [],
};

export default function AllJobs() {
    const [jobs, setJobs] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [numOfPages, setNumOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jobTypeFilter, setJobTypeFilter] = useState("all");
    const [workSettingFilter, setWorkSettingFilter] = useState("all");
    const [sort, setSort] = useState("latest");

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [formData, setFormData] = useState(emptyJob);
    const [saving, setSaving] = useState(false);

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await jobsAPI.getAll({
                search,
                status: statusFilter,
                jobType: jobTypeFilter,
                workSetting: workSettingFilter,
                sort,
                page: currentPage,
                limit: 9,
            });
            setJobs(data.jobs);
            setTotalJobs(data.totalJobs);
            setNumOfPages(data.numOfPages);
        } catch (err) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, jobTypeFilter, workSettingFilter, sort, currentPage]);

    useEffect(() => {
        const debounce = setTimeout(() => fetchJobs(), 300);
        return () => clearTimeout(debounce);
    }, [fetchJobs]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                company: formData.company,
                position: formData.position,
                status: formData.status,
                jobType: formData.jobType,
                workSetting: formData.workSetting,
                jobLocation: formData.jobLocation || "Remote",
                currency: formData.currency || "USD",
                minSalary: formData.minSalary ? Number(formData.minSalary) : 0,
                maxSalary: formData.maxSalary ? Number(formData.maxSalary) : 0,
                tasks: formData.tasks || [],
                ...(formData.jobLink?.trim() && { jobLink: formData.jobLink.trim() }),
            };
            if (editingJob) {
                await jobsAPI.update(editingJob._id, payload);
                toast.success("Job updated!");
            } else {
                await jobsAPI.create(payload);
                toast.success("Job added!");
            }
            setDialogOpen(false);
            setEditingJob(null);
            setFormData(emptyJob);
            fetchJobs();
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to save job");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            company: job.company,
            position: job.position,
            status: job.status,
            jobType: job.jobType || "full-time",
            workSetting: job.workSetting || "remote",
            jobLocation: job.jobLocation || "Remote",
            currency: job.currency || "USD",
            minSalary: job.minSalary ?? "",
            maxSalary: job.maxSalary ?? "",
            jobLink: job.jobLink || "",
            tasks: job.tasks || [],
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await jobsAPI.delete(id);
            toast.success("Job deleted");
            fetchJobs();
        } catch {
            toast.error("Failed to delete job");
        }
    };

    const openNewDialog = () => {
        setEditingJob(null);
        setFormData({ ...emptyJob, tasks: [] });
        setDialogOpen(true);
    };

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...(formData.tasks || [])];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setFormData({ ...formData, tasks: newTasks });
    };

    const addTask = () => {
        setFormData({
            ...formData,
            tasks: [...(formData.tasks || []), { title: "", isCompleted: false, dueDate: "" }],
        });
    };

    const removeTask = (index) => {
        const newTasks = [...(formData.tasks || [])];
        newTasks.splice(index, 1);
        setFormData({ ...formData, tasks: newTasks });
    };

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Jobs</h1>
                    <p className="mt-2 text-base text-muted-foreground">
                        {totalJobs} application{totalJobs !== 1 ? "s" : ""} tracked
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog} className="h-10">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Job
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl p-0 overflow-hidden bg-background shadow-2xl border-border/60">
                        {/* Premium Header Map */}
                        <div className="bg-card border-b border-border/50 px-6 py-4 flex flex-col gap-1 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                {editingJob ? "View & Edit Application" : "New Application"}
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground">Keep your application details, compensation, and tasks heavily organized here.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Core Details Card */}
                                <div className="space-y-4 bg-card/80 p-6 rounded-2xl border border-border/60 shadow-md relative group">
                                    <div className="absolute top-3 right-3 opacity-10">
                                        <Briefcase className="h-16 w-16" />
                                    </div>
                                    <h3 className="text-sm font-bold tracking-tight border-b border-border/40 pb-2 flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-primary" /> Core Details
                                    </h3>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5 z-10">
                                            <Label className="text-xs font-semibold text-muted-foreground">Company *</Label>
                                            <Input
                                                value={formData.company}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, company: e.target.value })
                                                }
                                                required
                                                className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                            />
                                        </div>
                                        <div className="space-y-1.5 z-10">
                                            <Label className="text-xs font-semibold text-muted-foreground">Position *</Label>
                                            <Input
                                                value={formData.position}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, position: e.target.value })
                                                }
                                                required
                                                className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 z-10">
                                        <Label className="text-xs font-semibold text-muted-foreground">Status Dashboard</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(v) =>
                                                setFormData({ ...formData, status: v })
                                            }
                                        >
                                            <SelectTrigger className="h-10 border-primary/20 bg-primary/5 font-semibold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map((s) => (
                                                    <SelectItem key={s} value={s} className="font-medium">
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Environment & Comp Card */}
                                <div className="space-y-4 bg-card/80 p-6 rounded-2xl border border-border/60 shadow-md relative group">
                                    <div className="absolute top-3 right-3 opacity-10">
                                        <DollarSign className="h-16 w-16" />
                                    </div>
                                    <h3 className="text-sm font-bold tracking-tight border-b border-border/40 pb-2 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-500" /> Environment
                                    </h3>

                                    <div className="grid gap-4 grid-cols-2 z-10">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-muted-foreground">Job Type</Label>
                                            <Select
                                                value={formData.jobType}
                                                onValueChange={(v) =>
                                                    setFormData({ ...formData, jobType: v })
                                                }
                                            >
                                                <SelectTrigger className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {JOB_TYPE_OPTIONS.map((t) => (
                                                        <SelectItem key={t.value} value={t.value}>
                                                            {t.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-muted-foreground">Work Setting</Label>
                                            <Select
                                                value={formData.workSetting}
                                                onValueChange={(v) =>
                                                    setFormData({ ...formData, workSetting: v })
                                                }
                                            >
                                                <SelectTrigger className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {WORK_SETTING_OPTIONS.map((w) => (
                                                        <SelectItem key={w.value} value={w.value}>
                                                            {w.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 z-10 relative">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-muted-foreground">Location</Label>
                                            <Input
                                                value={formData.jobLocation}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, jobLocation: e.target.value })
                                                }
                                                placeholder="e.g. Remote"
                                                className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-muted-foreground">Role Link</Label>
                                            <Input
                                                value={formData.jobLink}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        jobLink: e.target.value,
                                                    })
                                                }
                                                placeholder="https://..."
                                                className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 z-10 relative pt-2">
                                        <Label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Target Compensation Range</Label>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={formData.currency}
                                                onValueChange={(v) =>
                                                    setFormData({ ...formData, currency: v })
                                                }
                                            >
                                                <SelectTrigger className="w-[85px] bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                    <SelectItem value="GBP">GBP</SelectItem>
                                                    <SelectItem value="INR">INR</SelectItem>
                                                    <SelectItem value="PHP">PHP</SelectItem>
                                                    <SelectItem value="CAD">CAD</SelectItem>
                                                    <SelectItem value="AUD">AUD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                value={formData.minSalary}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, minSalary: e.target.value })
                                                }
                                                placeholder="Min"
                                                className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                            />
                                            <span className="text-muted-foreground/50">-</span>
                                            <Input
                                                type="number"
                                                value={formData.maxSalary}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, maxSalary: e.target.value })
                                                }
                                                placeholder="Max"
                                                className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Job Tasks Section Full Width Card */}
                            <div className="bg-card/80 p-6 rounded-2xl border border-border/60 shadow-md">
                                <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                                    <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                        <CheckSquare className="h-4 w-4 text-purple-500" />
                                        Application Checklist
                                    </h3>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="h-7 text-xs font-semibold"
                                        onClick={addTask}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Task
                                    </Button>
                                </div>
                                {(!formData.tasks || formData.tasks.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border/60 rounded-xl bg-muted/20">
                                        <CheckSquare className="h-8 w-8 text-muted-foreground/40 mb-3" />
                                        <p className="text-sm font-semibold text-foreground/80">Your checklist is empty.</p>
                                        <p className="text-xs text-muted-foreground max-w-[280px] mt-1.5 leading-relaxed">
                                            Track your technical homework, interview prep, or thank you emails here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 pb-2">
                                        {formData.tasks.map((task, i) => (
                                            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors group ${task.isCompleted ? 'bg-muted/10 border-border/30' : 'bg-background hover:bg-muted/20 border-border/50 shadow-sm'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={task.isCompleted}
                                                    onChange={(e) => handleTaskChange(i, 'isCompleted', e.target.checked)}
                                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                                                />
                                                <Input
                                                    value={task.title}
                                                    onChange={(e) => handleTaskChange(i, 'title', e.target.value)}
                                                    placeholder="Task description (e.g., Send thank you email)"
                                                    className={`flex-1 h-8 bg-transparent border-0 focus-visible:ring-1 shadow-none px-2 ${task.isCompleted ? 'line-through text-muted-foreground opacity-70' : 'font-medium'}`}
                                                />
                                                <div className="flex items-center gap-2 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md border border-border/40">
                                                        <CalendarIcon className={`h-3 w-3 ${task.isCompleted ? 'text-muted-foreground/40' : 'text-muted-foreground'}`} />
                                                        <input
                                                            type="date"
                                                            value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                                            onChange={(e) => handleTaskChange(i, 'dueDate', e.target.value)}
                                                            className={`bg-transparent text-[11px] font-medium w-[90px] outline-none ${task.isCompleted ? 'text-muted-foreground/50' : 'text-foreground cursor-pointer'}`}
                                                            disabled={task.isCompleted}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                        onClick={() => removeTask(i)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                {editingJob && (
                                    <Button type="button" variant="destructive" className="sm:w-[150px]" onClick={() => {
                                        handleDelete(editingJob._id);
                                        setDialogOpen(false);
                                    }}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Job
                                    </Button>
                                )}
                                <Button type="submit" className="flex-1 font-bold tracking-wide" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingJob ? "Save Changes" : "Create Application"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 shadow-sm sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search company or position..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-12 h-12 text-base bg-background/50"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                        setStatusFilter(v);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={workSettingFilter}
                    onValueChange={(v) => {
                        setWorkSettingFilter(v);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Work" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Work</SelectItem>
                        {WORK_SETTING_OPTIONS.map((w) => (
                            <SelectItem key={w.value} value={w.value}>
                                {w.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={sort}
                    onValueChange={(v) => {
                        setSort(v);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Jobs grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : jobs.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                    <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold">No jobs found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {search || statusFilter !== "all" || workSettingFilter !== "all"
                            ? "Try adjusting your filters"
                            : "Click Add Job to get started"}
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[50px] font-semibold">Log</TableHead>
                                    <TableHead className="font-semibold">Company</TableHead>
                                    <TableHead className="font-semibold">Position</TableHead>
                                    <TableHead className="font-semibold hidden md:table-cell">Type</TableHead>
                                    <TableHead className="font-semibold hidden sm:table-cell">Location</TableHead>
                                    <TableHead className="font-semibold hidden lg:table-cell">Salary</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job._id} className="cursor-pointer hover:bg-muted/30 transition-colors group" onClick={(e) => {
                                        // prevent modal open if they specifically click the external link or dropdown
                                        if (e.target.closest('a') || e.target.closest('button')) return;
                                        handleEdit(job);
                                    }}>
                                        <TableCell>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary group-hover:scale-105 transition-transform">
                                                {job.company?.[0]?.toUpperCase()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground text-sm xl:text-base">
                                            {job.company}
                                            {job.jobLink && (
                                                <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex align-middle text-muted-foreground hover:text-primary transition-colors">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm xl:text-base font-medium text-muted-foreground">{job.position}</TableCell>
                                        <TableCell className="text-muted-foreground capitalize hidden md:table-cell text-sm">
                                            {job.jobType?.replace('-', ' ')}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground hidden sm:table-cell">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <MapPin className="h-3.5 w-3.5 opacity-70" />
                                                <span className="truncate max-w-[120px]">{job.jobLocation || "Remote"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground hidden lg:table-cell text-sm font-medium">
                                            {job.maxSalary > 0
                                                ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{job.currency} {job.minSalary.toLocaleString()} - {job.maxSalary.toLocaleString()}</span>
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center shadow-sm rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${job.status === 'interview' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                job.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                    job.status === 'offer' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                                                        job.status === 'declined' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                            job.status === 'ghosted' ? 'bg-gray-500/10 text-gray-500 border-gray-500/20' :
                                                                'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 transition-colors">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem onClick={() => handleEdit(job)} className="cursor-pointer font-medium py-2">
                                                        <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(job._id);
                                                    }} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium py-2">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {numOfPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: numOfPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
