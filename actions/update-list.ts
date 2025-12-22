"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateList(boardId: string, listId: string, formData: FormData) {
  const title = formData.get("title") as string;
  
  try {
    await db.list.update({
      where: { id: listId },
      data: { title },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update list" };
  }
}