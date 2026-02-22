import { createContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "@/lib/api";

export const AuthContext = createContext(null);

let hasChecked = false;

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hasChecked) {
            setLoading(false);
            return;
        }
        hasChecked = true;

        // Use /user/me (optional auth) so we get 200 + { user } or { user: null } instead of 401 when not logged in
        userAPI
            .getMe()
            .then(({ data }) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        const profile = await userAPI.getProfile();
        setUser(profile.data.user);
        return data;
    };

    const register = async (username, email, password, options = {}) => {
        const { data } = await authAPI.register({
            username,
            email,
            password,
            ...options,
        });
        const profile = await userAPI.getProfile();
        setUser(profile.data.user);
        return data;
    };

    const logout = async () => {
        await authAPI.logout();
        setUser(null);
        hasChecked = false;
    };

    const refreshUser = async () => {
        const { data } = await userAPI.getProfile();
        setUser(data.user);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}
