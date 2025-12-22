"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/actions/register";

const RegisterPage = () => {
  const onSubmit = async (formData: FormData) => {
    const res = await register(formData);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Account created!");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your information below to create your account
        </p>
      </div>

      <form action={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-sm font-medium leading-none" htmlFor="name">
               Full Name
             </label>
             <Input id="name" name="name" placeholder="John Doe" required />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium leading-none" htmlFor="username">
               Username
             </label>
             <Input id="username" name="username" placeholder="johndoe" required />
           </div>
        </div>
        
        <div className="space-y-2">
           <label className="text-sm font-medium leading-none" htmlFor="email">
             Email
           </label>
           <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        
        <div className="space-y-2">
           <label className="text-sm font-medium leading-none" htmlFor="password">
             Password
           </label>
           <Input id="password" name="password" type="password" required />
        </div>

        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;