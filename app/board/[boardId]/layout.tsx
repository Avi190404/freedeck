import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "@/components/board-navbar";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ boardId: string }> 
}) {
  const { boardId } = await params;
  const board = await db.board.findUnique({
    where: { id: boardId },
  });

  return {
    title: board?.title || "Board",
  };
}

export default async function BoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ boardId: string }>;
}) {
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
    <div 
      className="relative h-full w-full bg-no-repeat bg-cover bg-center flex flex-col"
      // style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <div className="shrink-0 z-40 bg-background/50 backdrop-blur-md">
        <BoardNavbar data={board} />
      </div>
      <main className="grow relative bg-background/40 overflow-hidden">
        {children}
      </main>
      
    </div>
  );
}