"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth-service";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing fields" };
  }

  // 1. Find User
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid credentials" };
  }

  // 2. Verify Password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid credentials" };
  }

  // 3. Create Session
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    image: user.image,
  });

  redirect("/");
}