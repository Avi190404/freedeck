import Link from "next/link";
import { db } from "@/lib/db";
import { CreateBoardDialog } from "@/components/create-board-dialog";

export default async function Home() {
  const boards = await db.board.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full h-full p-6 space-y-8 bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold text-foreground">Your Boards</h1>
        <CreateBoardDialog />
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {boards.map((board) => (
          <Link 
            key={board.id} 
            href={`/board/${board.id}`}
            className="group relative block h-32 w-full"
          >
            {/* The Card - SOLID Style */}
            <div className="
              h-full w-full 
              rounded-lg border border-border bg-card text-card-foreground shadow-sm
              hover:shadow-md hover:border-primary/50
              p-4 
              flex flex-col justify-between
              transition-all duration-200
            ">
              <span className="font-semibold text-lg truncate">
                {board.title}
              </span>
              
              <div className="flex justify-end">
                 <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    Open Board →
                 </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State - Keep dashed ONLY for this one */}
      {boards.length === 0 && (
        <div className="flex items-center justify-center h-48 w-full border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
          <p>No boards found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}