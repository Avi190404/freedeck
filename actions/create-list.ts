"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createList(boardId: string, title: string) {
  try {
    if (!title || !boardId) {
        return { error: "Missing fields" };
    }

    // 1. Get the last list to calculate the new order
    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    // 2. Create the list
    const list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });

    // 3. Revalidate the board page so the new list appears
    revalidatePath(`/board/${boardId}`);
    
    return { data: list };
  } catch (error) {
    return { error: "Failed to create." };
  }
}