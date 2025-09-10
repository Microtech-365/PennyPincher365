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
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";


export default function SignupPage() {
    const router = useRouter();
    const { signup } = useUser();
    const { toast } = useToast();
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const name = `${firstName} ${lastName}`;
        const result = await signup({ name, email, password });

        if(result.success) {
            router.push('/');
        } else {
            toast({
                title: "Sign-up Failed",
                description: result.error,
                variant: "destructive",
            });
        }
        setIsLoading(false);
    }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-muted lg:flex items-center justify-center p-8">
         <Carousel className="w-full max-w-md" autoplay>
            <CarouselContent>
                {PlaceHolderImages.map((img) => (
                    <CarouselItem key={img.id}>
                        <Image
                            src={img.imageUrl}
                            alt={img.description}
                            width={1280}
                            height={800}
                            className="w-full h-auto rounded-lg shadow-lg"
                            data-ai-hint={img.imageHint}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
      </div>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-sm">
         <form onSubmit={handleSignup}>
          <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                  <CircleDollarSign className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-bold">PennyPincher365</h1>
              </div>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create an account'}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
