import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminProfile() {
    const { user, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [saving, setSaving] = useState(false);
    const [changingPw, setChangingPw] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminAPI.updateProfile(formData);
            await refreshUser();
            toast.success("Profile updated!");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setChangingPw(true);
        try {
            await adminAPI.updateProfile(passwordData);
            toast.success("Password changed!");
            setPasswordData({ currentPassword: "", newPassword: "" });
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to change password");
        } finally {
            setChangingPw(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Admin Profile</h1>
                <p className="mt-1 text-muted-foreground">Manage your admin account</p>
            </div>

            <Card className="glass-card border-0">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle>{user?.username}</CardTitle>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Username</Label>
                                <Input
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="glass-card border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value,
                                    })
                                }
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" disabled={changingPw}>
                            {changingPw && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Change Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
