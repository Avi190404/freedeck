"use server";

import { db } from "@/lib/db";

export async function getCard(cardId: string) {
  try {
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: {
        list: true, // We might want to know which list it belongs to
      },
    });

    return card;
  } catch (error) {
    return null;
  }
}