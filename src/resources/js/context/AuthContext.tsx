import React, { createContext, useContext, useEffect, useState } from "react";

type AuthUser = {
    email: string;
    username: string;
    phone: string | null;
    created_at: string;
};

type AuthState = {
    user: AuthUser | null;
};

type AuthContextType = AuthState & {
    setAuth: (user: AuthUser) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        // Try to restore session from server-side cookie via /api/me.
        // This works even when the token cookie is HttpOnly.
        (async () => {
            try {
                const res = await fetch("/api/me", { credentials: "include" });
                if (!res.ok) {
                    localStorage.removeItem("user");
                    setUser(null);
                    return;
                }

                const data = await res.json();
                // UserResource returns data in `data` key or directly — handle both
                const payload = data.data ?? data;
                const u = {
                    email: payload.email,
                    username: payload.username,
                    phone: payload.phone ?? null,
                    created_at: payload.created_at,
                } as AuthUser;

                setUser(u);
                localStorage.setItem("user", JSON.stringify(u));
            } catch (e) {
                localStorage.removeItem("user");
                setUser(null);
            }
        })();
    }, []);

    const setAuth = (u: AuthUser) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
    };

    const logout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            // ignore
        }

        // Clear user state and local storage
        setUser(null);
        localStorage.removeItem("user");

        // Clear all cookies accessible from JS
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name =
                eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            // Clear cookie for current path
            document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            // Also attempt to clear for the current domain
            try {
                const domain = window.location.hostname;
                document.cookie = `${name}=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            } catch {
                // ignore domain errors
            }
        }

        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) throw new Error("useAuth must be used within AuthProvider");

    return ctx;
}

export default AuthContext;
