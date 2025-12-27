"use server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-service";

export async function getNotifications() {
  const session = await getSession();
  if (!session) return [];

  const notifications = await db.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" }
  });

  return notifications;
}