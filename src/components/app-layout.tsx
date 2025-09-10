'use client'

import { Header } from "@/components/header";
import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
        </div>
    )
}
