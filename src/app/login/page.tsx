'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation";
import React from "react";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { CircleDollarSign } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useUser();
    const { toast } = useToast();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const result = login(email, password);

        if (result.success) {
            router.push('/');
        } else {
            toast({
                title: "Login Failed",
                description: result.error,
                variant: "destructive",
            });
        }
    }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-background lg:flex items-center justify-center p-8">
        <img
            src="/dashboard.png"
            alt="PennyPincher365 Dashboard"
            width={1280}
            height={800}
            className="w-full max-w-2xl h-auto rounded-lg shadow-2xl object-cover"
            data-ai-hint="dashboard analytics"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-sm">
            <form onSubmit={handleLogin}>
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <CircleDollarSign className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold">PennyPincher365</h1>
                    </div>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit">Sign in</Button>
                 <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
                </CardFooter>
            </form>
          </Card>
      </div>
    </div>
  )
}
