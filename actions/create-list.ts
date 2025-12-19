"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const CreateList = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  boardId: z.string(),
});

export async function createList(formData: FormData) {
  const { title, boardId } = CreateList.parse({
    title: formData.get("title"),
    boardId: formData.get("boardId"),
  });

  try {
    // 1. Find the last list to calculate the new order
    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    // 2. Create the new list
    await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });

    // 3. Refresh the board page
    revalidatePath(`/board/${boardId}`);
    return { success: true };
    
  } catch (error) {
    return {
      error: "Failed to create list."
    };
  }
}