"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function deleteCard(boardId: string, cardId: string) {
  try {
    await db.card.delete({
      where: { id: cardId },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete." };
  }
}