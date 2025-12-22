"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions"; // <--- Import

export async function updateBoard(boardId: string, formData: FormData) {
  const title = formData.get("title") as string;
  
  if (!title) return { error: "Title is required" };

  // --- SECURITY: OWNER ONLY ---
  const canUpdate = await isBoardOwner(boardId);
  
  if (!canUpdate) {
    return { error: "Only the board owner can rename this board." };
  }
  // ----------------------------

  try {
    await db.board.update({
      where: {
        id: boardId,
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return { error: "Failed to update." };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: { title } }; // Return updated data if needed
}