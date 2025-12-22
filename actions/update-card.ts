"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions";

export async function updateCard(boardId: string, cardId: string, formData: FormData) {
  // --- SECURITY: OWNER ONLY ---
  const canUpdate = await isBoardOwner(boardId);
  if (!canUpdate) {
    return { error: "Only the board owner can edit card details." };
  }
  // ----------------------------

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  // Handle dates if you have them in formData
  
  try {
    await db.card.update({
      where: {
        id: cardId,
        list: { boardId },
      },
      data: {
        title,
        description,
      },
    });
  } catch (error) {
    return { error: "Failed to update." };
  }

  revalidatePath(`/board/${boardId}`);
  return { success: "Card updated" };
}