"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions";

export async function createList(formData: FormData) {
  const title = formData.get("title") as string;
  const boardId = formData.get("boardId") as string;

  if (!title || !boardId) {
    return { error: "Missing fields" };
  }

  // --- SECURITY: OWNER ONLY ---
  const canCreate = await isBoardOwner(boardId);
  if (!canCreate) {
    return { error: "Only the board owner can create lists." };
  }
  // ----------------------------

  try {
    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });
  } catch (error) {
    return { error: "Failed to create list." };
  }

  revalidatePath(`/board/${boardId}`);
  return { success: "List created" };
}