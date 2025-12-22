"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { hasAccess } from "@/lib/permissions"; // <--- NOTE: hasAccess (Member OR Owner)

export async function updateCardOrder(items: any[], boardId: string) {
  
  // --- SECURITY: MEMBER ALLOWED ---
  const canMove = await hasAccess(boardId);
  if (!canMove) {
    return { error: "Unauthorized" };
  }
  // -------------------------------

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
  } catch (error) {
    return { error: "Failed to reorder." };
  }

  revalidatePath(`/board/${boardId}`);
  return { success: true };
}