"use server";

import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

export async function fetchAuditLogs(cardId: string) {
  try {
    const logs = await db.auditLog.findMany({
      where: {
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3, // Optional: Limit to recent 3, or remove this line to show all
    });

    return logs;
  } catch (error) {
    return [];
  }
}