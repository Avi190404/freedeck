"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateCard(boardId: string, cardId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  // Get date strings from the form
  const startDateStr = formData.get("startDate") as string;
  const dueDateStr = formData.get("dueDate") as string;

  // Convert strings to Date objects (or null if empty)
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const dueDate = dueDateStr ? new Date(dueDateStr) : null;

  try {
    await db.card.update({
      where: { id: cardId },
      data: {
        title,
        description,
        startDate, // Saving Start Date
        dueDate,   // Saving Due Date
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update." };
  }
}