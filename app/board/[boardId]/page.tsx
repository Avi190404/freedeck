import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BoardContent } from "@/components/board-content";

interface BoardIdPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default async function BoardIdPage({
  params,
}: BoardIdPageProps) {
  const { boardId } = await params;

  const board = await db.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      lists: {
        orderBy: {
          order: "asc",
        },
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div className="p-4 h-full overflow-x-auto bg-background">
       <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-2xl font-bold text-foreground">{board.title}</h1>
      </div>
      
      {/* Hand off to Client Component */}
      <BoardContent 
        boardId={board.id} 
        data={board.lists} 
      />
    </div>
  );
}