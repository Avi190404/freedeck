"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions";

export async function deleteCard(boardId: string, cardId: string) {
  // --- SECURITY: OWNER ONLY ---
  const canDelete = await isBoardOwner(boardId);
  if (!canDelete) {
    return { error: "Only the board owner can delete cards." };
  }
  // ----------------------------

  try {
    await db.card.delete({
      where: {
        id: cardId,
        list: { boardId }, // Extra safety: ensure card belongs to board
      },
    });
  } catch (error) {
    return { error: "Failed to delete." };
  }

  revalidatePath(`/board/${boardId}`);
  return { success: "Card deleted" };
}