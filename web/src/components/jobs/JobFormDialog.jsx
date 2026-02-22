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
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Plus,
    Trash2,
    DollarSign,
    Building2,
    Briefcase,
    Loader2,
    CheckSquare,
    CalendarIcon,
    MapPin,
} from "lucide-react";
import {
    STATUS_OPTIONS,
    JOB_TYPE_OPTIONS,
    WORK_SETTING_OPTIONS,
    CURRENCY_OPTIONS,
} from "@/lib/constants";

export default function JobFormDialog({
    dialogOpen,
    setDialogOpen,
    editingJob,
    formData,
    setFormData,
    saving,
    onSubmit,
    onDelete,
    onOpenNew,
    onTaskChange,
    onAddTask,
    onRemoveTask,
}) {
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={onOpenNew} className="h-10 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Job
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] flex flex-col sm:max-w-3xl p-0 overflow-hidden bg-background shadow-2xl border-border/60">
                {/* Premium Header */}
                <div className="shrink-0 bg-card border-b border-border/50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-0.5 sm:gap-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
                    <DialogTitle className="text-base sm:text-xl font-bold flex items-center gap-2">
                        {editingJob ? "View & Edit Application" : "New Application"}
                    </DialogTitle>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">Keep your application details, compensation, and tasks heavily organized here.</p>
                </div>

                <div className="overflow-y-auto flex-1 p-0">
                    <form onSubmit={onSubmit} className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Core Details Card */}
                            <div className="space-y-3 sm:space-y-4 bg-card/80 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-border/60 shadow-md relative group">
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
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            required
                                            className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                        />
                                    </div>
                                    <div className="space-y-1.5 z-10">
                                        <Label className="text-xs font-semibold text-muted-foreground">Position *</Label>
                                        <Input
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            required
                                            className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 z-10">
                                    <Label className="text-xs font-semibold text-muted-foreground">Status Dashboard</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v) => setFormData({ ...formData, status: v })}
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
                            <div className="space-y-3 sm:space-y-4 bg-card/80 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-border/60 shadow-md relative group">
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
                                            onValueChange={(v) => setFormData({ ...formData, jobType: v })}
                                        >
                                            <SelectTrigger className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {JOB_TYPE_OPTIONS.map((t) => (
                                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground">Work Setting</Label>
                                        <Select
                                            value={formData.workSetting}
                                            onValueChange={(v) => setFormData({ ...formData, workSetting: v })}
                                        >
                                            <SelectTrigger className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {WORK_SETTING_OPTIONS.map((w) => (
                                                    <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
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
                                            onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
                                            placeholder="e.g. Remote"
                                            className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground">Role Link</Label>
                                        <Input
                                            value={formData.jobLink}
                                            onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
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
                                            onValueChange={(v) => setFormData({ ...formData, currency: v })}
                                        >
                                            <SelectTrigger className="w-[85px] bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CURRENCY_OPTIONS.map((c) => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="number"
                                            value={formData.minSalary}
                                            onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                                            placeholder="Min"
                                            className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                        />
                                        <span className="text-muted-foreground/50">-</span>
                                        <Input
                                            type="number"
                                            value={formData.maxSalary}
                                            onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                                            placeholder="Max"
                                            className="bg-muted/40 focus:bg-background border-border/50 hover:border-border transition-colors h-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Tasks Section */}
                        <div className="bg-card/80 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-border/60 shadow-md">
                            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                    <CheckSquare className="h-4 w-4 text-purple-500" />
                                    Application Checklist
                                </h3>
                                <Button type="button" variant="secondary" size="sm" className="h-7 text-xs font-semibold" onClick={onAddTask}>
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
                                                onChange={(e) => onTaskChange(i, 'isCompleted', e.target.checked)}
                                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                                            />
                                            <Input
                                                value={task.title}
                                                onChange={(e) => onTaskChange(i, 'title', e.target.value)}
                                                placeholder="Task description (e.g., Send thank you email)"
                                                className={`flex-1 h-8 bg-transparent border-0 focus-visible:ring-1 shadow-none px-2 ${task.isCompleted ? 'line-through text-muted-foreground opacity-70' : 'font-medium'}`}
                                            />
                                            <div className="flex items-center gap-2 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md border border-border/40">
                                                    <CalendarIcon className={`h-3 w-3 ${task.isCompleted ? 'text-muted-foreground/40' : 'text-muted-foreground'}`} />
                                                    <input
                                                        type="date"
                                                        value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                                        onChange={(e) => onTaskChange(i, 'dueDate', e.target.value)}
                                                        className={`bg-transparent text-[11px] font-medium w-[90px] outline-none ${task.isCompleted ? 'text-muted-foreground/50' : 'text-foreground cursor-pointer'}`}
                                                        disabled={task.isCompleted}
                                                    />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => onRemoveTask(i)}>
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
                                    onDelete(editingJob._id);
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
