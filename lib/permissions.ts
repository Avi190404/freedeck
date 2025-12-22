import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-service";

export const isBoardOwner = async (boardId: string) => {
  const user = await getSession();
  if (!user) return false;

  const board = await db.board.findUnique({
    where: {
      id: boardId,
      ownerId: user.id, // Check against ownerId field
    },
  });

  return !!board;
};

export const hasAccess = async (boardId: string) => {
  const user = await getSession();
  if (!user) return false;

  // 1. Check if Owner
  const isOwner = await db.board.findUnique({
    where: { id: boardId, ownerId: user.id },
  });
  if (isOwner) return true;

  // 2. Check if Member (Using the new BoardMember table)
  const isMember = await db.boardMember.findFirst({
    where: { 
      boardId: boardId, 
      userId: user.id 
    },
  });

  return !!isMember;
};