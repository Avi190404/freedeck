"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-service";

export async function inviteUser(formData: FormData) {
  const email = formData.get("email") as string;
  const boardId = formData.get("boardId") as string;

  if (!email || !boardId) {
    return { error: "Missing fields" };
  }

  // 1. Get Current User (The Inviter)
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    // 2. Verify: Are you the Owner?
    const board = await db.board.findFirst({
      where: {
        id: boardId,
        ownerId: session.id,
      },
    });

    if (!board) {
      return { error: "Only the board owner can invite members." };
    }

    // 3. Find the User you want to invite
    const userToInvite = await db.user.findUnique({
      where: { email },
    });

    if (!userToInvite) {
      return { error: "User not found. Ask them to register first!" };
    }

    // 4. Check if already a member
    const existingMember = await db.boardMember.findFirst({
      where: {
        boardId,
        userId: userToInvite.id,
      },
    });

    if (existingMember || userToInvite.id === session.id) {
      return { error: "User is already a member of this board." };
    }

    // 5. Check if invite already sent (Prevent spam)
    const existingInvite = await db.notification.findFirst({
      where: { 
        userId: userToInvite.id, 
        entityId: boardId, 
        type: "BOARD_INVITE" 
      }
    });

    if (existingInvite) {
      return { error: "Invite already sent to this user." };
    }

    // 6. Create Notification (Instead of direct add)
    await db.notification.create({
      data: {
        userId: userToInvite.id,      // Recipient
        senderId: session.id,         // Sender
        senderName: session.name || "Someone",
        type: "BOARD_INVITE",
        entityId: board.id,
        entityTitle: board.title
      }
    });

    return { success: "Invite sent successfully!" };

  } catch (error) {
    return { error: "Failed to invite user." };
  }
}