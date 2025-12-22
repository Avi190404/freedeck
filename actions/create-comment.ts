"use server";

import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";

export async function createComment(boardId: string, cardId: string, message: string) {
  try {
    const card = await db.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return { error: "Card not found" };
    }

    await db.auditLog.create({
      data: {
        orgId: "default-org",
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
        entityTitle: card.title,
        action: ACTION.COMMENT,
        userId: "user_123",
        // FIX: Use a default DiceBear avatar so you don't need a local file
        userImage: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png", 
        userName: "Guest User",
        message: message,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to create comment." };
  }
}