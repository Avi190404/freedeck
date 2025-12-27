"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-service";

export async function respondInvite(notificationId: string, accept: boolean) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    // 1. Get the notification
    const notification = await db.notification.findUnique({
      where: { id: notificationId, userId: session.id }, 
    });

    if (!notification) return { error: "Notification not found" };

    if (accept) {
      // 2. ACCEPT: Create the BoardMember
      await db.boardMember.create({
        data: {
          userId: session.id,
          boardId: notification.entityId,
        }
      });
    }

    // 3. CLEANUP: Delete the notification (whether accepted or declined)
    await db.notification.delete({
      where: { id: notificationId }
    });

    revalidatePath("/");
    return { success: accept ? "Joined board!" : "Invite declined" };

  } catch (error) {
    return { error: "Something went wrong" };
  }
}