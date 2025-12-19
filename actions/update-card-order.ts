"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateCardOrder(items: any[], boardId: string) {
  try {
    const transaction = items.map((card) => 
      db.card.update({
        where: { id: card.id },
        data: { 
          order: card.order,
          listId: card.listId,
        },
      })
    );

    await db.$transaction(transaction);
    revalidatePath(`/board/${boardId}`);
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to reorder." };
  }
}