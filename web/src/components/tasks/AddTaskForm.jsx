import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare, XIcon, Save } from "lucide-react";

export default function AddTaskForm({
    allJobs,
    newTask,
    setNewTask,
    isSubmitting,
    onSubmit,
    onClose,
}) {
    return (
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    Create New Task
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onClose}>
                    <XIcon className="h-4 w-4" />
                </Button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="jobId">Link to Job Application</Label>
                        <select
                            id="jobId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            value={newTask.jobId}
                            onChange={(e) => setNewTask({ ...newTask, jobId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select a job application...</option>
                            {allJobs.map(job => (
                                <option key={job._id} value={job._id}>
                                    {job.company} - {job.position}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Complete Take-home Assessment"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                Saving...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Task
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
