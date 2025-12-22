"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function deleteList(boardId: string, listId: string) {
  try {
    await db.list.delete({
      where: { id: listId },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete." };
  }
}