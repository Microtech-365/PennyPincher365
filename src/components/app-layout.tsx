'use client'

import { Header } from "@/components/header";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    useEffect(() => {
        if (!user && !isAuthPage) {
            router.push('/login');
        }
    }, [user, isAuthPage, router]);

    if (isAuthPage) {
        return <>{children}</>;
    }
    
    if (!user) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
        </div>
    )
}
