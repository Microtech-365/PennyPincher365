'use client'

import { Header } from "@/components/header";
import { SidebarProvider, Sidebar, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { CreditCard, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: CreditCard },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <Sidebar>
                    <SidebarMenu>
                        {navLinks.map(({ href, label, icon }) => (
                            <SidebarMenuItem key={href}>
                                <Link href={href} legacyBehavior passHref>
                                    <SidebarMenuButton
                                        isActive={pathname === href}
                                        icon={icon}
                                        tooltip={label}
                                    >
                                        {label}
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </Sidebar>
                <div className="flex flex-col flex-1">
                    <Header />
                    <SidebarInset>
                        {children}
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    )
}
