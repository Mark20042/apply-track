import { useState, useEffect } from "react";
import { jobsAPI } from "@/lib/api";
import {
    CheckSquare,
    CalendarClock,
    Calendar as CalendarIcon,
    AlertCircle,
    CheckCircle2,
    Clock,
    Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format, isToday, isTomorrow, isBefore, startOfDay, addDays } from "date-fns";
import TaskCard from "@/components/tasks/TaskCard";
import AddTaskForm from "@/components/tasks/AddTaskForm";

export default function Tasks() {
    const [allTasks, setAllTasks] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", dueDate: "", jobId: "" });

    useEffect(() => {
        const fetchAndExtractTasks = async () => {
            try {
                const res = await jobsAPI.getAll({ limit: 500 });
                const jobs = res.data.jobs || [];
                let extractedTasks = [];

                jobs.forEach((job) => {
                    if (job.tasks && job.tasks.length > 0) {
                        job.tasks.forEach((task) => {
                            extractedTasks.push({
                                ...task,
                                jobId: job._id,
                                company: job.company,
                                position: job.position,
                                jobStatus: job.status,
                                parentJobTasks: job.tasks,
                            });
                        });
                    }
                });

                extractedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setAllTasks(extractedTasks);
                setAllJobs(jobs);
            } catch (error) {
                console.error("Failed to fetch jobs for tasks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAndExtractTasks();
    }, []);

    const getTaskStatusInfo = (task) => {
        if (task.isCompleted) {
            return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "Completed" };
        }
        const date = startOfDay(new Date(task.dueDate));
        const today = startOfDay(new Date());
        const nextWeek = addDays(today, 7);

        if (date < today) return { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", text: "Overdue" };
        if (isToday(date)) return { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "Due Today" };
        if (isTomorrow(date)) return { icon: CalendarClock, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "Tomorrow" };
        if (isBefore(date, nextWeek)) return { icon: CalendarIcon, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", text: "This Week" };
        return { icon: CalendarIcon, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "Later" };
    };

    const handleToggleTask = async (taskToToggle) => {
        const updatedTasks = allTasks.map(t =>
            t._id === taskToToggle._id ? { ...t, isCompleted: !t.isCompleted } : t
        );
        setAllTasks(updatedTasks);

        try {
            const payloadTasks = taskToToggle.parentJobTasks.map(t =>
                t._id === taskToToggle._id ? { ...t, isCompleted: !taskToToggle.isCompleted } : t
            );
            await jobsAPI.update(taskToToggle.jobId, { tasks: payloadTasks });

            setAllTasks(prev => prev.map(t => {
                if (t.jobId === taskToToggle.jobId) return { ...t, parentJobTasks: payloadTasks };
                return t;
            }));
            toast.success(`Task marked as ${!taskToToggle.isCompleted ? 'completed' : 'pending'}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task status");
            setAllTasks(allTasks);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.dueDate || !newTask.jobId) {
            return toast.error("Please fill in all fields (Job, Title, Date)");
        }
        setIsSubmitting(true);
        try {
            const targetJob = allJobs.find(j => j._id === newTask.jobId);
            if (!targetJob) throw new Error("Job not found");

            const updatedJobTasks = [...(targetJob.tasks || []), { title: newTask.title, dueDate: newTask.dueDate, isCompleted: false }];
            const res = await jobsAPI.update(targetJob._id, { tasks: updatedJobTasks });
            const updatedJobFromServer = res.data.job;
            const updatedTasksFromServer = updatedJobFromServer.tasks;
            const createdTask = updatedTasksFromServer[updatedTasksFromServer.length - 1];

            const formattedNewTask = {
                ...createdTask,
                jobId: updatedJobFromServer._id,
                company: updatedJobFromServer.company,
                position: updatedJobFromServer.position,
                jobStatus: updatedJobFromServer.status,
                parentJobTasks: updatedTasksFromServer,
            };

            setAllTasks(prev => {
                const refreshed = [...prev, formattedNewTask];
                refreshed.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                return refreshed;
            });
            setAllJobs(prev => prev.map(j => j._id === targetJob._id ? updatedJobFromServer : j));
            toast.success("Task added successfully!");
            setNewTask({ title: "", dueDate: "", jobId: "" });
            setShowAddForm(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add task");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async (taskToDelete) => {
        try {
            const filteredTasks = taskToDelete.parentJobTasks.filter(t => t._id !== taskToDelete._id);
            const res = await jobsAPI.update(taskToDelete.jobId, { tasks: filteredTasks });
            const updatedJobFromServer = res.data.job;

            setAllTasks(prev => prev.filter(t => t._id !== taskToDelete._id));
            setAllJobs(prev => prev.map(j => j._id === taskToDelete.jobId ? updatedJobFromServer : j));
            setAllTasks(prev => prev.map(t => {
                if (t.jobId === taskToDelete.jobId) return { ...t, parentJobTasks: updatedJobFromServer.tasks };
                return t;
            }));
            toast.success("Task deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete task");
        }
    };

    const handleEditTaskSubmit = async (e) => {
        e.preventDefault();
        if (!editingTask.title || !editingTask.dueDate) {
            return toast.error("Title and Due Date are required");
        }
        setIsSubmitting(true);
        try {
            const targetJob = allJobs.find(j => j._id === editingTask.jobId);
            if (!targetJob) throw new Error("Job not found");

            const updatedJobTasks = targetJob.tasks.map(t =>
                t._id === editingTask._id ? { ...t, title: editingTask.title, dueDate: editingTask.dueDate } : t
            );
            const res = await jobsAPI.update(editingTask.jobId, { tasks: updatedJobTasks });
            const updatedJobFromServer = res.data.job;
            const updatedTasksFromServer = updatedJobFromServer.tasks;

            setAllTasks(prev => {
                const refreshed = prev.map(t => {
                    if (t._id === editingTask._id) return { ...t, title: editingTask.title, dueDate: editingTask.dueDate, parentJobTasks: updatedTasksFromServer };
                    if (t.jobId === editingTask.jobId) return { ...t, parentJobTasks: updatedTasksFromServer };
                    return t;
                });
                refreshed.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                return refreshed;
            });
            setAllJobs(prev => prev.map(j => j._id === targetJob._id ? updatedJobFromServer : j));
            toast.success("Task updated");
            setEditingTask(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // Grouping Logic
    const groupedTasks = { Overdue: [], Today: [], Tomorrow: [], 'This Week': [], Later: [], Completed: [] };
    allTasks.forEach(task => {
        if (task.isCompleted) { groupedTasks.Completed.push(task); return; }
        const date = startOfDay(new Date(task.dueDate));
        const today = startOfDay(new Date());
        const nextWeek = addDays(today, 7);

        if (date < today) groupedTasks.Overdue.push(task);
        else if (isToday(date)) groupedTasks.Today.push(task);
        else if (isTomorrow(date)) groupedTasks.Tomorrow.push(task);
        else if (isBefore(date, nextWeek)) groupedTasks['This Week'].push(task);
        else groupedTasks.Later.push(task);
    });

    const groupOrder = ['Overdue', 'Today', 'Tomorrow', 'This Week', 'Later', 'Completed'];

    return (
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-6 rounded-2xl border border-border/50">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <CheckSquare className="h-8 w-8 text-primary" />
                        Tasks Accross Your Applications
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage all upcoming interviews, assessments, and follow-ups across your applications.
                    </p>
                </div>
                {!showAddForm && (
                    <Button className="shadow-sm" onClick={() => setShowAddForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Quick Add Task
                    </Button>
                )}
            </div>

            {/* Inline Add Task Form */}
            {showAddForm && (
                <AddTaskForm
                    allJobs={allJobs}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    isSubmitting={isSubmitting}
                    onSubmit={handleAddTask}
                    onClose={() => setShowAddForm(false)}
                />
            )}

            {!showAddForm && allTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 lg:p-24 border border-dashed rounded-2xl bg-card/50">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <CheckSquare className="h-10 w-10 text-primary/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">No tasks scheduled</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
                        You don't have any tasks pending across your active applications.
                        Head over to your board to start tracking your next moves.
                    </p>
                    <Link to="/dashboard/jobs" className="mt-6">
                        <Button variant="outline">Go to Board</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-10">
                    {groupOrder.map(groupName => {
                        const tasksInGroup = groupedTasks[groupName];
                        if (tasksInGroup.length === 0) return null;

                        return (
                            <div key={groupName} className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                                    <h2 className={`text-lg font-semibold tracking-tight ${groupName === 'Overdue' ? 'text-destructive' : groupName === 'Completed' ? 'text-muted-foreground' : 'text-foreground'}`}>
                                        {groupName}
                                    </h2>
                                    <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                        {tasksInGroup.length}
                                    </Badge>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                    {tasksInGroup.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            statusInfo={getTaskStatusInfo(task)}
                                            editingTask={editingTask}
                                            isSubmitting={isSubmitting}
                                            onToggle={handleToggleTask}
                                            onEdit={setEditingTask}
                                            onDelete={handleDeleteTask}
                                            onEditSubmit={handleEditTaskSubmit}
                                            onEditCancel={() => setEditingTask(null)}
                                            onEditChange={setEditingTask}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
