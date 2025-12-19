import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "@/components/board-navbar";

// 1. Update the Type definition here
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ boardId: string }> 
}) {
  // 2. Await params before using boardId
  const { boardId } = await params;
  
  const board = await db.board.findUnique({
    where: { id: boardId },
  });

  return {
    title: board?.title || "Board",
  };
}

// 3. Update the Type definition here as well
export default async function BoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ boardId: string }>;
}) {
  // 4. Await params here too
  const { boardId } = await params;

  const board = await db.board.findUnique({
    where: {
      id: boardId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div className="relative h-full bg-no-repeat bg-cover bg-center">
      <BoardNavbar data={board} />
      
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">
        {children}
      </main>
    </div>
  );
}