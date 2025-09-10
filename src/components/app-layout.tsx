'use client'

import { Header } from "@/components/header";
import React from "react";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
        </div>
    )
}
