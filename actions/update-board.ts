"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateBoard(boardId: string, title: string) {
  try {
    await db.board.update({
      where: { id: boardId },
      data: { title },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update" };
  }
}