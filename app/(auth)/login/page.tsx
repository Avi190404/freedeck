"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/login";

const LoginPage = () => {
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    const res = await login(formData);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      // Success is handled by the redirect in the action, 
      // but strictly speaking, we might not reach here if redirect happens.
      toast.success("Welcome back!");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>

      <form action={onSubmit} className="space-y-4">
        <div className="space-y-2">
           <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
             Email
           </label>
           <Input 
             id="email" 
             name="email" 
             type="email" 
             placeholder="m@example.com" 
             required 
           />
        </div>
        <div className="space-y-2">
           <div className="flex items-center justify-between">
             <label className="text-sm font-medium leading-none" htmlFor="password">
               Password
             </label>
           </div>
           <Input 
             id="password" 
             name="password" 
             type="password" 
             required 
           />
        </div>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;