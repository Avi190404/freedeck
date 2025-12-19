"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const CreateCard = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  boardId: z.string(),
  listId: z.string(),
});

export async function createCard(formData: FormData) {
  const { title, boardId, listId } = CreateCard.parse({
    title: formData.get("title"),
    boardId: formData.get("boardId"),
    listId: formData.get("listId"),
  });

  try {
    // 1. Find the last card to calculate order
    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    // 2. Create the card
    await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });

    // 3. Refresh the board
    revalidatePath(`/board/${boardId}`);
    return { success: true };

  } catch (error) {
    return {
      error: "Failed to create card."
    };
  }
}