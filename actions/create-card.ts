"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isBoardOwner } from "@/lib/permissions"; 

export async function createCard(formData: FormData) {
  const title = formData.get("title") as string;
  const boardId = formData.get("boardId") as string;
  const listId = formData.get("listId") as string;

  if (!title || !boardId || !listId) {
    return { error: "Missing fields" };
  }

  // --- SECURITY: OWNER ONLY ---
  const canCreate = await isBoardOwner(boardId);
  if (!canCreate) {
    return { error: "Only the board owner can create cards." };
  }
  // ----------------------------

  let card;

  try {
    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });

    // Create Audit Log (Optional)
    // await createAuditLog(...) 

  } catch (error) {
    return { error: "Failed to create card." };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}