"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function deleteBoard(boardId: string) {
  await db.board.delete({
    where: { id: boardId },
  });

  revalidatePath("/");
  redirect("/"); // Kick user back to dashboard after deleting
}