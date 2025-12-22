"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-service"; // <--- DID YOU ADD THIS?

export async function createBoard(formData: FormData) {
  const title = formData.get("title") as string;
  
  if (!title) {
    return { error: "Title is required" };
  }

  // 1. Get User
  const user = await getSession();

  if (!user) {
    return { error: "Unauthorized" };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        ownerId: user.id, // <--- CRITICAL: THIS MUST BE HERE
      },
    });

    // Create default list
    await db.list.create({
      data: { title: "Todo", order: 1, boardId: board.id }
    });

  } catch (error) {
    console.log("Database Error:", error); // Check terminal for this!
    return { error: "Failed to create board." };
  }

  revalidatePath(`/board/${board.id}`);
  redirect(`/board/${board.id}`);
}