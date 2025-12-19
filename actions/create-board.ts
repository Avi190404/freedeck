"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Define the schema (validation rules)
const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
});

export async function createBoard(formData: FormData) {
  const { title } = CreateBoard.parse({
    title: formData.get("title"),
  });

  try {
    // 2. Database interaction
    await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Board.",
    };
  }

  // 3. Revalidate (refresh) the dashboard so the new board shows up
  revalidatePath("/");
  redirect("/");
}