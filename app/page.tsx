import Link from "next/link";
import { redirect } from "next/navigation";
import { User2, Plus } from "lucide-react";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-service"; 
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createBoard } from "@/actions/create-board";

export default async function Home() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const boards = await db.board.findMany({
    where: {
      OR: [
        { ownerId: user.id },                   
        { members: { some: { userId: user.id } } } 
      ]
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-x-2">
           <User2 className="h-8 w-8 text-neutral-500" />
           Your Boards
        </h1>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Board
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 pt-3" side="bottom" align="start">
             <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                Create board
             </div>
             
             {/* --- DEBUGGING VERSION --- */}
             <form action={async (formData) => {
                "use server";
                const title = formData.get("title");
                console.log("Attempting to create board:", title);
                
                const result = await createBoard(formData);
                
                if (result?.error) {
                    console.error("❌ CREATE BOARD FAILED:", result.error);
                } else {
                    console.log("✅ Board created successfully");
                }
             }} className="space-y-4">
                <div className="space-y-1">
                   <input 
                      id="title" 
                      name="title" 
                      required 
                      placeholder="Enter board title" 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                   />
                </div>
                <Button className="w-full" type="submit">
                   Create
                </Button>
             </form>
          </PopoverContent>
        </Popover>
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
             <p>No boards found.</p>
             <p className="text-sm">Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-neutral-100 dark:bg-neutral-800 rounded-sm h-full w-full p-2 overflow-hidden hover:opacity-90 transition shadow-sm border"
              style={{ backgroundImage: board.imageFullUrl ? `url(${board.imageFullUrl})` : undefined }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="relative font-semibold text-white truncate">
                {board.title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}