"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions"; // <--- Import

export async function deleteBoard(id: string) {
  // --- SECURITY: OWNER ONLY ---
  const canDelete = await isBoardOwner(id);
  
  if (!canDelete) {
    return { error: "Only the board owner can delete this board." };
  }
  // ----------------------------

  try {
    await db.board.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return { error: "Failed to delete." };
  }

  revalidatePath("/");
  redirect("/");
}