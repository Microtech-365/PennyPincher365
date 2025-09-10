'use client'

import { Header } from "@/components/header";
import React from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/user-context";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useUser();
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (isAuthPage) {
        return <>{children}</>;
    }

    if (!user && typeof window !== 'undefined') {
        const router = require('next/navigation').useRouter();
        router.push('/login');
        return null;
    }
    
    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
        </div>
    )
}
