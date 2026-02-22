import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { userAPI, jobsAPI } from "@/lib/api";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import ProfileCard from "@/components/profile/ProfileCard";
import ApplicationJourney from "@/components/profile/ApplicationJourney";

export default function Profile() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        role: user?.role || "Job Hunter",
        gender: user?.gender || "Male",
        education: user?.education || "",
    });

    // Storyline State
    const [activeJobs, setActiveJobs] = useState([]);
    const [acceptedJobsList, setAcceptedJobsList] = useState([]);
    const [loadingJob, setLoadingJob] = useState(true);

    useEffect(() => {
        const fetchLatestJobJourney = async () => {
            try {
                const res = await jobsAPI.getAll({ sort: "latest-updated" });
                if (res.data.jobs && res.data.jobs.length > 0) {
                    const accepted = res.data.jobs.filter(j => j.status === "accepted");
                    setAcceptedJobsList(accepted);

                    const active = res.data.jobs.filter(j => j.status !== "declined" && j.status !== "ghosted").slice(0, 3);
                    if (active.length > 0) {
                        setActiveJobs(active);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch storyline:", err);
            }
            setLoadingJob(false);
        };
        fetchLatestJobJourney();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await userAPI.updateProfile(formData);
            setUser(data.user);
            toast.success("Profile updated!");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you absolutely sure? This action is permanent and cannot be undone.")) return;

        setIsDeleting(true);
        try {
            await userAPI.deleteAccount();
            toast.success("Account deleted. We're sorry to see you go.");
            logout();
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to delete account");
        } finally {
            setIsDeleting(false);
        }
    };

    const showTimeline = activeJobs.length > 0 && !loadingJob;

    return (
        <div className="max-w-6xl mx-auto pb-10 space-y-6 sm:space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-8 z-10 relative">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Manage your account details and preferences.
                </p>
            </div>

            <div className={`grid gap-6 sm:gap-8 ${showTimeline ? 'lg:grid-cols-10' : 'max-w-3xl'}`}>
                <div className={`space-y-6 ${showTimeline ? 'lg:col-span-6' : 'w-full'}`}>
                    <ProfileCard
                        user={user}
                        acceptedJobsList={acceptedJobsList}
                        formData={formData}
                        setFormData={setFormData}
                        saving={saving}
                        isDeleting={isDeleting}
                        onSubmit={handleSubmit}
                        onDeleteAccount={handleDeleteAccount}
                    />
                </div>

                {showTimeline && <ApplicationJourney activeJobs={activeJobs} />}
            </div>
        </div>
    );
}
