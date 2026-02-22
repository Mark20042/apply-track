import {
    Clock,
    MessageSquare,
    XCircle,
    CheckCircle2,
    Gift,
    Ghost,
} from "lucide-react";

// ── Status ────────────────────────────────────────────────
export const STATUS_OPTIONS = [
    "pending",
    "interview",
    "declined",
    "accepted",
    "offer",
    "ghosted",
];

export const STATUS_CONFIG = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/10", hex: "#f59e0b" },
    interview: { label: "Interview", icon: MessageSquare, color: "text-blue-500", border: "border-blue-500/20", bg: "bg-blue-500/10", hex: "#3b82f6" },
    offer: { label: "Offer", icon: Gift, color: "text-purple-500", border: "border-purple-500/20", bg: "bg-purple-500/10", hex: "#a855f7" },
    accepted: { label: "Accepted", icon: CheckCircle2, color: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/10", hex: "#10b981" },
    declined: { label: "Declined", icon: XCircle, color: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/10", hex: "#ef4444" },
    ghosted: { label: "Ghosted", icon: Ghost, color: "text-slate-500", border: "border-slate-500/20", bg: "bg-slate-500/10", hex: "#64748b" },
};

export const STATUS_BADGE_CLASSES = {
    interview: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    offer: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    declined: "bg-red-500/10 text-red-600 border-red-500/20",
    ghosted: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

// ── Job Form Options ──────────────────────────────────────
export const JOB_TYPE_OPTIONS = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
];

export const WORK_SETTING_OPTIONS = [
    { value: "remote", label: "Remote" },
    { value: "on-site", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
];

export const SORT_OPTIONS = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "salary-high", label: "Highest Salary" },
    { value: "salary-low", label: "Lowest Salary" },
];

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "INR", "PHP", "CAD", "AUD"];

export const EMPTY_JOB = {
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
