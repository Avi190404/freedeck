"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions";

export async function createList(data: FormData | { title: string; boardId: string }) {
  // LOG 1: See exactly what the frontend sent
  console.log("--- createList Action Started ---");
  console.log("Raw Data Type:", data instanceof FormData ? "FormData" : "Object");
  console.log("Raw Data Value:", data);

  let title: string;
  let boardId: string;

  if (data instanceof FormData) {
    title = data.get("title") as string;
    boardId = data.get("boardId") as string;
  } else {
    title = data.title;
    boardId = data.boardId;
  }

  // LOG 2: See what we extracted
  console.log("Extracted Values -> Title:", title, "| BoardID:", boardId);

  if (!title || !boardId) {
    console.error("❌ ERROR: Missing fields detected.");
    return { error: "Missing fields" };
  }

  // --- SECURITY: OWNER ONLY ---
  const canCreate = await isBoardOwner(boardId);
  if (!canCreate) {
    console.error("❌ ERROR: Permission denied for boardId:", boardId);
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
    
    console.log("✅ SUCCESS: List created.");
  } catch (error) {
    console.error("❌ DB ERROR:", error);
    return { error: "Failed to create list." };
  }

  revalidatePath(`/board/${boardId}`);
  return { success: "List created" };
}