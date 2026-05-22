import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/router/paths";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AdminRouteGuard() {
    const { user } = useAuth();
    const location = useLocation();
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        let isActive = true;

        (async () => {
            if (user?.role === "admin") {
                if (isActive) {
                    setIsCheckingAccess(false);
                }

                return;
            }

            try {
                const response = await fetch("/api/me", {
                    credentials: "include",
                });

                if (!response.ok) {
                    if (isActive) {
                        setIsCheckingAccess(false);
                        setShouldRedirect(true);
                    }

                    return;
                }

                const data = await response.json();
                const payload = data.data ?? data;

                if (payload?.role !== "admin") {
                    if (isActive) {
                        setIsCheckingAccess(false);
                        setShouldRedirect(true);
                    }

                    return;
                }
            } catch {
                if (isActive) {
                    setIsCheckingAccess(false);
                    setShouldRedirect(true);
                }

                return;
            }

            if (isActive) {
                setIsCheckingAccess(false);
            }
        })();

        return () => {
            isActive = false;
        };
    }, [user]);

    if (isCheckingAccess) {
        return null;
    }

    if (shouldRedirect) {
        return (
            <Navigate
                to={PATHS.ADMIN_LOGIN}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}
