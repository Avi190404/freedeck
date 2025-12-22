"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions";

export async function deleteList(boardId: string, listId: string) {
  // --- SECURITY: OWNER ONLY ---
  const canDelete = await isBoardOwner(boardId);
  if (!canDelete) {
    return { error: "Only the board owner can delete lists." };
  }
  // ----------------------------

  try {
    await db.list.delete({
      where: {
        id: listId,
        boardId,
      },
    });
  } catch (error) {
    return { error: "Failed to delete." };
  }

  revalidatePath(`/board/${boardId}`);
  return { success: "List deleted" };
}