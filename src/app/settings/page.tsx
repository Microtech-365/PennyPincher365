'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/user-context";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { user, login } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSave = () => {
        if (user) {
            login({ ...user, name, email });
            // In a real app, you'd show a success toast here
        }
    }

    if (!user) {
        return (
             <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="max-w-3xl mx-auto w-full">
                    <p>Please log in to view settings.</p>
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </CardContent>
                </Card>
                
                <Separator className="my-8" />

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage your notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <p className="text-sm text-muted-foreground">Notification settings coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
