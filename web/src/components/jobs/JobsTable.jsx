import { Button } from "@/components/ui/button";
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
import {
    Pencil,
    Trash2,
    MapPin,
    MoreHorizontal,
    ExternalLink,
    ChevronDown,
    Briefcase,
} from "lucide-react";
import { STATUS_OPTIONS, STATUS_BADGE_CLASSES } from "@/lib/constants";

export default function JobsTable({ jobs, onEdit, onDelete, onStatusChange }) {
    return (
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
                                if (e.target.closest('a') || e.target.closest('button')) return;
                                onEdit(job);
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <button className={`inline-flex items-center shadow-sm rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-105 hover:shadow-md ${STATUS_BADGE_CLASSES[job.status] || STATUS_BADGE_CLASSES.pending}`}>
                                                {job.status}
                                                <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-[140px]">
                                            {STATUS_OPTIONS.map((status) => (
                                                <DropdownMenuItem
                                                    key={status}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onStatusChange(job._id, status);
                                                    }}
                                                    className="capitalize cursor-pointer font-medium"
                                                >
                                                    {status}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                                            <DropdownMenuItem onClick={() => onEdit(job)} className="cursor-pointer font-medium py-2">
                                                <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(job._id);
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
    );
}
