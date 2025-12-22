"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth-service";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !username || !email || !password) {
    return { error: "Missing required fields" };
  }

  // 1. Check if user exists
  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: username }
      ]
    }
  });

  if (existingUser) {
    return { error: "Email or Username already taken" };
  }

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create User
  const user = await db.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, // Auto-generate avatar
    },
  });

  // 4. Create Session (Auto-login after register)
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    image: user.image,
  });

  redirect("/");
}