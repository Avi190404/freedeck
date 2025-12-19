"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateListOrder(items: any[], boardId: string) {
  try {
    const transaction = items.map((list) => 
      db.list.update({
        where: { id: list.id },
        data: { order: list.order },
      })
    );

    await db.$transaction(transaction);
    revalidatePath(`/board/${boardId}`);
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to reorder." };
  }
}