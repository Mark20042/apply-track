import { useState, useEffect, useCallback } from "react";
import { jobsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
    STATUS_OPTIONS,
    WORK_SETTING_OPTIONS,
    SORT_OPTIONS,
    EMPTY_JOB,
} from "@/lib/constants";
import JobFormDialog from "@/components/jobs/JobFormDialog";
import JobsTable from "@/components/jobs/JobsTable";

export default function AllJobs() {
    const [jobs, setJobs] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [numOfPages, setNumOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [workSettingFilter, setWorkSettingFilter] = useState("all");
    const [sort, setSort] = useState("latest");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [formData, setFormData] = useState({ ...EMPTY_JOB });
    const [saving, setSaving] = useState(false);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await jobsAPI.getAll({
                page: currentPage,
                search,
                status: statusFilter,
                workSetting: workSettingFilter,
                sort,
            });
            setJobs(data.jobs);
            setTotalJobs(data.totalJobs);
            setNumOfPages(data.numOfPages);
        } catch (err) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, statusFilter, workSettingFilter, sort]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                company: formData.company,
                position: formData.position,
                status: formData.status,
                jobType: formData.jobType || "full-time",
                workSetting: formData.workSetting || "remote",
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
            setFormData(EMPTY_JOB);
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

    const handleStatusChange = async (jobId, newStatus) => {
        setJobs(jobs.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
        try {
            await jobsAPI.update(jobId, { status: newStatus });
            toast.success("Status updated");
        } catch (err) {
            toast.error("Failed to update status");
            fetchJobs();
        }
    };

    const openNewDialog = () => {
        setEditingJob(null);
        setFormData({ ...EMPTY_JOB, tasks: [] });
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
                <JobFormDialog
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    editingJob={editingJob}
                    formData={formData}
                    setFormData={setFormData}
                    saving={saving}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                    onOpenNew={openNewDialog}
                    onTaskChange={handleTaskChange}
                    onAddTask={addTask}
                    onRemoveTask={removeTask}
                />
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
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
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
                <Select value={workSettingFilter} onValueChange={(v) => { setWorkSettingFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Work" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Work</SelectItem>
                        {WORK_SETTING_OPTIONS.map((w) => (
                            <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sort} onValueChange={(v) => { setSort(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
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
                <JobsTable
                    jobs={jobs}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                />
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
