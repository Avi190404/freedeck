"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateCard(boardId: string, cardId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  try {
    await db.card.update({
      where: { id: cardId },
      data: {
        title,
        description,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update." };
  }
}