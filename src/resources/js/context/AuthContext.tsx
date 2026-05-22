import React, { createContext, useContext, useEffect, useState } from "react";
import { PATHS } from "@/router/paths";

type AuthUser = {
    id: number | string | null;
    email: string;
    username: string;
    phone: string | null;
    role: string;
    created_at: string;
};

type AuthState = {
    user: AuthUser | null;
    token: string | null;
};

type AuthContextType = AuthState & {
    setAuth: (user: AuthUser, token?: string | null) => void;
    logout: (redirectTo?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
        }

        (async () => {
            try {
                const res = await fetch("/api/me", { credentials: "include" });
                if (!res.ok) {
                    localStorage.removeItem("user");
                    setUser(null);
                    return;
                }

                const data = await res.json();
                const payload = data.data ?? data;
                const restoredUser = {
                    id: payload.id ?? null,
                    email: payload.email,
                    username: payload.username,
                    phone: payload.phone ?? null,
                    role: payload.role ?? "user",
                    created_at: payload.created_at,
                } as AuthUser;

                setUser(restoredUser);
                localStorage.setItem("user", JSON.stringify(restoredUser));
            } catch {
                localStorage.removeItem("user");
                setUser(null);
            }
        })();
    }, []);

    const setAuth = (nextUser: AuthUser, nextToken: string | null = null) => {
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));

        if (nextToken) {
            setToken(nextToken);
            localStorage.setItem("token", nextToken);
        }
    };

    const logout = async (redirectTo: string = PATHS.LOGIN) => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // ignore
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name =
                eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            try {
                const domain = window.location.hostname;
                document.cookie = `${name}=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            } catch {
                // ignore domain errors
            }
        }

        window.location.href = redirectTo;
    };

    return (
        <AuthContext.Provider value={{ user, token, setAuth, logout }}>
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
