import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Building2,
    Briefcase,
    MoreVertical,
    Pencil,
    Trash2,
    Save,
    XIcon,
} from "lucide-react";
import { format } from "date-fns";

export default function TaskCard({
    task,
    statusInfo,
    editingTask,
    isSubmitting,
    onToggle,
    onEdit,
    onDelete,
    onEditSubmit,
    onEditCancel,
    onEditChange,
}) {
    const StatusIcon = statusInfo.icon;

    return (
        <div className={`flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:shadow-md relative overflow-hidden group ${task.isCompleted ? 'opacity-60 bg-muted/20' : ''}`}>
            {/* Editing State Overlay Form */}
            {editingTask?._id === task._id ? (
                <div className="absolute inset-0 z-20 bg-card p-4 flex flex-col justify-center border rounded-xl animate-in fade-in duration-200 shadow-lg">
                    <form onSubmit={onEditSubmit} className="space-y-3">
                        <div>
                            <Label className="text-xs text-muted-foreground">Edit Title</Label>
                            <Input
                                className="h-8 text-sm mt-1"
                                value={editingTask.title}
                                onChange={e => onEditChange({ ...editingTask, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Label className="text-xs text-muted-foreground">Edit Date</Label>
                                <Input
                                    type="date"
                                    className="h-8 text-sm mt-1"
                                    value={format(new Date(editingTask.dueDate), 'yyyy-MM-dd')}
                                    onChange={e => onEditChange({ ...editingTask, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <Button size="icon" className="h-8 w-8 shrink-0 bg-emerald-500 hover:bg-emerald-600" disabled={isSubmitting} type="submit">
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={onEditCancel}>
                                <XIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            ) : null}

            {/* Status Indicator Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusInfo.bg}`} />

            {/* Edit / Delete Dropdown Menu */}
            <div className="absolute right-3 top-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/50 hover:bg-muted backdrop-blur-sm shadow-sm border border-border/50">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2 cursor-pointer">
                            <Pencil className="h-4 w-4" />
                            Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(task)} className="text-destructive focus:text-destructive gap-2 cursor-pointer">
                            <Trash2 className="h-4 w-4 text-destructive/80" />
                            Delete Task
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-start gap-4 p-5">
                <div className="pt-0.5 shrink-0">
                    <Checkbox
                        checked={task.isCompleted}
                        onCheckedChange={() => onToggle(task)}
                        className={`h-5 w-5 rounded-[4px] border-2 transition-all ${task.isCompleted ? 'data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500' : 'border-muted-foreground/30 hover:border-primary'}`}
                    />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                    <h3 className={`font-semibold text-base leading-tight mb-2 ${task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                    </h3>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground truncate">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{task.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/80 truncate">
                            <Briefcase className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{task.position}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto px-5 py-3 border-t border-border/50 bg-muted/10 flex items-center justify-between">
                <div className={`flex items-center gap-2 text-xs font-semibold ${statusInfo.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                </div>
                <Badge variant="outline" className={`capitalize shrink-0 font-medium text-[10px] ${statusInfo.bg} ${statusInfo.color} border-transparent`}>
                    {statusInfo.text}
                </Badge>
            </div>
        </div>
    );
}
