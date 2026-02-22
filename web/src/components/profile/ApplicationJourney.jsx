import { Trophy, Briefcase, CalendarCheck, CheckSquare, Clock } from "lucide-react";

export default function ApplicationJourney({ activeJobs }) {
    return (
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border/40 shadow-sm rounded-2xl overflow-hidden relative group flex flex-col max-h-[calc(100vh-8rem)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                {/* Fixed Header */}
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

                {/* Scrollable Timeline */}
                <div className="p-6 relative z-10 overflow-y-auto overflow-x-hidden flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border/60 hover:[&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-track]:bg-transparent">
                    <div className="space-y-12 pb-6">
                        {activeJobs.map((acceptedJob, index) => (
                            <div key={acceptedJob._id} className="relative mx-1 sm:mx-2">
                                {index > 0 && <div className="my-6 border-t border-border/40 border-dashed" />}
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-primary" /> {acceptedJob.company} - {acceptedJob.position}
                                    </h3>
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                                        {acceptedJob.status}
                                    </span>
                                </div>

                                {/* Vertical Line */}
                                <div className={`absolute left-[11px] ${index > 0 ? 'top-12' : 'top-10'} bottom-0 w-[2px] bg-gradient-to-b from-border/40 via-border/80 to-transparent`} />

                                <div className="space-y-10 relative pr-2">
                                    {/* Timeline Item 1: Start */}
                                    <div className="relative pl-10 sm:pl-12 group">
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

                                    {/* Timeline Item 2: Interviewed */}
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

                                    {/* Middle Nodes: Tasks */}
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
                                    {acceptedJob?.status === "accepted" && (
                                        <div className="relative pl-10 sm:pl-12 group">
                                            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background bg-emerald-500 shadow-sm ring-4 ring-emerald-500/20 z-10 transition-colors group-hover:bg-emerald-400 flex items-center justify-center"></div>
                                            <div className="w-full">
                                                <div className="text-[11px] sm:text-xs font-bold text-emerald-500 mb-1 pt-1 flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider">
                                                    <CalendarCheck className="h-4 w-4" />
                                                    <span>{acceptedJob.updatedAt ? new Date(acceptedJob.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}</span>
                                                    <span className="ml-auto sm:ml-2 text-emerald-600 dark:text-emerald-400 font-medium">Status: Accepted</span>
                                                </div>
                                                <div className="py-1">
                                                    <h4 className="font-bold text-foreground text-lg tracking-tight">
                                                        {acceptedJob.position}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium mt-0.5">
                                                        <Briefcase className="h-4 w-4 relative -top-[1px]" />
                                                        {acceptedJob.company}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
